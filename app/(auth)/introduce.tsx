import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import SVG/Images của bạn
import Illustrator1 from "@/assets/images/introduce1.svg";
import Illustrator2 from "@/assets/images/introduce2.svg";
import Illustrator3 from "@/assets/images/introduce3.svg";
import Illustrator4 from "@/assets/images/introduce4.svg";
import Illustrator5 from "@/assets/images/introduce5.svg";
import { ArrowRight } from "lucide-react-native";

SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    step: "Step One",
    title: "Personalize Your Mental ",
    highlight: "Health State ",
    subtitle: "With AI",
    image: Illustrator1,
    highlightColor: "#34D1BF",
  },
  {
    id: 2,
    step: "Step Two",
    title: "Intelligent ",
    highlight: "Mood Tracking ",
    subtitle: "& AI Emotion Insights",
    image: Illustrator2,
    highlightColor: "#FFB34D",
  },
  {
    id: 3,
    step: "Step Three",
    title: "AI ",
    highlight: "Mental Journaling ",
    subtitle: "& AI Therapy Chatbot",
    image: Illustrator3,
    highlightColor: "#FF6B6B",
  },
  {
    id: 4,
    step: "Step Four",
    title: "Mindful ",
    highlight: "Resources ",
    subtitle: "That Makes You Happy",
    image: Illustrator4,
    highlightColor: "#4CAADD",
  },
  {
    id: 5,
    step: "Step Five",
    title: "Loving & Supportive ",
    highlight: "Community",
    subtitle: "",
    image: Illustrator5,
    highlightColor: "#B5A2E9",
  },
];

export default function Introduce() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Load Poppins font
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      }
    } else {
      router.push("/(auth)/login"); // hết slide thì chuyển trang
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF] pt-12" onLayout={onLayoutRootView}>
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 w-full">
            {/* Step chip */}
            <View className="items-center mt-[20px]">
              <View className="rounded-[32px] border border-stone-700 px-3.5 py-2">
                <Text className="text-center text-stone-700 text-base font-[Poppins-Regular]">
                  {item.step}
                </Text>
              </View>
            </View>

            {/* Illustration */}
            <View className="flex-1 items-center justify-center w-full">
              <item.image width="100%" height={550} style={{ zIndex: -2 }} />
            </View>
            <View
              className="absolute"
              style={{
                width: 700,
                height: 700,
                borderRadius: 500,
                backgroundColor: "white",
                bottom: "-85%",
                left: "-40%",
                zIndex: -1,
              }}
            />
            {/* Title */}
            <Text className="text-center font-[Poppins-Bold] text-[24px] mb-4">
              {item.title}
              <Text style={{ color: item.highlightColor }}>
                {item.highlight}
              </Text>
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Footer */}
      <View className="items-center mb-8 bg-white">
        {/* Progress bar */}
        <View className="h-2 w-48 bg-gray-200 rounded-full overflow-hidden mb-6">
          <View
            className="h-2 bg-[#7F56D9]"
            style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
          />
        </View>

        {/* Circle button */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-16 h-16 rounded-full bg-[#7F56D9] items-center justify-center shadow-lg mb-24"
        >
          <Text className="text-white text-2xl">
            <ArrowRight color={"#fff"} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
