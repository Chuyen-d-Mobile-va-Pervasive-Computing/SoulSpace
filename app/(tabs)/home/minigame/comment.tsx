import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { CircleStar, HeartHandshake, MessageCircleMore, Rainbow } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function CommentScreen() {
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
      <Heading title="Light Bearer" showBack={true} onBackPress={() => router.back()} />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white/30 border border-white p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#ECE852]/30 border border-[#ECE852] p-2">
                <Rainbow width={36} height={36} className="rounded-full overflow-hidden" color="#ECE852" />
              </View>
              <Text className="text-lg font-[Poppins-Bold] text-[#ECE852] text-center">
                Light Bearer
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row px-8 gap-8">
                    {/* Badge 1 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#ECE852]/30 border border-[#ECE852] p-2">
                        <HeartHandshake width={24} height={24} className="rounded-full overflow-hidden" color="white" />
                      </View>
                      <Text className="text-white text-[13px] text-base font-[Poppins-Bold]">Teller</Text>
                    </View>
                    {/* Badge 2 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <CircleStar width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Bold]">Beacon</Text>
                    </View>
                    {/* Badge 3 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <Rainbow width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-[Poppins-Bold]">LightBearer</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Comment */}
        <View className="w-full p-2 overflow-hidden mt-6 gap-4">
          <View className="flex-1">
            <View className="w-full flex-row items-stretch gap-4 border border-white p-4 bg-white/30 rounded-md">
              <View className="items-center">
                <View className="rounded-full bg-[#010440] p-2">
                  <MessageCircleMore width={14} height={14} className="rounded-full overflow-hidden" color="white" />
                </View>                
                <View className="flex-1 w-[2px] bg-white mt-1" />
              </View>
              <View className="flex-1 gap-2">
                <View className="flex-col">
                  <Text className="text-white font-[Poppins-Bold] text-[12px]">
                    user1
                  </Text>
                  <Text className="text-[#ccc] font-[Poppins-Regular] text-[12px]">
                    aaaaaaaaaaaaaaaaa
                  </Text>
                </View>
                <View className="gap-1">
                  <Text className="text-[#ccc] text-[10px] font-[Poppins-Regular]">Jan 01, 19:01</Text>
                  <Text className="text-white text-[12px] font-[Poppins-Regular]">
                    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}