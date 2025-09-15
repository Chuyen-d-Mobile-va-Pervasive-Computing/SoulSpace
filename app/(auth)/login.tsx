// app/(auth)/login.tsx
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // Load Poppins font
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

  const handleSignIn = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* phần trên */}
      <View className="bg-[#B5A2E9] rounded-b-[70%] pb-[20%] -mx-40 pl-40 pr-40 pt-20">
        {/* Nút back */}
        <View className="px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white rounded-[10px] items-center justify-center"
          >
            <ChevronLeft size={30} color="#000000" />
          </TouchableOpacity>
        </View>
        <View className="w-full">
          {/* Title */}
          <View className="px-6 mt-24">
            <Text className="text-black text-3xl font-[Poppins-Bold]">
              Welcome back! Glad
            </Text>
            <Text className="text-black text-3xl font-[Poppins-Bold] leading-[50px]">
              to see you, Again!
            </Text>
          </View>

          {/* Email */}
          <View className="px-6 mt-20">
            <Text className="text-white mb-1 font-[Poppins-Medium]">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              className="w-full h-16 bg-white rounded-xl px-4 mb-4 font-[Poppins-Regular]"
            />

            {/* Password */}
            <Text className="text-white mb-1 font-[Poppins-Medium]">
              Password
            </Text>
            <View className="w-full h-16 bg-white rounded-xl px-4 flex-row items-center">
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
                secureTextEntry={!showPassword}
                className="flex-1 font-[Poppins-Regular]"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={22} color="#B5A2E9" />
                ) : (
                  <EyeOff size={22} color="#B5A2E9" />
                )}
              </Pressable>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/forgot-pw")}
                className="self-end mt-2"
              >
                <Text className="text-[#ffffff] font-[Poppins-Italic]">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* phần dưới */}
      <View className="flex-1 px-6 pt-10">
        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center"
        >
          <Text className="text-white font-[Poppins-Bold] text-base">
            Login
          </Text>
        </TouchableOpacity>

        {/* Register */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-black font-[Poppins-Regular]">
            Don’t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-[#7F56D9] font-[Poppins-Medium]">
              Register Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
