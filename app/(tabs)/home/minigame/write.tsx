import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { BicepsFlexed, CalendarDays, Heart, Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function WriteScreen() {
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
      <Heading title="Inner Explorer" showBack={true} onBackPress={() => router.back()} />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white/30 border border-white p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] p-2">
                <Heart width={36} height={36} className="rounded-full overflow-hidden" color="white" />
              </View>
              <Text className="text-lg font-[Poppins-Bold] text-white text-center">
                Inner Explorer
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row px-8 gap-6">
                    {/* Badge 1 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] p-2">
                        <Sprout width={24} height={24} className="rounded-full overflow-hidden" color="white" />
                      </View>
                      <Text className="text-white text-[13px] text-base font-[Poppins-Bold]">WordSower</Text>
                    </View>
                    {/* Badge 2 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <BicepsFlexed width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Bold]">Resilient</Text>
                    </View>
                    {/* Badge 3 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <Heart width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Bold]">InnerExplorer</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Diary */}
        <View className="w-full p-2 mt-8 overflow-hidden gap-4">
          <View className="flex-1">
            <View className="w-full border border-white px-3 py-5 gap-3 bg-white/30 rounded-lg overflow-hidden">
              {/* Date */}
              <View className="w-full">
                <Text className="text-white text-[15px] font-[Poppins-Regular]">Saturday, Jan 19</Text>
              </View>
              {/* Emoji */}
              <View className="h-20 justify-center items-center w-full">
                <CalendarDays width={20} height={20} color="white" />
                <Text className="text-white text-xs font-[Poppins-Bold] text-center w-full">
                  Hạnh phúc
                </Text>
              </View>
              {/* Time */}
              <View className="items-center w-full">
                <Text className="text-white text-[15px] font-[Poppins-Regular]">--- 19:01 AM ---</Text>
              </View>
              {/* Content */}
              <View className="items-center w-full">
                <Text className="text-white text-[15px] font-[Poppins-Regular]">
                  aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}