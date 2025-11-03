import { router, useLocalSearchParams } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft, Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

SplashScreen.preventAutoHideAsync();

export default function TestDoneScreen() {
  const { result } = useLocalSearchParams<{ result?: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (result) {
      try {
        const parsed = JSON.parse(result);
        setData(parsed);
      } catch (err) {
        console.warn("Failed to parse result:", err);
      }
    }
    setLoading(false);
  }, [result]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF9FF]">
        <ActivityIndicator size="large" color="#7F56D9" />
        <Text className="mt-3 text-[#7F56D9] font-[Poppins-SemiBold]">
          Loading your result...
        </Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF9FF]">
        <Text className="text-gray-500 text-base">No result found.</Text>
      </View>
    );
  }

  const score = data.total_score ?? 0;
  const level = data.severity_level || "Unknown";
  const percentage = (score / 27) * 100;
  const progressColor =
    level.includes("Mild") || level.includes("Moderate")
      ? "#B5A2E9"
      : level.includes("Severe")
      ? "#6F04D9"
      : "#C9B6F2";

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <ArrowLeft width={28} height={28} color="#000000" />
          </TouchableOpacity>
          <Text
            className="ml-3 text-xl text-[#7F56D9]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {data.test_code} Results
          </Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1 px-4 py-8"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Kết quả */}
        <View className="bg-[#E0D7F9] rounded-3xl p-5 items-start">
          <Text
            className="text-5xl text-[#555555]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {score}
          </Text>
          <Text
            className="mt-2 text-lg text-[#555555]"
            style={{ fontFamily: "Poppins-SemiBold" }}
          >
            Your {data.test_code} Score
          </Text>
          <Text
            className="text-base text-[#555555]"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Depression level: {level}
          </Text>

          {/* Thanh progress */}
          <View className="flex-row justify-between w-full mt-4 px-2">
            <Text className="text-xs text-[#6F04D9]">0–4: None</Text>
            <Text className="text-xs text-[#6F04D9]">10–14: Moderate</Text>
            <Text className="text-xs text-[#6F04D9]">15–27: Severe</Text>
          </View>

          <View className="h-3 w-full bg-white rounded-full mt-2 overflow-hidden">
            <View
              className="h-3"
              style={{
                width: `${percentage}%`,
                backgroundColor: progressColor,
              }}
            />
          </View>
        </View>

        {/* Gợi ý */}
        {data.guidance_notes ? (
          <View className="bg-white rounded-3xl p-5 mt-6">
            <View className="bg-[#F7F4F2] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
              <Check color={"#926247"} strokeWidth={2.75} />
            </View>
            <Text className="text-[#4F3422] font-[Poppins-SemiBold] text-base">
              {data.guidance_notes}
            </Text>
          </View>
        ) : (
          <View className="bg-white rounded-3xl p-5 mt-6">
            <View className="bg-[#F7F4F2] p-2 rounded-full w-12 h-12 items-center justify-center mb-4">
              <Check color={"#926247"} strokeWidth={2.75} />
            </View>
            <Text className="font-[Poppins-Bold] text-base text-[#4F3422] mb-2">
              Take a few minutes each day to practice deep breathing.
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(tabs)/explore/test",
              params: {
                test_code: data.test_code,
                progress: data.progress,
              },
            });
          }}
          className="mt-6 items-center justify-center bg-white rounded-3xl p-4 border border-[#7F56D9]"
        >
          <Text className="text-[#7F56D9] font-[Poppins-SemiBold]">
            Back to Test Info
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}