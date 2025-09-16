import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Option = {
  id: number | string;
  name: string;
};

type Props = {
  options: Option[];
  multiSelect?: boolean;
  onChange: (id: number | string, selected: Option[] | Option | null) => void;
};

export default function GenericSelector({
  options,
  multiSelect = false,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<Option[] | Option | null>(
    multiSelect ? [] : null
  );

  const toggleSelect = (id: number | string) => {
    const opt = options.find((o) => o.id === id)!;

    if (multiSelect) {
      const current = selected as Option[];
      const exists = current.find((x) => x.id === id);
      const newSelected = exists
        ? current.filter((x) => x.id !== id)
        : [...current, opt];

      setSelected(newSelected);
      onChange(id, newSelected);
    } else {
      const current = selected as Option | null;
      const newSelected = current?.id === id ? null : opt;
      setSelected(newSelected);
      onChange(id, newSelected);
    }
  };

  const isSelected = (id: number | string) =>
    multiSelect
      ? (selected as Option[]).some((s) => s.id === id)
      : (selected as Option | null)?.id === id;

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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", gap: 8 }}
    >
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          className={`px-4 py-2 rounded-full ${
            isSelected(opt.id) ? "bg-purple-500" : "bg-[#A894C1]"
          }`}
          onPress={() => toggleSelect(opt.id)}
        >
          <Text className="text-white font-[Poppins-Regular]">{opt.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}