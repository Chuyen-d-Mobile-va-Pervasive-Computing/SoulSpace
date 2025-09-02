// app/(auth)/login.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Gift } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <LinearGradient
      colors={["#010440", "#020659"]}
      className="flex-1 justify-center px-6"
    >
      {/* Logo */}
      <View className="items-center mb-12">
        <LinearGradient
          colors={["#8736D9", "#cdaded"]}
          className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
        >
          <Gift size={42} color="#fff" />
        </LinearGradient>
        <Text className="text-white text-2xl font-inter_bold mt-5 tracking-widest">
          SOULSPACE
        </Text>
      </View>

      {/* Email input */}
      <View className="mb-4">
        <TextInput
          placeholder="Email"
          placeholderTextColor="#cdaded"
          className="w-full h-14 bg-white/10 text-white rounded-2xl px-5 py-3 border border-[#5204BF]/40 font-inter"
        />
      </View>

      {/* Password input */}
      <View className="h-14 flex-row items-center bg-white/10 rounded-2xl px-5 mb-6 border border-[#5204BF]/40">
        <TextInput
          placeholder="Password"
          placeholderTextColor="#cdaded"
          secureTextEntry={!showPassword}
          className="flex-1 text-white py-3 font-inter"
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <Eye size={22} color="#cdaded" />
          ) : (
            <EyeOff size={22} color="#cdaded" />
          )}
        </Pressable>
      </View>

      {/* Sign In button */}
      <TouchableOpacity
        onPress={handleSignIn}
        className="w-full rounded-2xl overflow-hidden shadow-xl"
      >
        <LinearGradient
          colors={["#8736D9", "#5204BF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 items-center"
        >
          <Text className="text-white font-bold text-lg tracking-wide">
            SIGN IN
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Forgot password */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/forgot-pw")}
      >
        <Text className="text-center text-[#cdaded] mt-5 underline-none font-inter">
          Forgot password?
        </Text>
      </TouchableOpacity>

      {/* Sign up */}
      <TouchableOpacity 
        className="flex-row justify-center mt-3"
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text className="text-white font-inter">New to SoulSpace? </Text>
        <Text className="text-[#cdaded] font-inter_bold">SIGNUP</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
