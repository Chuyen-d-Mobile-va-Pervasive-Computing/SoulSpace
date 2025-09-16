import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function DetailScreen() {
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
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading
        title="Details"
        showBack={true}
        onBackPress={() => router.back()}
      />

      <ScrollView className="w-full items-left" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="w-full">
          {/* MBTI */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-[Poppins-Medium] text-left">
              MBTI
            </Text>
            <Text className="text-white text-[15px] font-[Poppins-Medium] text-left">
              ISFJ
            </Text>
          </View>

          {/* Điểm */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-[Poppins-Medium] text-left">
              Điểm
            </Text>
            <Text className="text-white text-[15px] font-[Poppins-Medium] text-left">
              15
            </Text>
          </View>

          {/* Câu hỏi */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-[Poppins-Medium] text-left">
              Câu hỏi
            </Text>
            <Text className="text-white text-[15px] font-[Poppins-Medium] text-left">
              Câu trả lời
            </Text>
          </View>

          {/* Thời gian */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-[Poppins-Medium] text-left">
              Thời gian thực hiện
            </Text>
            <Text className="text-white text-[15px] font-[Poppins-Medium] text-left">
              22:22:22 01/01/2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}