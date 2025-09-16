import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";

const screenWidth = Dimensions.get("window").width;

const EmotionYearChart = () => {
  const [selected, setSelected] = useState<{ month: string; value: number } | null>(null);

  const labels = ["Happy", "Sad", "Chill", "Angry", "Calm", "Excited", "Annoy"];
  const data = [50, 30, 40, 70, 20, 90, 60, 40, 30, 80, 55, 65];
    const [fontsLoaded] = useFonts({
      "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
      "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
      "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
      "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
      "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
      "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
      "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
      "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
      "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
      "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
    });
              
    const onLayoutRootView = useCallback(async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }, [fontsLoaded]);
              
    if (!fontsLoaded) return null;

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
    </View>
  );
};

export default EmotionYearChart;
