"use client";

import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChatScreen() {
  const [search, setSearch] = useState("");

  const experts = [
    {
      id: 1,
      name: "Dr.A",
      message: "Worem consectetur adipiscing elit.",
      avatar: "https://i.pravatar.cc/100",
      unread: true,
    },
    {
      id: 2,
      name: "Dr.B",
      message: "Worem consectetur adipiscing elit.",
      avatar: "https://i.pravatar.cc/101",
      unread: false,
    },
    {
      id: 3,
      name: "Dr.C",
      message: "Worem consectetur adipiscing elit.",
      avatar: "https://i.pravatar.cc/100",
      unread: true,
    },
    {
      id: 4,
      name: "Dr.D",
      message: "Worem consectetur adipiscing elit.",
      avatar: "https://i.pravatar.cc/101",
      unread: false,
    },
  ];

  const filteredCollections = experts.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectExpert = (expertId: number) => {
    const expert = experts.find((expert) => expert.id === expertId);
    if (expert) {
      router.push({ pathname: "/(tabs)/home/consult/chat/[id]", params: { id: String(expert.id), name: expert.name, message: expert.message, avatar: expert.avatar } });
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Chat" />

      <ScrollView className="px-4 mt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
          <Search color="#696674" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Poppins-Regular] text-[#333]"
            placeholder="Search expert by name..."
            placeholderTextColor="#696674"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Danh sách expert */}
        <View>
          {filteredCollections.length === 0 && (
            <Text className="text-center text-gray-500 font-[Poppins-Regular]">No expert found.</Text>
          )}
          {filteredCollections.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelectExpert(item.id)}
              className="flex-row items-center justify-between p-3 mb-4 rounded-[16px]"
            >
              <View className="flex-row items-center flex-1">
                <Image
                  source={{ uri: item.avatar }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-col flex-1">
                  <Text
                    className={`text-black ${
                      item.unread ? "font-[Poppins-Bold]" : "font-[Poppins-Regular]"
                    }`}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className={`text-black ${
                      item.unread ? "font-[Poppins-Bold]" : "font-[Poppins-Regular]"
                    }`}
                  >
                    {item.message}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}