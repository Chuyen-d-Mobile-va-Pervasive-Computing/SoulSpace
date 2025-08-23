import EmotionPicker from "@/components/EmotionPicker";
import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { router } from "expo-router";
import { Mic } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DiaryScreen() {
  const [emotion, setEmotion] = useState<number | null>(null);
  const [tags, setTags] = useState<number[]>([]);

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Heading */}
      <Heading title="Nhật ký của tôi" />
      {/* Body */}
      <ScrollView 
        className="flex-1 mt-4 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-col gap-y-6">
          {/* Emotion */}
          <View>
            <Text className="text-white text-base font-medium">
              Hôm nay bạn thế nào?
            </Text>
            <EmotionPicker onSelect={setEmotion} />
          </View>

          {/* Viết suy nghĩ */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">
              Viết lên suy nghĩ của bạn
            </Text>
            <TextInput
              className="bg-white/30 border border-white p-4 rounded-xl text-white text-base min-h-[120px]"
              placeholder="Bạn đang nghĩ gì..."
              placeholderTextColor="#BBBBBB"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">Tags (Tùy chọn)</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              <TagSelector onChange={setTags} />
            </View>
          </View>

          {/* Ghi âm */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">
              Nói lên suy nghĩ (Tùy chọn)
            </Text>
            <View className="bg-white/30 border border-white h-[120px] p-3 rounded-lg flex-col items-center justify-center gap-2">
              <Mic className="w-9 h-9" width={36} height={36} color="#aaa" />
              <Text className="text-gray-400 text-sm">Nhấn để ghi âm</Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            className="bg-[rgba(111,4,217,0.3)] border border-[#6f04d9] rounded-xl h-12 items-center justify-center"
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white text-base font-bold">LƯU BÀI VIẾT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}