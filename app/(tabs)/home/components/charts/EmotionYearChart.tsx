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
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(127, 86, 217, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(127, 86, 217, ${opacity})`,
          propsForLabels: {
            fontFamily: "Poppins-Regular",
            fontSize: 10,
          },
        }}
        showValuesOnTopOfBars
        withInnerLines={false}
        withHorizontalLabels
        style={{ borderRadius: 12 }}
      />
    </View>
  );
};

export default EmotionYearChart;
