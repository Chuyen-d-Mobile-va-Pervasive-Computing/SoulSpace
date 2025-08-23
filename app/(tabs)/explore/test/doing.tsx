import Heading from "@/components/Heading";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function TestDoingScreen() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Header */}
      <Heading title="" showBack={true} onBackPress={() => router.back()} />

      {/* Body */}
      <ScrollView 
        className="flex-1 mt-4 px-3 py-8 gap-5"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 🔹 Mô tả */}
        <Text className="text-white text-base font-medium text-center mb-5">
          Bài trắc nghiệm MBTI (Myers–Briggs Type Indicator) dựa trên lý thuyết phân loại tính cách
          của Carl Jung và được phát triển bởi Isabel Briggs Myers và Katharine Cook Briggs. Bài
          test giúp xác định kiểu tính cách của bạn dựa trên 4 nhóm đặc điểm chính, từ đó hiểu rõ
          hơn về cách bạn suy nghĩ, cảm nhận và tương tác với thế giới
        </Text>

        {/* 🔹 Card câu hỏi */}
        <View className="rounded-lg overflow-hidden bg-white/20 mb-5">
          {/* Header câu hỏi */}
          <View className="p-3 bg-white/30">
            <Text className="text-[#ccc] text-sm font-medium text-center">Câu hỏi 1/7</Text>
            <Text className="text-white text-base font-medium text-center">
              aaaaaaaaaaaaaaaaaaaaa
            </Text>
          </View>

          {/* Lựa chọn */}
          {["Có", "Không", "Đôi khi", "Chưa chắc"].map((item, index) => (
            <Pressable
              key={index}
              onPress={() => setSelected(index)}
              className="flex-row justify-between items-center h-12 px-3 border-t border-white/20"
            >
              <Text className="text-white text-base font-medium">{item}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selected === index ? "border-[#6f04d9] bg-[#6f04d9]/60" : "border-white"
                }`}
              />
            </Pressable>
          ))}
        </View>

                <View className="rounded-lg overflow-hidden bg-white/20 mb-5">
          {/* Header câu hỏi */}
          <View className="p-3 bg-white/30">
            <Text className="text-[#ccc] text-sm font-medium text-center">Câu hỏi 1/7</Text>
            <Text className="text-white text-base font-medium text-center">
              aaaaaaaaaaaaaaaaaaaaa
            </Text>
          </View>

          {/* Lựa chọn */}
          {["Có", "Không", "Đôi khi", "Chưa chắc"].map((item, index) => (
            <Pressable
              key={index}
              onPress={() => setSelected(index)}
              className="flex-row justify-between items-center h-12 px-3 border-t border-white/20"
            >
              <Text className="text-white text-base font-medium">{item}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selected === index ? "border-[#6f04d9] bg-[#6f04d9]/60" : "border-white"
                }`}
              />
            </Pressable>
          ))}
        </View>
    
        {/* Footer Buttons */}
        <View className="pb-6">
          <Pressable 
            className="h-12 items-center justify-center rounded-lg border border-[#6f04d9] bg-[#6f04d9]/40"
            onPress={() => router.push("/(tabs)/explore/test/done")}
          >
            <Text className="text-white font-bold text-base">Làm xong</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}