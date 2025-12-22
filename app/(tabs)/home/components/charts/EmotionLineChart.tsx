import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartItem } from "@/constants/types";

const screenWidth = Dimensions.get("window").width;

export default function EmotionLineChart({ data }: { data: ChartItem[] }) {
  if (!data.length) return null;

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-6">
      <Text className="font-[Poppins-Bold] text-lg mb-3">
        Weekly Emotion Stats
      </Text>

      <LineChart
        data={{
          labels: data.map((d) => d.date.slice(5)),
          datasets: [
            {
              data: data.map(
                (d) => d.positive_count - d.negative_count
              ),
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        fromZero
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(127, 86, 217, ${opacity})`,
          labelColor: () => "#9E9E9E",
          propsForLabels: {
            fontFamily: "Poppins-Regular",
            fontSize: 10,
          },
        }}
        bezier
      />
    </View>
  );
}