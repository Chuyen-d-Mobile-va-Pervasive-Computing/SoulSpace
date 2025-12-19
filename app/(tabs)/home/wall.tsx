import { View, Text, Image, ScrollView, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, ToastAndroid, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Sun, Share2, PenLine, ArrowLeft, MessageCircle, Heart } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import PostHeader from "@/components/PostHeader";

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

interface Me {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

interface MyPost {
  _id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  author_name: string;
  hashtags: string[];
  created_at: string;
  moderation_status: string;
  ai_scan_result: string;
  image_url: string | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_owner: boolean;
  toxic_confidence: number;
}

export default function ProfileScreen() {
  const [me, setMe] = useState<Me | null>(null);
  const [level, setLevel] = useState(1);
  const [currentXp, setCurrentXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [canWater, setCanWater] = useState(true);
  const [backendMessage, setBackendMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
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
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch me");
        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };
    fetchMe();
  }, []);

  const uploadAvatar = async (uri: string) => {
    const token = await AsyncStorage.getItem("access_token");

    const formData = new FormData();
    formData.append("file", {
      uri,
      name: "avatar.jpg",
      type: "image/jpeg",
    } as any);

    const res = await fetch(`${API_BASE}/api/v1/upload/user/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  };

  const updateAvatar = async (avatarUrl: string) => {
    const token = await AsyncStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/api/v1/auth/update-avatar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ avatar_url: avatarUrl }),
    });

    if (!res.ok) throw new Error("Update avatar failed");
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;
    try {
      setLoading(true);
      const uploadRes = await uploadAvatar(result.assets[0].uri);
      await updateAvatar(uploadRes.url);
      setMe((prev) =>
        prev ? { ...prev, avatar_url: uploadRes.url } : prev
      );
      Toast.show({ type: "success", text1: "Avatar updated" });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Update avatar failed" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoadingPosts(true);
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/v1/anon-posts/my-posts`, {
            method: "GET",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch my posts");
        const data = await res.json();
        setMyPosts(data);
      } catch (error) {
        console.error("Fetch my posts error:", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchMyPosts();
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
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
            <ArrowLeft width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1">
        {/* Header */}
        <View className="mt-3 mx-4 rounded-2xl items-center">
        <TouchableOpacity onPress={pickAvatar} className="items-center justify-center">
          <View className="relative">
            {/* Avatar */}
            <Image
              source={{ uri: me?.avatar_url }}
              className="w-28 h-28 rounded-full border-4 border-[#E8E1FF]"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
            {/* Loading Spinner */}
            {loading && (
              <View className="absolute inset-0 bg-black/20 rounded-full items-center justify-center">
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            )}
            {/* Camera */}
            <View className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow items-center justify-center">
              <FontAwesome name="camera" size={14} color="#7F56D9" />
            </View>
          </View>
        </TouchableOpacity>

          <View className="flex flex-row mt-3 gap-2">
            <Text className="text-2xl font-[Poppins-Bold] text-gray-800">{me?.username}</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/settings/account")}
              className="mt-2"
            >
              <PenLine color="#4F3422" size={16}/>
            </TouchableOpacity>
          </View>
        </View>
        
        <View className="mt-6 px-4">
          <Text className="text-lg font-[Poppins-SemiBold] mb-3">
            My Posts ({myPosts.length})
          </Text>
          {loadingPosts && <ActivityIndicator />}
          {!loadingPosts && myPosts.length === 0 && (
            <Text className="text-gray-400 text-center font-[Poppins-Regular]">
              You haven't posted anything yet
            </Text>
          )}

          {myPosts.map((post) => (
            <TouchableOpacity 
              key={post._id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
              onPress={() => router.push({
                pathname: "/(tabs)/community/comment",
                params: {postId: post._id}
              })}
            >
              <View className="flex-row justify-between items-start">
                <View className="relative">
                  <PostHeader
                    username={post.author_name}
                    avatarUrl={me?.avatar_url}
                    createdAt={new Date(post.created_at).toLocaleString()}
                    isAnonymous={!me?.avatar_url && post.author_name === "Anonymous"}
                  />
                  {/* {post.role === "expert" && (
                    <View className="absolute -top-1 left-8 bg-[#F59E0B] p-1 rounded-full">
                      <Star size={10} color="white" fill="white" />
                    </View>
                  )} */}
                </View>
                {post.hashtags?.length > 0 && (
                  <View className="flex-row flex-wrap mb-4">
                    {post.hashtags.map((tag) => (
                      <View
                        key={tag}
                        className="border border-[#7F56D9] px-4 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {/* <TouchableOpacity
                  onPress={() => {
                    setSelectedPost(post);
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical width={20} height={20} color="black" />
                </TouchableOpacity> */}
              </View>
              {/* {post.title && (
                <Text className="mt-3 font-[Poppins-Bold]">{post.title}</Text>
              )} */}
              {/* Ảnh bài viết */}
              {post.image_url && (
                <Image
                  source={{ uri: post.image_url }}
                  className="w-full h-64 rounded-xl mt-3"
                  resizeMode="cover"
                />
              )}

              {/* Nội dung */}
              <Text className="text-base mt-3 font-[Poppins-Regular]">
                {post.content}
              </Text>
              {/* Interaction */}
              <View className="flex-row mt-4">
                <View className="flex-row items-center mr-4">
                  <Heart size={18} color="#374151" />
                  <Text className="ml-1 mt-1 font-[Poppins-Regular]">
                    {post.like_count}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MessageCircle size={18} color="#374151" />
                  <Text className="ml-1 mt-1 font-[Poppins-Regular]">
                    {post.comment_count}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
                  className="w-full min-h-[100px] p-3 border border-gray-300 rounded-xl text-gray-800 font-[Poppins-Regular]"
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