import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AngryIcon from "@/assets/images/angry.svg";
import AnnoyIcon from "@/assets/images/annoy.svg";
import CalmIcon from "@/assets/images/calm.svg";
import ChillIcon from "@/assets/images/chill.svg";
import ConfusedIcon from "@/assets/images/confused.svg";
import EmbarrassedIcon from "@/assets/images/embarrassed.svg";
import ExcitedIcon from "@/assets/images/excited.svg";
import HappyIcon from "@/assets/images/happy.svg";
import SadIcon from "@/assets/images/sad.svg";
import WorriedIcon from "@/assets/images/worried.svg";

const emotions = [
  { id: 1, name: "Happy", icon: HappyIcon },
  { id: 2, name: "Sad", icon: SadIcon },
  { id: 3, name: "Angry", icon: AngryIcon },
  { id: 4, name: "Annoy", icon: AnnoyIcon },
  { id: 5, name: "Calm", icon: CalmIcon },
  { id: 6, name: "Chill", icon: ChillIcon },
  { id: 7, name: "Confused", icon: ConfusedIcon },
  { id: 8, name: "Embarrassed", icon: EmbarrassedIcon },
  { id: 9, name: "Excited", icon: ExcitedIcon },
  { id: 10, name: "Worried", icon: WorriedIcon }
];

export default function EmotionPicker({
  onSelect,
}: {
  onSelect: (emotion: { id: number; name: string; icon: any }) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3">
      {emotions.map((emotion) => {
        const Icon = emotion.icon;
        const isActive = selected === emotion.id;
        return (
          <TouchableOpacity
            key={emotion.id}
            className={`mx-1 p-3 rounded-xl items-center justify-center ${
              isActive ? "bg-purple-300" : "bg-gray-100"
            }`}
            onPress={() => {
              setSelected(emotion.id);
              onSelect(emotion); // trả về object
            }}
          >
            <Icon width={32} height={32} />
            <Text className="text-xs mt-1 font-[Poppins-Regular]">{emotion.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}