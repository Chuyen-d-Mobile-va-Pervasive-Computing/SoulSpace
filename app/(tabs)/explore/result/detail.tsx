import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function DetailScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading
        title="Details"
        showBack={true}
        onBackPress={() => router.back()}
      />

      <ScrollView className="w-full items-left" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="w-full">
          {/* MBTI */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-medium text-left">
              MBTI
            </Text>
            <Text className="text-white text-[15px] font-medium text-left">
              ISFJ
            </Text>
          </View>

          {/* Điểm */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-medium text-left">
              Điểm
            </Text>
            <Text className="text-white text-[15px] font-medium text-left">
              15
            </Text>
          </View>

          {/* Câu hỏi */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-medium text-left">
              Câu hỏi
            </Text>
            <Text className="text-white text-[15px] font-medium text-left">
              Câu trả lời
            </Text>
          </View>

          {/* Thời gian */}
          <View className="h-[80px] p-2.5 gap-1 bg-white/30 border-t border-[#cccccc4d] justify-left items-left">
            <Text className="text-[#ccc] text-[15px] font-medium text-left">
              Thời gian thực hiện
            </Text>
            <Text className="text-white text-[15px] font-medium text-left">
              22:22:22 01/01/2025
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}