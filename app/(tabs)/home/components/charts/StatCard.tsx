import { TrendingDown, TrendingUp, Equal } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  suffix?: string;
  change: "up" | "down" | "equal";
  bg: string;
  compareText?: string;
}

export default function StatCard({
  title,
  value,
  suffix,
  change,
  bg,
  compareText,
}: StatCardProps) {
  return (
    <View className={`p-6 rounded-2xl shadow-md ${bg}`}>
      <Text className="text-base font-[Poppins-SemiBold] text-gray-700 mb-3">
        {title}
      </Text>

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-[Poppins-Bold] text-gray-900">
          {value}
          {suffix && <Text className="text-xl"> {suffix}</Text>}
        </Text>

        <View
          className={`flex-row items-center px-3 py-1 rounded-full ${
            change === "up"
              ? "bg-[#E8FFEB]"
              : change === "down"
              ? "bg-[#FFE9F2]"
              : "bg-[#F3F4F6]"
          }`}
        >
          {change === "up" && <TrendingUp color="#22c55e" size={16} />}
          {change === "down" && <TrendingDown color="#ef4444" size={16} />}
          {change === "equal" && <Equal color="#9CA3AF" size={16} />}
        </View>
      </View>

      {compareText && (
        <Text className="text-sm text-gray-500 font-[Poppins-Regular]">
          {compareText}
        </Text>
      )}
    </View>
  );
}