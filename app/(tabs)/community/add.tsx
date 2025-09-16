import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });
            
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
            
  if (!fontsLoaded) return null;
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
            <Text className="text-right text-sm font-[Poppins-SemiBold] text-white">
              Cancel
            </Text>
          </TouchableOpacity>

          <Text className="text-left text-base font-[Poppins-Bold] text-white">
            Write a post
          </Text>

          <TouchableOpacity 
            disabled={!postContent}
            className={`${!postContent ? "opacity-40" : ""}`}
            onPress={handlePost}
          >
            <Text className="text-right text-sm font-[Poppins-Bold] text-white">Post</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <TextInput
            value={postContent}
            onChangeText={setPostContent}
            className="text-left text-base font-[Poppins-Regular] text-white"
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
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to discard this post?
            </Text>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-white">
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