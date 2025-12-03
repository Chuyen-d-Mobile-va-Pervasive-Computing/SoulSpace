import ConsultFooter from "@/components/ConsultFooter";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function ConsultLayout() {
  const navigation: any = useNavigation();

  // Load Poppins fonts giống TabLayout
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

  useEffect(() => {
    const parent = navigation.getParent();

    if (!parent) return;

    // Ẩn tab bar khi vào Consult
    parent.setOptions({
      tabBarStyle: { display: "none" },
    });

    const unsubscribeFocus = navigation.addListener("focus", () => {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      parent.setOptions({
        tabBarStyle: {
          backgroundColor: "#FCFBFF",
          borderTopColor: "#E5E5E5",
          height: 120,
          paddingTop: 10,
          paddingBottom: 20,
        },
      });
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      parent.setOptions({
        tabBarStyle: {
          backgroundColor: "#FCFBFF",
          borderTopColor: "#E5E5E5",
          height: 120,
          paddingTop: 10,
          paddingBottom: 20,
        },
      });
    };
  }, [navigation]);

  // ⛔ Nếu chưa load xong font → không render
  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-[#FAF9FF]" onLayout={onLayoutRootView}>
      <Slot />
      <ConsultFooter />
    </View>
  );
}
