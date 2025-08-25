import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddScreen() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [postContent, setPostContent] = useState("");

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(tabs)/community");
  };

  const handlePost = () => {
    router.push("/(tabs)/community");
  };

  return (
    <View className="flex-1 bg-[#020659]">
      <View className="w-full px-3 py-8 gap-4 flex-1 overflow-hidden">
        {/* Header buttons */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleCancel}>
            <Text className="text-right text-sm font-semibold text-white">
              Cancel
            </Text>
          </TouchableOpacity>

          <Text className="text-left text-base font-bold text-white">
            Write a post
          </Text>

          <TouchableOpacity 
            disabled={!postContent}
            className={`${!postContent ? "opacity-40" : ""}`}
            onPress={handlePost}
          >
            <Text className="text-right text-sm font-bold text-white">Post</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <TextInput
            value={postContent}
            onChangeText={setPostContent}
            className="text-left text-base text-white"
            placeholder="Share on community...."
            placeholderTextColor={"#CCCCCC"}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </View>

      {/* Modal xác nhận thoát */}
      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-semibold mb-6 text-gray-800">
              Are you sure you want to discard this post?
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