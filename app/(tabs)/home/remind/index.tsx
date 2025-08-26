import Heading from "@/components/Heading";
import ReminderItem from "@/components/ReminderItem";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RemindScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Nhắc nhở" showBack={true} onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        <View className="flex-1 justify-between">
          <View className="w-full px-2 py-8 gap-5">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/home/remind/update")}
            >
                <ReminderItem title="Viết nhật ký" time="19:01 PM" initialOn={true} />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity 
            className="px-2"
            onPress={() => router.push("/(tabs)/home/remind/add")}
          >
            <View className="h-12 bg-[#6f04d94d] border border-[#6f04d9] rounded-lg justify-center items-center">
              <Text className="text-sm font-bold text-white text-right">Thêm lời nhắc khác</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}