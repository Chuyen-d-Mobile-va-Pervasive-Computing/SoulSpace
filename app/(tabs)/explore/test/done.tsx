import { router } from "expo-router";
import { X } from "lucide-react-native";
import * as React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function TestDoneScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      {/* Container */}
      <View className="flex-1 items-center">

        {/* Header */}
        <View className="flex-row h-18 px-2 py-5 w-full overflow-hidden">
            <Pressable onPress={() => router.push("/(tabs)/explore")}>
                <X width={24} height={24} color="white" />
            </Pressable>
        </View>

        {/* Body */}
        <ScrollView className="px-2 py-8 w-full" contentContainerStyle={{ paddingBottom: 80 }}>
          <View className="px-2 items-center gap-5">
            {/* Title */}
            <Text className="text-white text-center text-[25px] font-medium">
              Result
            </Text>

            {/* Score */}
            <Text className="text-white text-center text-[48px] font-bold">15</Text>

            {/* Progress */}
            <View className="w-full items-center gap-2">
              <Progress.Bar
                progress={5/20}
                width={350}
                color="white"
                borderRadius={10}
              />              
              <View className="flex-row justify-between w-full">
                <Text className="text-xs text-white">Normal (0-10)</Text>
                <Text className="text-xs text-white">Symptom</Text>
                <Text className="text-xs text-white">Serious</Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-white text-sm w-full">
              Your answer shows
            </Text>

            {/* Question Card */}
            <View className="w-full rounded-lg bg-white/30 p-5 gap-2">
              <Text className="text-white text-[15px] font-bold text-center">
                The next steps
              </Text>
              <Text className="text-white text-[15px] font-medium text-left">
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
