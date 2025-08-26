import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const EmotionYearChart = () => {
  const [selected, setSelected] = useState<{ month: string; value: number } | null>(null);

  const labels = ["Happy", "Sad", "Chill", "Angry", "Calm", "Excited", "Annoy"];
  const data = [50, 30, 40, 70, 20, 90, 60, 40, 30, 80, 55, 65];

  return (
    <View>
      <BarChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundColor: "#1e1e2d",
          backgroundGradientFrom: "#1e1e2d",
          backgroundGradientTo: "#1e1e2d",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(135, 54, 217, ${opacity})`,
          labelColor: () => "#fff",
        }}
        showValuesOnTopOfBars
        withInnerLines={false}
        withHorizontalLabels
        style={{ borderRadius: 16 }}
      />
    </View>
  );
};

export default EmotionYearChart;
