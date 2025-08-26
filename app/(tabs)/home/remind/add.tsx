import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function AddScreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(tabs)/home/remind");
  };

  const handlePost = () => {
    router.push("/(tabs)/home/remind");
  };
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading
        title="Add new reminder"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="py-3 px-1">
          {/* Thời gian nhắc nhở */}
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white/20 bg-white/10 px-4 justify-center mb-4"
            // onPress={() => router.push("/(tabs)/explore/result/tests")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-base">
                Time
              </Text>
              <View className="flex-row items-center">
                <Text className="text-[#BBBBBB] font-medium text-sm mr-1">
                  Select time
                </Text>
                <ChevronRight width={20} height={20} color="#BBBBBB" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Card: Custom reminder */}
          <View className="rounded-2xl border border-white/20 bg-white/10 p-4 space-y-6 gap-4">
            <Text className="text-base font-bold text-white">
              Custom reminder
            </Text>

            {/* Input */}
            <View className="space-y-2">
              <Text className="text-sm font-semibold text-white">
                Reminder Name
              </Text>
              <TextInput
                className="h-12 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white"
                placeholder="Input reminder name..."
                placeholderTextColor="#ccc"
                maxLength={30}
              />
              <Text className="self-stretch text-right text-xs text-gray-400">
                0/30
              </Text>
            </View>

            {/* Input: Cụm từ nhắc nhở */}
            <View className="space-y-2">
              <Text className="text-sm font-semibold text-white">
                Reminder Phrase
              </Text>
              <TextInput
                className="min-h-[100px] w-full rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-white"
                placeholder="Input reminder phrase..."
                placeholderTextColor="#ccc"
                maxLength={200}
                multiline
                textAlignVertical="top"
              />
              <Text className="self-stretch text-right text-xs text-gray-400">
                0/200
              </Text>
            </View>
          </View>

          <View className="pt-4 flex-row space-x-3 gap-2">
            <TouchableOpacity 
              onPress={handleCancel}
              className="flex-1 h-14 rounded-xl border border-red-400/40 bg-red-500/20 justify-center items-center"
            >
              <Text className="text-red-400 font-bold text-base">
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              disabled={!name || !time}
              className={`flex-1 h-14 rounded-xl border border-green-400/40 bg-green-500/20 justify-center items-center ${!name || !time ? "opacity-40" : ""}`}
              onPress={handlePost}
            >
              <Text className="text-green-400 font-bold text-base">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-semibold mb-6 text-gray-800">
              Are you sure you want to discard this reminder?
            </Text>
      
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-semibold text-gray-800">
                  No
                </Text>
              </TouchableOpacity>
      
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-semibold text-white">
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}