import Logo from "@/assets/images/logo.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Introduce() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#010440", "#020659", "#5204BF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }} // ~ 135deg (to bottom-right)
      className="flex-1 px-6"
    >
      {/* Nội dung chính */}
      <View className="flex-1 items-center justify-center">
        <Logo width={250} height={250} />
      </View>

      {/* Indicator (3 vòng tròn) */}
      <View className="flex-row justify-center items-center mb-6">
        <View className="w-3 h-3 rounded-full bg-gray-400/50 mx-2" />
        <View className="w-3 h-3 rounded-full bg-[#8736D9] mx-2" />
        <View className="w-3 h-3 rounded-full bg-gray-400/50 mx-2" />
      </View>

      {/* Button dưới cùng */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="w-full py-3 px-4 mb-16 bg-[#8736D9] rounded-full shadow-lg active:bg-[#cdaded]"
      >
        <Text className="text-white font-inter-bold text-lg text-center">
          Continue
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
