import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// Import SVG/Images
import Cshape from "@/assets/images/c.svg";
import Circle from "@/assets/images/circle.svg";
import Illustrator from "@/assets/images/illustrator.svg";
import Light from "@/assets/images/light.svg";
import Logo from "@/assets/images/logo.svg";
import Page from "@/assets/images/page.svg";
import Statics from "@/assets/images/statics.svg";
import Ushape from "@/assets/images/u.svg";
import Wave from "@/assets/images/wave.svg";

SplashScreen.preventAutoHideAsync();

export default function Introduce() {
  const router = useRouter();

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-white px-6 pt-12" onLayout={onLayoutRootView}>
      {/* Logo */}
      <View className="items-center mb-4">
        <Logo width={80} height={80} />
      </View>

      {/* Text */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-[Poppins-Bold] text-[#7C3AED]">
          Welcome to SoulSpace
        </Text>
        <Text className="text-center mt-2 font-[Poppins-Regular] text-gray-600">
          Your mindful mental health AI companion{"\n"}
          for everyone, anywhere 🌿
        </Text>
      </View>

      {/* Main Illustration */}
      <View className="flex-1 items-center justify-center relative">
        <Illustrator width={220} height={220} />

        {/* Small floating icons */}
        <View className="absolute top-8 left-8">
          <Statics width={40} height={40} />
        </View>
        <View className="absolute top-8 right-8">
          <Light width={40} height={40} />
        </View>
        <View className="absolute bottom-8 left-10">
          <Page width={40} height={40} />
        </View>

        {/* Decorative shapes */}
        <View className="absolute top-20 right-20">
          <Circle width={20} height={20} />
        </View>
        <View className="absolute bottom-20 left-20">
          <Wave width={30} height={30} />
        </View>
        <View className="absolute bottom-28 right-28">
          <Ushape width={20} height={20} />
        </View>
        <View className="absolute top-28 left-24">
          <Cshape width={20} height={20} />
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="w-full py-3 mb-4 bg-[#7C3AED] rounded-full shadow-lg"
      >
        <Text className="text-white text-center font-[Poppins-Bold] text-lg">
          Get Started →
        </Text>
      </TouchableOpacity>

      {/* Sign in */}
      <Text className="text-center font-[Poppins-Regular] text-gray-500 mb-8">
        Already have an account?{" "}
        <Text
          className="text-[#7C3AED] font-[Poppins-Bold]"
          onPress={() => router.push("/(auth)/login")}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}
