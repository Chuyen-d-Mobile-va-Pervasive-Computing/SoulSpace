import ConsultFooter from "@/components/ConsultFooter";
import { useNavigation } from "@react-navigation/native";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function ConsultLayout() {
  const navigation: any = useNavigation();

  useEffect(() => {
    const parent = navigation.getParent(); // thường sẽ là Tabs navigator

    if (!parent) return;

    // 1️⃣ Ẩn tab bar NGAY LẬP TỨC khi vào consult
    parent.setOptions({
      tabBarStyle: { display: "none" },
    });

    // 2️⃣ Đảm bảo khi màn consult được focus lại thì vẫn ẩn tab bar
    const unsubscribeFocus = navigation.addListener("focus", () => {
      parent.setOptions({
        tabBarStyle: { display: "none" },
      });
    });

    // 3️⃣ Khi rời khỏi consult (blur) → khôi phục tab bar gốc
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

    // 4️⃣ Nếu layout bị unmount (edge case) → cũng khôi phục lại tab bar
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

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Slot />
      <ConsultFooter />
    </View>
  );
}
