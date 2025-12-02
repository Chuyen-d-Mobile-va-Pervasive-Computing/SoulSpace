import { router } from "expo-router";
import { CalendarCheck, MessageSquare, Users } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ConsultFooter() {
  return (
    <View className="w-full bg-white border-t border-gray-200 px-8 py-4 mb-14">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.replace("/(tabs)/home/consult")}
        >
          <Users color="#7F56D9" size={24} />
          <Text className="text-xs text-[#7F56D9] mt-1">Expert</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() =>
            router.replace("/(tabs)/home/consult/appointment/index")
          }
        >
          <CalendarCheck color="#7F56D9" size={24} />
          <Text className="text-xs text-[#7F56D9] mt-1">Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center"
          onPress={() =>
            router.replace("/(tabs)/home/consult/appointment/index")
          }
        >
          <MessageSquare color="#7F56D9" size={24} />
          <Text className="text-xs text-[#7F56D9] mt-1">Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
