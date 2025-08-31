import { TrendingDown, TrendingUp } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  percent: string;
  change: "up" | "down" | "equal";
  icon: React.ReactNode;
  bg: string;
  border: string;
  compareText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percent,
  change,
  icon,
  bg,
  border,
  compareText = "so với tháng trước",
}) => {
  return (
    <View
      className={`p-6 rounded-2xl shadow-md ${bg} border ${border} hover:shadow-lg`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-semibold text-white">{title}</Text>
        {icon}
      </View>

      {/* Value */}
      <Text className="text-3xl font-bold text-white mb-2">{value}</Text>

      {/* Change */}
      <View className="flex-row items-center gap-2 mb-1">
        {change === "up" ? (
          <TrendingUp color="#22c55e" />
        ) : change === "down" ? (
          <TrendingDown color="#ef4444" />
        ) : null}
        <Text
          className={`text-lg font-semibold ${
            change === "up"
              ? "text-green-600"
              : change === "down"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {percent}
        </Text>
      </View>

      {/* Compare text */}
      <Text className="text-sm text-gray-300">{compareText}</Text>
    </View>
  );
};

export default StatCard;