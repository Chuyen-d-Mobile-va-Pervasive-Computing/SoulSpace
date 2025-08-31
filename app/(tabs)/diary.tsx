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
  const [thoughts, setThoughts] = useState<string>("");

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Heading */}
      <Heading title="Diary" />
      {/* Body */}
      <ScrollView 
        className="flex-1 mt-4 px-4 py-0"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-col gap-y-6">
          {/* Emotion */}
          <View>
            <Text className="text-white text-base font-medium">
              How are you today?
            </Text>
            <EmotionPicker onSelect={setEmotion} />
          </View>

          {/* Viết suy nghĩ */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">
              Write down your thought
            </Text>
            <TextInput
              value={thoughts}
              onChangeText={setThoughts}
              className="bg-white/30 border border-white p-4 rounded-xl text-white text-base min-h-[120px]"
              placeholder="What are you thinking..."
              placeholderTextColor="#BBBBBB"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">Tags (Optional)</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              <TagSelector
                options={[
                  { id: 1, name: "Family" },
                  { id: 2, name: "Work" },
                  { id: 3, name: "Study" },
                ]}
                multiSelect={true}
                onChange={(ids) => console.log("Tags:", ids)}

              />
            </View>
          </View>

          {/* Ghi âm */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">
              Speak your mind (Optional)
            </Text>
            <View className="bg-white/30 border border-white h-[120px] p-3 rounded-lg flex-col items-center justify-center gap-2">
              <Mic className="w-9 h-9" width={36} height={36} color="#aaa" />
              <Text className="text-gray-400 text-sm">Press to record</Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            disabled={!thoughts || !emotion}
            className={`${
              !thoughts || !emotion
                ? "bg-gray-400 border-none"
                : "bg-[rgba(111,4,217,0.3)] border border-[#6f04d9]"
            } rounded-xl h-12 items-center justify-center`}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text className="text-white text-base font-bold">SAVE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}