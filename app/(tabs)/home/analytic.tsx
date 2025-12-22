import Heading from "@/components/Heading";
import WeekMonthYearSelector from "@/components/WeekMonthYearSelector";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EmotionChartWrapper from "./components/EmotionChartWrapper";
import AveragePositiveStat from "./components/charts/AveragePositiveStat";
import NegativeEmotionStat from "./components/charts/NegativeEmotionStat";
import PositiveEmotionStat from "./components/charts/PositiveEmotionStat";
import TotalDiaryStat from "./components/charts/TotalDiaryStat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { ChartItem } from "@/constants/types";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface AnalyticsStats {
  total_entries: number;
  positive_percentage: number;
  negative_percentage: number;
  average_positive: number;
  trend_positive: "up" | "down" | "equal";
  trend_negative: "up" | "down" | "equal";
  trend_entries: "up" | "down" | "equal";
}

interface AnalyticsResponse {
  period: "week" | "month" | "year";
  range: {
    start: string;
    end: string;
  };
  chart_data: ChartItem[];
  stats: AnalyticsStats;
}

export default function AnalyticScreen() {
  const { tab: initialTab } = useLocalSearchParams<{
    tab?: "week" | "month" | "year";
  }>();
  const [tab, setTab] = useState<"week" | "month" | "year">("week");
  const [range, setRange] = useState<{ start: string; end: string } | null>(null);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      initialTab === "week" ||
      initialTab === "month" ||
      initialTab === "year"
    ) {
      setTab(initialTab);
    }
  }, [initialTab]);

  const fetchAnalytics = async (
    period: "week" | "month" | "year",
    start: string,
    end: string
  ) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE}/api/v1/journal/analytics?period=${period}&start_date=${start}&end_date=${end}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json: AnalyticsResponse = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Analytic" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 mt-4"
      >
        {/* Tabs */}
        <View className="flex-row mb-4 bg-purple-100 rounded-full overflow-hidden">
          {["week", "month", "year"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as any)}
              className={`flex-1 py-2 ${
                tab === t ? "bg-[#7F56D9]" : "bg-purple-100"
              }`}
            >
              <Text
                className={`text-center font-[Poppins-Bold] ${
                  tab === t ? "text-white" : "text-[#7F56D9]"
                }`}
              >
                {t.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <WeekMonthYearSelector
          mode={tab}
          onChange={(r) => {
            const start = dayjs(r.startDate).format("YYYY-MM-DD");
            const end = dayjs(r.endDate).format("YYYY-MM-DD");

            setRange({ start, end });
            fetchAnalytics(tab, start, end);
          }}
        />

        {/* Chart */}
        <View className="mb-6">
          <EmotionChartWrapper type={tab}  data={data?.chart_data ?? []} />
        </View>

        {/* Stats */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tab === "week" && data && (
            <>
              <PositiveEmotionStat
                period="week"
                percentage={data.stats.positive_percentage}
                trend={data.stats.trend_positive}
              />
              <NegativeEmotionStat
                period="week"
                percentage={data.stats.negative_percentage}
                trend={data.stats.trend_negative}
              />
              <TotalDiaryStat
                period="week"
                percentage={data.stats.total_entries}
                trend={data.stats.trend_entries}
              />
            </>
          )}
          {tab === "month" && data && (
            <>
              <PositiveEmotionStat
                period="month"
                percentage={data.stats.positive_percentage}
                trend={data.stats.trend_positive}
              />
              <NegativeEmotionStat
                period="month"
                percentage={data.stats.negative_percentage}
                trend={data.stats.trend_negative}
              />
              <TotalDiaryStat
                period="month"
                percentage={data.stats.total_entries}
                trend={data.stats.trend_entries}
              />
            </>
          )}

          {tab === "year" && data && (
            <>
              <PositiveEmotionStat
                period="year"
                percentage={data.stats.positive_percentage}
                trend={data.stats.trend_positive}
              />
              <NegativeEmotionStat
                period="year"
                percentage={data.stats.negative_percentage}
                trend={data.stats.trend_negative}
              />
              <TotalDiaryStat
                period="year"
                percentage={data.stats.total_entries}
                trend={data.stats.trend_entries}
              />
              <AveragePositiveStat
                period="year"
                percentage={data.stats.average_positive}
                trend={data.stats.trend_positive}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
