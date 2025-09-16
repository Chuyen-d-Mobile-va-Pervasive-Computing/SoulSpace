import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestResultScreen() {
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
      <Heading title="" showBack={true}  onBackPress={() => router.back()} />

      {/* Body */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Test Result */}
        <View className="py-3 px-1 gap-4">
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/explore/result/detail")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-[Poppins-Bold] text-base">
                ISFJ
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[#CCCCCC] text-sm font-[Poppins-Regular]">Ngày 01/01</Text>
                <ChevronRight width={24} height={24} color="#CCCCCC" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}