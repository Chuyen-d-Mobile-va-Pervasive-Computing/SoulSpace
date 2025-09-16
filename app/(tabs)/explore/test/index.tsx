import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestInfoScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });
            
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
            
  if (!fontsLoaded) return null;
  const { testType } = useLocalSearchParams<{ testType?: string }>();

  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Test Info" showBack onBackPress={() => router.back()} />

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
          <Text className="text-white text-xl font-[Poppins-Bold] text-center">
            {testType?.includes("PHQ-9")
              ? "PHQ-9 – Đo lường mức độ trầm cảm"
              : testType?.includes("PSS")
              ? "PSS – Đo lường mức độ căng thẳng"
              : testType?.includes("GAD")
              ? "GAD – Đo lường mức độ lo âu"
              : "MBTI – Khám phá tính cách của bạn"}
          </Text>

          <Text className="text-white text-base text-center font-[Poppins-Regular]">
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
            onPress={() => router.push({ pathname: "/(tabs)/explore/test/doing", params: { testType } })}
          >
            <LinearGradient
              colors={["#8736D9", "#5204BF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-3 items-center w-full rounded-2xl overflow-hidden"
            >
              <Text className="text-white text-base font-[Poppins-Bold]">Start</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}