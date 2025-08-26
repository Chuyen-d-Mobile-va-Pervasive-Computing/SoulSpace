import { ToggleLeft, ToggleRight } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ReminderItemProps {
  title: string;
  time: string;
  initialOn?: boolean; // mặc định bật/tắt
}

export default function ReminderItem({ title, time, initialOn = false }: ReminderItemProps) {
  const [isOn, setIsOn] = useState(initialOn);

  return (
    <View className="w-full h-[90px] bg-white/30 border border-white rounded-lg p-2 justify-center">
      <View className="flex-row items-center w-full justify-between">
        {/* Nội dung bên trái */}
        <View className="ml-2 gap-2">
          <Text className="text-lg font-bold text-white">{title}</Text>
          <Text className="text-base text-white">{time}</Text>
        </View>

        {/* Nút toggle bên phải */}
        <TouchableOpacity onPress={() => setIsOn(!isOn)}>
          {isOn ? (
            <ToggleRight size={36} color="#FFFFFF" />
          ) : (
            <ToggleLeft size={36} color="#BBBBBB" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}