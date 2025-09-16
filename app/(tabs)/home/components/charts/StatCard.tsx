import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
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
  return (
    <View
      className={`p-6 rounded-2xl shadow-md ${bg} border ${border} hover:shadow-lg`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-[Poppins-SemiBold] text-gray-700">{title}</Text>
        {icon}
      </View>

      {/* Value */}
      <Text className="text-3xl font-[Poppins-Bold] text-gray-900 mb-2">{value}</Text>

      {/* Change */}
      <View className="flex-row items-center gap-2 mb-1">
        {change === "up" ? (
          <TrendingUp color="#22c55e" />
        ) : change === "down" ? (
          <TrendingDown color="#ef4444" />
        ) : null}
        <Text
          className={`text-lg font-[Poppins-SemiBold] ${
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
      <Text className="text-sm text-gray-500 font-[Poppins-Regular]">{compareText}</Text>
    </View>
  );
};

export default StatCard;