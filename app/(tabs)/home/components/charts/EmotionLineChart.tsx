import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const EmotionLineChart = () => {
  const [selected, setSelected] = useState<{ day: string; value: number } | null>(null);

  const labels = ["Happy", "Sad", "Chill", "Angry", "Calm", "Excited", "Annoy"];
  const data = [3, 5, 2, 6, 4, 7, 1]; // số lần cảm xúc

  return (
    <View>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 40}
        height={220}
        fromZero
        yAxisInterval={1}
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
        bezier
        style={{
          borderRadius: 12,
        }}
        decorator={() =>
          selected ? (
            <View
              style={{
                position: "absolute",
                top: 40,
                left: labels.indexOf(selected.day) * ((screenWidth - 40) / labels.length) - 20,
                backgroundColor: "#7F56D9",
                padding: 6,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                {selected.day}: {selected.value}
              </Text>
            </View>
          ) : null
        }
        onDataPointClick={(point) => {
          setSelected({ day: labels[point.index], value: data[point.index] });
        }}
      />
    </View>
  );
};

export default EmotionLineChart;