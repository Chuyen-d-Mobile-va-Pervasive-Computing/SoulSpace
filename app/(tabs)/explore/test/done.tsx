import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function TestDoneScreen() {
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
      {/* Container */}
      <View className="flex-1 items-center">

        {/* Header */}
        <View className="flex-row h-18 px-2 py-5 w-full overflow-hidden">
            <Pressable onPress={() => router.push("/(tabs)/explore")}>
                <X width={24} height={24} color="white" />
            </Pressable>
        </View>

        {/* Body */}
        <ScrollView className="px-2 py-8 w-full" contentContainerStyle={{ paddingBottom: 80 }}>
          <View className="px-2 items-center gap-5">
            {/* Title */}
            <Text className="text-white text-center text-[25px] font-[Poppins-Medium]">
              Result
            </Text>

            {/* Score */}
            <Text className="text-white text-center text-[48px] font-[Poppins-Bold]">15</Text>

            {/* Progress */}
            <View className="w-full items-center gap-2">
              <Progress.Bar
                progress={5/20}
                width={350}
                color="white"
                borderRadius={10}
              />              
              <View className="flex-row justify-between w-full">
                <Text className="text-xs text-white font-[Poppins-Regular]">Normal (0-10)</Text>
                <Text className="text-xs text-white font-[Poppins-Regular]">Symptom</Text>
                <Text className="text-xs text-white font-[Poppins-Regular]">Serious</Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-white text-sm w-full font-[Poppins-Regular]">
              Your answer shows
            </Text>

            {/* Question Card */}
            <View className="w-full rounded-lg bg-white/30 p-5 gap-2">
              <Text className="text-white text-[15px] font-[Poppins-Bold] text-center">
                The next steps
              </Text>
              <Text className="text-white text-[15px] font-[Poppins-Medium] text-left">
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
