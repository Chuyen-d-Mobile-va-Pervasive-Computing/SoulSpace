import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight, CircleUserRound, Lock, LogOut } from "lucide-react-native";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Settingscreen() {
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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(auth)/login");
  };
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Setting" onBackPress={() => router.back()} />
        
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="py-3 px-1 gap-4">
          {/* Account */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/settings/account")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <CircleUserRound width={24} height={24} color="white" />
                <Text className="text-white font-[Poppins-Bold] text-base">Account</Text>
              </View>
              <ChevronRight width={24} height={24} color="white" />
            </View>
          </TouchableOpacity>
          {/* Password */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/settings/password")}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <Lock width={24} height={24} color="white" />
                <Text className="text-white font-[Poppins-Bold] text-base">Password</Text>
              </View>
              <ChevronRight width={24} height={24} color="white" />
            </View>
          </TouchableOpacity>
          {/* Signout */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={handleCancel}
          >
            <View className="flex-row justify-between">
              <View className="flex-row items-center gap-2">
                <LogOut width={24} height={24} color="#FF0000" />
                <Text className="text-[#FF0000] font-[Poppins-Bold] text-base">Sign Out</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to logout?
            </Text>
            
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">No</Text>
              </TouchableOpacity>
            
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}