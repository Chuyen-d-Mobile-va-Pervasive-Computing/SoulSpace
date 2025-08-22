import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const goToTabs = () => {
    // điều hướng sang group (tabs), mặc định sẽ vào tab đầu tiên (home)
    router.replace("/(tabs)/home");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="font-inter_bold text-3xl mb-6">SOULSPACE</Text>

      <TouchableOpacity
        onPress={goToTabs}
        className="px-6 py-3 bg-[#6F04D9] rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">Vào ứng dụng</Text>
      </TouchableOpacity>
    </View>
  );
}