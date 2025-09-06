import Heading from "@/components/Heading";
import ReminderItem from "@/components/ReminderItem";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function RemindScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Remind" showBack={true} onBackPress={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        <View className="flex-1 justify-between">
          <View className="w-full px-2 py-2 gap-5">
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
            <LinearGradient
              colors={["#8736D9", "#5204BF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-3 items-center w-full rounded-2xl overflow-hidden"
            >
              <Text className="text-sm font-bold text-white text-right">Add new reminder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}