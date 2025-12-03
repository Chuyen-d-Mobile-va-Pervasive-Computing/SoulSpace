import ConsultFooter from "@/components/ConsultFooter";
import { useNavigation } from "@react-navigation/native";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function ConsultLayout() {
  const navigation: any = useNavigation();

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    parent.setOptions({ tabBarStyle: { display: "none" } });

    const unsubFocus = navigation.addListener("focus", () => {
      parent.setOptions({ tabBarStyle: { display: "none" } });
    });

    const unsubBlur = navigation.addListener("blur", () => {
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
      unsubFocus();
      unsubBlur();
    };
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Slot />
      <ConsultFooter />
    </View>
  );
}
