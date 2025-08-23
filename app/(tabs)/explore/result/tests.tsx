import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestResultScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="" showBack={true}  onBackPress={() => router.back()} />

      {/* Body */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Test Result */}
        <View className="py-3 px-1">
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/explore/result/detail")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-base">
                ISFJ
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[#CCCCCC] text-sm">Ngày 01/01</Text>
                <ChevronRight width={24} height={24} color="#CCCCCC" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}