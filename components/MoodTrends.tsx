import { router } from "expo-router";
import {
  Dimensions,
  Pressable,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartItem } from "@/constants/types";

const screenWidth = Dimensions.get("window").width;

export default function MoodTrends({ data = [] }: { data?: ChartItem[] }) {
  if (data.length === 0) return null;

  return (
    <View className="bg-white rounded-2xl p-4 shadow mt-10">
      <Text className="font-[Poppins-Bold] text-lg mb-4">
        Your mood trends
      </Text>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(tabs)/home/analytic",
            // params: { tab: filter },
          })
        }
      >
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
            color: (opacity = 1) =>
              `rgba(127, 86, 217, ${opacity})`,
            labelColor: () => "#9E9E9E",
          }}
          bezier
          style={{ borderRadius: 16 }}
        />
       </Pressable> 
    </View>
  );
}