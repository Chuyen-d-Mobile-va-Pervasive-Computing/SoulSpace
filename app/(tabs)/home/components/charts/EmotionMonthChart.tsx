import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const EmotionMonthChart = () => {
  const [selected, setSelected] = useState<{ index: number; value: number } | null>(null);

  const labels = ["Happy", "Sad", "Chill", "Angry", "Calm", "Excited", "Annoy"];
  const data = [10, 7, 5, 12, 9, 15, 8];

  return (
    <View style={{ alignItems: "center" }}>
      <BarChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={220}
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
          propsForLabels: {
            fontFamily: "Poppins-SemiBold",
            fontSize: 10,
          },
        }}
        showValuesOnTopOfBars
        withInnerLines={false}
        withHorizontalLabels
        style={{ borderRadius: 16 }}
      />

      {/* Fake touch zones */}
      <View
        style={{
          position: "absolute",
          top: 40,
          flexDirection: "row",
          width: screenWidth - 40,
          height: 180,
        }}
      >
        {data.map((val, index) => (
          <TouchableOpacity
            key={index}
            style={{ flex: 1 }}
            activeOpacity={0.7}
            onPress={() => setSelected({ index, value: val })}
          />
        ))}
      </View>

      {/* Tooltip */}
      {selected && (
        <View
          style={{
            position: "absolute",
            top: 10,
            left:
              (selected.index + 0.5) *
                ((screenWidth - 40) / data.length) -
              40,
            backgroundColor: "#8736D9",
            padding: 6,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "white", fontSize: 12 }}>
            {labels[selected.index]}: {selected.value}
          </Text>
        </View>
      )}
    </View>
  );
};

export default EmotionMonthChart;