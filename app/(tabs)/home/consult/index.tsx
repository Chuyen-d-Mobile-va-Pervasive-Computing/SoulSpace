import { router } from "expo-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface Expert {
  id: string;
  name: string;
  image: string;
  experience: string;
  rating: number;
  price: number;
  online: boolean;
}

export default function ExpertScreen() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filtered, setFiltered] = useState<Expert[]>([]);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/experts/`, {
          headers: { accept: "application/json" },
        });

        const json = await res.json();
        const mapped: Expert[] = json.data.map((item: any, index: number) => ({
          id: item._id,
          name: item.full_name,
          image: item.avatar_url,
          experience: `${item.years_of_experience} years`,
          rating: 5.0,
          price: item.consultation_price,
          online: Math.random() > 0.5,
        }));
        setExperts(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.log("API ERROR:", err);
      }
    };
    fetchExperts();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      experts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const applyFilter = (type: string | null) => {
    setSelectedFilter(type);
    setFilterOpen(false);

    switch (type) {
      case "online":
        return setFiltered(experts.filter((item) => item.online));

      case "rating":
        return setFiltered([...experts].sort((a, b) => b.rating - a.rating));

      case "experience":
        return setFiltered(
          [...experts].sort(
            (a, b) =>
              parseInt(b.experience) - parseInt(a.experience)
          )
        );

      case "price":
        return setFiltered([...experts].sort((a, b) => a.price - b.price));

      default:
        return setFiltered(experts);
    }
  };

  const handleStartOrOpenChat = async (expert: Expert) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Lỗi", "Bạn chưa đăng nhập");
        return;
      }

      const response = await fetch(
        `${API_BASE}/api/v1/chat/start/${expert.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể bắt đầu chat: ${response.status}`);
      }

      const result = await response.json();
      router.push({
        pathname: "/(tabs)/home/consult/chat/[chat_id]",
        params: {
          chat_id: result.chat_id,
          name: expert.name,
          avatar: expert.image || "https://i.pravatar.cc/100",
          status: expert.online ? "online" : "offline",
        },
      });
    } catch (err: any) {
      console.error("Start chat error:", err);
      Alert.alert("Lỗi", err.message || "Không thể bắt đầu cuộc trò chuyện");
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
            <ArrowLeft width={32} height={32} />
          </TouchableOpacity>
          <Text className="ml-3 text-2xl text-[#7F56D9] font-[Poppins-Bold]">
            Experts
          </Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View className="px-4 mt-3 flex-row items-center justify-between">
        <View className="flex-1 mr-3 bg-white rounded-2xl px-4 py-3 shadow">
          <TextInput
            placeholder="Search expert by name..."
            value={search}
            onChangeText={handleSearch}
            className="font-[Poppins-Regular]"
          />
        </View>

        <TouchableOpacity
          onPress={() => setFilterOpen(true)}
          className="bg-white p-3 rounded-2xl shadow"
        >
          <SlidersHorizontal size={24} color="#7F56D9" />
        </TouchableOpacity>
      </View>
      {filtered.length === 0 && (
        <Text className="text-center text-gray-500 mt-4 font-[Poppins-Regular]">
          No expert found.
        </Text>
      )}
      {/* List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filtered.map((item: any) => (
          <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow">
            {/* TOP SECTION */}
            <View className="flex-row">
              <View>
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-xl"
                />
                {item.online && (
                  <View className="w-3 h-3 bg-green-500 rounded-full absolute right-0 top-0" />
                )}
              </View>

              {/* Info */}
              <View className="flex-1 ml-4">
                <Text className="text-lg font-[Poppins-Bold]">{item.name}</Text>

                <View className="flex-row gap-4 items-center w-full mt-1">
                  <View className="flex-row gap-2 items-center">
                    <BriefcaseBusiness color="#71717A" size={16} />
                    <Text className="text-[#71717A] font-[Poppins-Regular]">
                      {item.experience}
                    </Text>
                  </View>

                  <View className="flex-row gap-2 items-center">
                    <Star color="#71717A" size={16} />
                    <Text className="text-[#71717A]">{item.rating}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Line */}
            <View className="w-full h-[1px] bg-gray-200 my-3" />

            {/* Bottom */}
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-xl font-[Poppins-Bold]">
                ৳ {item.price}
              </Text>

              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleStartOrOpenChat(item)}
                  className="mr-3 px-4 py-2 bg-transparent rounded-xl"
                >
                  <Text className="text-[#7F56D9] font-[Poppins-Medium]">
                    Chat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/consult/details",
                      params: { id: item.id },
                    })
                  }
                  className="px-4 py-2 bg-[#7F56D9] rounded-xl"
                >
                  <Text className="text-white font-[Poppins-Medium]">Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FILTER MODAL */}
      <Modal visible={filterOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setFilterOpen(false)}
        >
          <Pressable
            onPress={() => {}}
            className="bg-white p-6 rounded-t-3xl shadow-lg"
          >
            <Text className="text-xl font-[Poppins-Bold] mb-4">
              Filter Options
            </Text>

            {[
              { key: "online", label: "Online Experts" },
              { key: "rating", label: "Highest Rating" },
              { key: "experience", label: "Most Experience" },
              { key: "price", label: "Lowest Price" },
              { key: null, label: "Reset Filters" },
            ].map((opt) => (
              <TouchableOpacity
                key={String(opt.key)}
                onPress={() => applyFilter(opt.key)}
                className="flex-row justify-between items-center py-3"
              >
                <Text className="text-lg font-[Poppins-Regular]">
                  {opt.label}
                </Text>

                {selectedFilter === opt.key && (
                  <Check size={20} color="#7F56D9" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setFilterOpen(false)}
              className="mt-4 p-3 bg-gray-200 rounded-xl"
            >
              <Text className="text-center font-[Poppins-Medium]">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}