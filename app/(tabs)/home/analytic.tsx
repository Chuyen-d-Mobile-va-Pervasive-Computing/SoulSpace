import Heading from "@/components/Heading";
import WeekMonthYearSelector from "@/components/WeekMonthYearSelector";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EmotionChartWrapper from "./components/EmotionChartWrapper";
import AveragePositiveStat from "./components/charts/AveragePositiveStat";
import NegativeEmotionStat from "./components/charts/NegativeEmotionStat";
import PositiveEmotionStat from "./components/charts/PositiveEmotionStat";
import TotalDiaryStat from "./components/charts/TotalDiaryStat";

export default function AnalyticScreen() {
  const [tab, setTab] = useState<"week" | "month" | "year">("week");

  return (
    <LinearGradient
      colors={["#010440", "#020659", "#5204BF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <View className="flex-1">
        <Heading title="Analytic" showBack={true} onBackPress={() => router.back()} />

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 40 }}
          className="flex-1 px-4 mt-4"
        >
          {/* Tabs */}
          <View className="flex-row mb-4">
            {["week", "month", "year"].map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTab(t as any)}
                className={`flex-1 py-2 rounded-lg mx-1 ${
                  tab === t ? "bg-[#5204BF]/30" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center font-bold ${
                    tab === t ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <WeekMonthYearSelector
            mode={tab}
            onChange={(range) => {
              console.log(`Selected ${tab}:`, range);
            }}
          />

          {/* Chart */}
          <View className="mb-6">
            <EmotionChartWrapper type={tab} />
          </View>

          {/* Stats */}
          <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tab === "week" && (
              <>
                <PositiveEmotionStat
                  period="week"
                  value="65"
                  percent="5%"
                  trend="up"
                />
                <NegativeEmotionStat
                  period="week"
                  value="35"
                  percent="15%"
                  trend="down"
                />
              </>
            )}
            {tab === "month" && (
              <>
                <PositiveEmotionStat
                  period="month"
                  value="70"
                  percent="2%"
                  trend="up"
                />
                <TotalDiaryStat
                  period="month"
                  value="10"
                  percent="2%"
                  trend="up"
                />
              </>
            )}
            {tab === "year" && (
              <AveragePositiveStat
                period="year"
                value="65%"
                percent="-"
                trend="equal"
              />
            )}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}