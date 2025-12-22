import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import { ChartItem } from "@/constants/types";

const screenWidth = Dimensions.get("window").width;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function EmotionYearChart({ data }: { data: ChartItem[] }) {
  if (!data.length) return null;

  const monthly = useMemo(() => {
    const map: Record<number, number> = {};

    data.forEach((d) => {
      const m = dayjs(d.date).month();
      const score = d.positive_count - d.negative_count;
      map[m] = (map[m] || 0) + score;
    });

    return map;
  }, [data]);

  const labels = Object.keys(monthly)
    .map(Number)
    .sort((a, b) => a - b)
    .map((m) => MONTHS[m]);

  const values = Object.keys(monthly)
    .map(Number)
    .sort((a, b) => a - b)
    .map((m) => monthly[m]);

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-6">
      <Text className="font-[Poppins-Bold] text-lg mb-3">
        Yearly Emotion Stats
      </Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth - 40}
        height={250}
        fromZero
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (o = 1) => `rgba(127,86,217,${o})`,
          labelColor: () => "#9E9E9E",
          propsForLabels: {
            fontFamily: "Poppins-Regular",
            fontSize: 10,
          },
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}