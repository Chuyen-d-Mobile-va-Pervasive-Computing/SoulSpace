import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { useRouter } from "expo-router";
import {
  Heart,
  MessageCircle,
  Plus,
  SlidersHorizontal,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CommunityScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Heading */}
      <Heading title="Cộng đồng" showBack onBackPress={() => router.back()} />

      {/* Body */}
      <View className="flex-1 px-4 mt-4">
        {/* Filter */}
        <TouchableOpacity
          className="flex-row justify-end items-center mb-4"
          onPress={() => setFilterVisible(true)}
        >
          <Text className="text-white font-bold text-xs mr-2">Filter</Text>
          <SlidersHorizontal width={20} height={20} color="white" />
        </TouchableOpacity>

        {/* Posts */}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120, // tránh đè nút Add
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Post */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/community/comment")}
            className="p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg"
          >
            {/* Header */}
            <View>
              <Text className="text-white font-semibold text-sm">
                user 01234567
              </Text>
              <Text className="text-gray-300 text-xs mt-1">
                12:20:20 01/01/2025
              </Text>
            </View>

            {/* Content */}
            <Text className="text-white text-base mt-3">Tôi vui lắm</Text>

            {/* Interaction */}
            <View className="flex-row mt-3 gap-6">
              <View className="flex-row items-center gap-1">
                <Heart width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] shadow-lg items-center justify-center"
        onPress={() => router.push("/(tabs)/community/add")}
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="w-80 bg-white p-6 rounded-2xl">
            <Text className="text-lg font-bold mb-4">Sort</Text>
            <TagSelector
              options={[
                { id: 2025, name: "2025" },
                { id: 2024, name: "2024" },
                { id: 2023, name: "2023" },
              ]}
              multiSelect={false}
              onChange={(ids) => console.log("Years:", ids)}
            />
            {/* Close Button */}
            <Pressable
              className="mt-4 bg-[#6F04D9] py-2 rounded-xl"
              onPress={() => setFilterVisible(false)}
            >
              <Text className="text-center text-white font-bold">Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}