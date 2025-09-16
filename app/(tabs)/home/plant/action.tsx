import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function ActionScreen() {
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

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");

  const handleCancel = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirm(false);
    router.push("/(tabs)/home/plant/list");
  };

  const handlePost = () => {
    router.push("/(tabs)/home/plant/list");
  };

  const canAdd = input1.trim() && input2.trim() && input3.trim();

  return (
    <View className="flex-1 bg-[#020659]">
      <Heading
        title="Practice Gratitude"
        showBack={true}
        onBackPress={() => router.back()}
      />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="py-3 px-1">
          <View className="rounded-2xl border border-white/20 bg-white/10 p-4 space-y-6 gap-4">
            {/* Input 1 */}
            <View className="space-y-2">
              <Text className="text-sm font-[Poppins-SemiBold] text-white mb-2">
                Thankful Thing 1
              </Text>
              <TextInput
                value={input1}
                onChangeText={setInput1}
                className="min-h-[100px] w-full rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-white font-[Poppins-Regular]"
                placeholder="Input your thankful thing..."
                placeholderTextColor="#ccc"
                maxLength={200}
                multiline
                textAlignVertical="top"
              />
              <Text className="self-stretch text-right text-xs text-gray-400 font-[Poppins-Regular]">
                {input1.length}/200
              </Text>
            </View>

            {/* Input 2 */}
            <View className="space-y-2">
              <Text className="text-sm font-[Poppins-SemiBold] mb-2 text-white">
                Thankful Thing 2
              </Text>
              <TextInput
                value={input2}
                onChangeText={setInput2}
                className="min-h-[100px] w-full rounded-xl font-[Poppins-Regular] border border-white/20 bg-white/15 px-3 py-2 text-white"
                placeholder="Input your thankful thing..."
                placeholderTextColor="#ccc"
                maxLength={200}
                multiline
                textAlignVertical="top"
              />
              <Text className="self-stretch text-right text-xs text-gray-400 font-[Poppins-Regular]">
                {input2.length}/200
              </Text>
            </View>

            {/* Input 3 */}
            <View className="space-y-2">
              <Text className="text-sm font-[Poppins-SemiBold] mb-2 text-white">
                Thankful Thing 3
              </Text>
              <TextInput
                value={input3}
                onChangeText={setInput3}
                className="min-h-[100px] w-full rounded-xl font-[Poppins-Regular] border border-white/20 bg-white/15 px-3 py-2 text-white"
                placeholder="Input your thankful thing..."
                placeholderTextColor="#ccc"
                maxLength={200}
                multiline
                textAlignVertical="top"
              />
              <Text className="self-stretch text-right text-xs text-gray-400 font-[Poppins-Regular]">
                {input3.length}/200
              </Text>
            </View>

            {/* Buttons */}
            <View className="pt-4 flex-row gap-2">
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-1 h-14 rounded-xl border border-red-400/40 bg-red-500/20 justify-center items-center"
              >
                <Text className="text-red-400 font-[Poppins-Bold] text-base">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!canAdd}
                className={`flex-1 h-14 rounded-xl border border-green-400/40 bg-green-500/20 justify-center items-center ${
                  !canAdd ? "opacity-40" : ""
                }`}
                onPress={handlePost}
              >
                <Text className="text-green-400 font-[Poppins-Bold] text-base">Complete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to discard this thing?
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
                <Text className="text-base font-[Poppins-SemiBold] text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}