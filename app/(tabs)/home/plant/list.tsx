import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { NotebookPen, Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ListScreen() {
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
            <Heading title="Action List" showBack={true} onBackPress={() => router.back()} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 pt-2"
            >
                <View className="w-full p-2 overflow-hidden">
                    <View className="flex-1 rounded-lg bg-white/30 border border-white p-2 justify-center items-center overflow-hidden">
                        <View className="py-2 gap-2 items-center w-full">
                            <View className="rounded-full bg-[#5CB338]/30 border border-[#5CB338] p-2">
                                <Sprout width={36} height={36} className="rounded-full overflow-hidden" color="#5CB338" />
                            </View>
                            <Text className="text-lg text-white text-center font-[Poppins-Bold]">
                                What positive action did you take today?
                            </Text>
                            <Text className="text-sm text-gray-300 text-center font-[Poppins-Regular]">
                                Click to "water" your spiritual tree
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/plant/action")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-white bg-white/30 rounded-lg px-3 py-5 gap-2">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] p-2">
                                            <NotebookPen width={24} height={24} color="white" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-white text-[14px] font-[Poppins-Bold]">Practice Gratitude</Text>
                                            <Text className="text-[#ccc] text-[13px] font-[Poppins-Regular]">
                                                Write down 3 things you are thankful for
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}