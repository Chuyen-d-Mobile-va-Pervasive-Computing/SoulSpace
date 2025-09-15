import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // tách state riêng cho 2 ô
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleRegister = () => {
    router.replace("/(auth)/login");
  };

  return (
    <View className="flex-1 bg-[#FAF9FF] pt-12">
      {/* Nút Back */}
      <View className="mt-8 ml-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-white rounded-[10px] items-center justify-center"
        >
          <ChevronLeft size={30} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="px-6 mt-24">
        <Text className="text-black text-[30px] font-[Poppins-Bold]">
          Welcome back! Glad
        </Text>
        <Text className="text-black text-[30px] font-[Poppins-Bold] leading-[50px]">
          to see you, Again!
        </Text>
      </View>

      <View className="px-6 mt-12">
        {/* Username */}
        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
            Username
          </Text>
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            className="w-full h-16 bg-transparent rounded-[10px] px-4 border border-[#DADADA] font-[Poppins-Regular]"
          />
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
            Email Address
          </Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="w-full h-16 bg-transparent rounded-[10px] px-4 border border-[#DADADA] font-[Poppins-Regular]"
          />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
            Password
          </Text>
          <View className="w-full h-16 bg-transparent px-4 flex-row items-center border border-[#DADADA] rounded-[10px]">
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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
        </View>

        {/* Confirm Password */}
        <View className="mb-6">
          <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
            Confirm Password
          </Text>
          <View className="w-full h-16 bg-transparent px-4 flex-row items-center border border-[#DADADA] rounded-[10px]">
            <TextInput
              placeholder="Confirm your password"
              placeholderTextColor="#ccc"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              className="flex-1 font-[Poppins-Regular]"
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Eye size={22} color="#B5A2E9" />
              ) : (
                <EyeOff size={22} color="#B5A2E9" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          className="w-full h-16 rounded-lg items-center justify-center mb-4 bg-[#7F56D9]"
        >
          <Text className="text-white font-[Poppins-Bold] text-base">
            Register
          </Text>
        </TouchableOpacity>

        {/* Or Login */}
        <View className="flex-row justify-center">
          <Text className="text-black font-[Poppins-Regular]">Or </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text className="text-[#7F56D9] font-[Poppins-Medium]">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
