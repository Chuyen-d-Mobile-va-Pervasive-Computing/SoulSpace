import { View, Text, Image, ScrollView, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid } from "react-native";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Sun, Share2, PenLine } from "lucide-react-native";
import Heading from "@/components/Heading";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

import Plant1 from "@/assets/images/plant1.svg";
import Plant2 from "@/assets/images/plant2.svg";
import Plant3 from "@/assets/images/plant3.svg";
import Plant4 from "@/assets/images/plant4.svg";
import Plant5 from "@/assets/images/plant5.svg";
import Plant6 from "@/assets/images/plant6.svg";
import Plant7 from "@/assets/images/plant7.svg";
import Plant8 from "@/assets/images/plant8.svg";
import { router } from "expo-router";

export default function ProfileScreen() {
  const user = {
    username: "minh",
    avatar: "https://i.pravatar.cc/300",
    created_at: "2024-01-10",
  };

  const [username, setUsername] = useState<string>("");
  const [level, setLevel] = useState(1);
  const [currentXp, setCurrentXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [canWater, setCanWater] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // NEW STATE for sharing
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareText, setShareText] = useState("");

  const PlantImages = {
    1: Plant1,
    2: Plant2,
    3: Plant3,
    4: Plant4,
    5: Plant5,
    6: Plant6,
    7: Plant7,
    8: Plant8,
  };

  const CurrentPlant = PlantImages[level as keyof typeof PlantImages] || Plant1;
  const progress = nextLevelXp > 0 ? (currentXp / nextLevelXp) * 100 : 0;

  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) setUsername(savedUsername);
    };
    loadUsername();
  }, []);

  useEffect(() => {
    const fetchTreeStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/v1/tree/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) return;

        setLevel(data.current_level_calculated);
        setCurrentXp(data.current_xp_in_level);
        setNextLevelXp(data.xp_for_next_level);
        setStreakDays(data.streak_days);
        setCanWater(data.can_water_today);

        if (!data.can_water_today && data.detail) {
          setBackendMessage(data.detail);
          Toast.show({
            type: "info",
            text1: data.detail,
            position: "bottom",
          });
        }
      } catch (err) {
        console.error("Fetch tree error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTreeStatus();
  }, []);

  // Handle share action
  const handleShare = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      await fetch(`${API_BASE}/api/v1/community/post-tree`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          level,
          content: shareText.trim(),
        }),
      });

      ToastAndroid.show("You have shared your tree", ToastAndroid.SHORT);

      setShareModalVisible(false);
      setShareText("");

    } catch (error) {
      ToastAndroid.show("Error occured", ToastAndroid.SHORT);
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1">
        {/* Header */}
        <View className="mt-3 mx-4 rounded-2xl items-center">
          <Image
            source={{ uri: user.avatar }}
            className="w-28 h-28 rounded-full border-4 border-white shadow"
          />
          <View className="flex flex-row mt-3 gap-2">
            <Text className="text-2xl font-[Poppins-Bold] text-gray-800">{username}</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/settings/account")}
              className="mt-2"
            >
              <PenLine color="#4F3422" size={16}/>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tree Section */}
        <View className="mt-5 mx-4 bg-white rounded-2xl p-4 shadow">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-[Poppins-SemiBold] text-gray-700 mb-3">🌱 Mind Tree</Text>

            {/* NÚT SHARE */}
            <TouchableOpacity
              onPress={() => setShareModalVisible(true)}
              className="p-2 bg-[#7F56D9] rounded-full"
            >
              <Share2 color="white" size={18} />
            </TouchableOpacity>
          </View>

          <View className="mt-10 items-center">
            <CurrentPlant width={200} height={250} />
          </View>

          <View className="w-full p-3">
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center">
                <Text className="text-[#4F3422] font-[Poppins-Medium] text-base mr-2">
                  Level {level}:
                </Text>
                <FontAwesome name="tree" size={14} color="#4A3728" style={{ marginRight: 4 }} />
                <Text className="text-[#4F3422] font-[Poppins-Medium] text-base">
                  {currentXp}/{nextLevelXp} XP
                </Text>
              </View>
              <View className="flex-row items-center">
                <Sun strokeWidth={1.5} color="#ABABAB" />
                <Text className="text-[#ABABAB] font-[Poppins-Medium] text-base ml-2">
                  {streakDays} Day Streak
                </Text>
              </View>
            </View>

            <View className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <View
                className="h-3 rounded-full"
                style={{ width: `${progress}%`, backgroundColor: "#7CB342" }}
              />
            </View>
          </View>
        </View>

        {/* Share Modal */}
        <Modal visible={shareModalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => setShareModalVisible(false)}>
            <View className="flex-1 bg-black/40 justify-center items-center px-5">
              <View className="w-full bg-white rounded-2xl p-5">
                <Text className="text-lg font-[Poppins-Bold] text-gray-800 mb-3 text-center">
                  Share your tree
                </Text>

                {/* Tree Image */}
                <View className="items-center mb-4">
                  <CurrentPlant width={180} height={220} />
                </View>

                {/* Input */}
                <TextInput
                  placeholder="Say something..."
                  value={shareText}
                  onChangeText={setShareText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-xl text-gray-800"
                />

                {/* Buttons */}
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => setShareModalVisible(false)}
                    className="flex-1 py-3 bg-gray-300 rounded-xl mr-2"
                  >
                    <Text className="text-center text-gray-700 font-[Poppins-SemiBold]">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleShare}
                    className="flex-1 py-3 bg-[#7F56D9] rounded-xl ml-2"
                  >
                    <Text className="text-center text-white font-[Poppins-SemiBold]">Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  );
}