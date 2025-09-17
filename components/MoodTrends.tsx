import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const mockData = {
  week: {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [{ data: [2, 3, 1, 4, 3, 2, 1] }],
  },
  month: {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [{ data: [3, 2, 4, 3] }],
  },
  year: {
    labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    datasets: [{ data: [2, 4, 3, 5, 4, 3] }],
  },
};

export default function MoodTrends() {
  const [filter, setFilter] = useState<"week" | "month" | "year">("week");

  const data = mockData[filter];

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-10">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-[Poppins-Bold] text-lg text-black">
          Your mood trends
        </Text>
        <View className="flex-row bg-purple-100 rounded-full overflow-hidden">
          {(["week", "month", "year"] as const).map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              className={`px-3 py-1 ${
                filter === item ? "bg-purple-500" : "bg-purple-100"
              }`}
            >
              <Text
                className={`text-sm ${
                  filter === item ? "text-white" : "text-purple-500"
                }`}
              >
                {item === "week" ? "Week" : item === "month" ? "Month" : "Year"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        fromZero
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(127, 86, 217, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(127, 86, 217, ${opacity})`,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#7F56D9",
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
      />
    </View>
  );
}
