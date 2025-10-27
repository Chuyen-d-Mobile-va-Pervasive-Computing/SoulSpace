"use client";

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
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Notice", "Please fill in your email and password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Login failed");
      }

      // Lưu token vào AsyncStorage
      await AsyncStorage.setItem("access_token", data.access_token);
      await AsyncStorage.setItem("username", data.username);
      await AsyncStorage.setItem("role", data.role);

      Alert.alert("Login successfully", `Welcom ${data.username} to SoulSpace!`);
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Login error", error.message || "An error has occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" onLayout={onLayoutRootView}>
      {/* Phần trên */}
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
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#ccc"
              className="w-full h-16 bg-white rounded-xl px-4 mb-4 font-[Poppins-Regular]"
              autoCapitalize="none"
            />

            {/* Password */}
            <Text className="text-white mb-1 font-[Poppins-Medium]">
              Password
            </Text>
            <View className="w-full h-16 bg-white rounded-xl px-4 flex-row items-center">
              <TextInput
                value={password}
                onChangeText={setPassword}
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

      {/* Phần dưới */}
      <View className="flex-1 px-6 pt-10">
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className={`h-16 rounded-xl items-center justify-center ${
            loading ? "bg-[#A08CE2]" : "bg-[#7F56D9]"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-[Poppins-Bold] text-base">
              Login
            </Text>
          )}
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