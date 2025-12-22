import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import dayjs from "@/lib/dayjs";
import { ChartItem } from "@/constants/types";

const screenWidth = Dimensions.get("window").width;

export default function EmotionMonthChart({ data }: { data: ChartItem[] }) {
  if (!data.length) return null;

  // Group theo tuần trong tháng → score
  const weekly = useMemo(() => {
    const map: Record<number, number> = {};

    data.forEach((d) => {
      const weekIndex = Math.ceil(dayjs(d.date).date() / 7); // W1–W5
      const score = d.positive_count - d.negative_count;

      map[weekIndex] = (map[weekIndex] || 0) + score;
    });

    return map;
  }, [data]);

  const labels = Object.keys(weekly).map((w) => `W${w}`);
  const values = Object.values(weekly);

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-6">
      <Text className="font-[Poppins-Bold] text-lg mb-3">
        Monthly Emotion Stats
      </Text>

      <LineChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={screenWidth - 40}
        height={220}
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