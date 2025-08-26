import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestInfoScreen() {
  const { testType } = useLocalSearchParams<{ testType?: string }>();

  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Thông tin bài test" showBack onBackPress={() => router.back()} />

      <ScrollView className="flex-1 px-3 py-8 gap-5" contentContainerStyle={{flexGrow: 1, paddingBottom: 20 }}>
        <View className="flex-1 justify-between">
        {/* Ảnh minh họa */}
        <Image
          className="w-full h-[280px] rounded-lg"
          resizeMode="cover"
          source={
            testType?.includes("MBTI")
              ? require("@/assets/images/mbti.png")
              : testType?.includes("PHQ-9")
              ? require("@/assets/images/phq.png")
              : testType?.includes("GAD")
              ? require("@/assets/images/gad.png")
              : require("@/assets/images/pss.png")
          }
        />

        {/* Nội dung */}
        <View className="items-center gap-5 px-2">
          <Text className="text-white text-xl font-bold text-center">
            {testType?.includes("PHQ-9")
              ? "PHQ-9 – Đo lường mức độ trầm cảm"
              : testType?.includes("PSS")
              ? "PSS – Đo lường mức độ căng thẳng"
              : testType?.includes("GAD")
              ? "GAD – Đo lường mức độ lo âu"
              : "MBTI – Khám phá tính cách của bạn"}
          </Text>

          <Text className="text-white text-base text-center">
            {testType?.includes("PHQ-9")
              ? "Bài trắc nghiệm PHQ giúp đánh giá mức độ trầm cảm..."
              : testType?.includes("PSS")
              ? "Bài trắc nghiệm PSS giúp đo lường mức độ căng thẳng..."
              : testType?.includes("GAD")
              ? "Bài trắc nghiệm GAD giúp đo lường mức độ lo âu..."
              : "Bài trắc nghiệm MBTI (Myers–Briggs Type Indicator) dựa trên lý thuyết phân loại tính cách..."}
          </Text>
        </View>
        {/* Button */}
        <View className="px-3 pb-6">
          <TouchableOpacity
            className="bg-[rgba(111,4,217,0.3)] border border-[#6f04d9] rounded-lg h-12 items-center justify-center mt-6"
            onPress={() => router.push({ pathname: "/(tabs)/explore/test/doing", params: { testType } })}
          >
            <Text className="text-white text-base font-bold">Bắt đầu</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}