import { useFonts } from "expo-font";
import { useCallback, useState, useRef } from "react";
import * as SplashScreen from "expo-splash-screen";
import { router } from "expo-router";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type { KeyboardAwareScrollView as KeyboardAwareScrollViewType } from "react-native-keyboard-aware-scroll-view";

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

  const scrollViewRef = useRef<KeyboardAwareScrollViewType>(null);
  const textInputRef = useRef<TextInput>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [postContent, setPostContent] = useState("");

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleCancel = () => setShowConfirm(true);

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(tabs)/community");
  };

  const handlePost = () => {
    router.push("/(tabs)/community");
  };

  const handleContentSizeChange = ({ nativeEvent: { contentSize } }: { nativeEvent: { contentSize: { height: number } } }) => {
    if (textInputRef.current && contentSize.height > 300) {
      scrollViewRef.current?.scrollToFocusedInput(textInputRef.current);
    }
  };

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
      style={{ flex: 1, backgroundColor: "#020659" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
      extraScrollHeight={30}
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
    >
      <View className="w-full px-3 py-8 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleCancel}>
            <Text className="text-sm font-[Poppins-SemiBold] text-white">Cancel</Text>
          </TouchableOpacity>

          <Text className="text-base font-[Poppins-Bold] text-white">Write a post</Text>

          <TouchableOpacity
            disabled={!postContent}
            className={`${!postContent ? "opacity-40" : ""}`}
            onPress={handlePost}
          >
            <Text className="text-sm font-[Poppins-Bold] text-white">Post</Text>
          </TouchableOpacity>
        </View>

        {/* Text Input */}
        <TextInput
          ref={textInputRef}
          value={postContent}
          onChangeText={setPostContent}
          style={{
            flexGrow: 1,
            minHeight: 300,
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: "white",
            textAlignVertical: "top",
          }}
          placeholder="Share on community...."
          placeholderTextColor="#CCCCCC"
          multiline
          textAlignVertical="top"
          onContentSizeChange={handleContentSizeChange}
        />
      </View>

      {/* Confirm Modal */}
      <Modal transparent animationType="fade" visible={showConfirm}>
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
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmCancel}
                className="bg-red-500 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
}