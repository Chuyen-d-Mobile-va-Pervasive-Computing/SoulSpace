import Heading from "@/components/Heading";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ChevronRight } from "lucide-react-native";
import { useCallback } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const cards = [
  {
    title: "MBTI - Khám phá tính cách của bạn",
    desc: "Bạn là người hướng nội hay hướng ngoại? ...",
    image: require("@/assets/images/mbti.png"),
  },
  {
    title: "PHQ-9 – Đo lường mức độ trầm cảm",
    desc: "Cảm thấy buồn bã, mất động lực ...",
    image: require("@/assets/images/phq.png"),
  },
  {
    title: "GAD-7 – Đánh giá mức độ lo âu",
    desc: "Thường xuyên lo lắng, bồn chồn ...",
    image: require("@/assets/images/gad.png"),
  },
  {
    title: "PSS – Đo mức độ căng thẳng",
    desc: "Cuộc sống bận rộn khiến bạn cảm thấy áp lực? ...",
    image: require("@/assets/images/pss.png"),
  },
];

export default function ExploreScreen() {
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
    <View className="flex-1 bg-[#020659]">
      {/* Header */}
      <Heading title="Explore" />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Test Result */}
        <View className="py-3 px-1">
          <TouchableOpacity
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/explore/result")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-[Poppins-Bold] text-base">
                Tests Performed
              </Text>
              <ChevronRight width={24} height={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        {/* Cards */}
        {cards.map((item, idx) => (
          <View
            key={idx}
            className="bg-[rgba(255,255,255,0.2)] rounded-xl p-3 mb-5"
          >
            <Image
              source={item.image}
              className="w-full h-32 rounded-lg"
              resizeMode="cover"
            />
            <View className="my-2">
              <Text className="text-white text-base font-[Poppins-Bold] mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-300 text-sm font-[Poppins-Regular]">
                {item.desc}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/explore/test",
                  params: { testType: item.title },
                })
              }
              className="bg-[rgba(111,4,217,0.6)] rounded-lg py-3 items-center mt-2"
            >
              <Text className="text-white font-[Poppins-SemiBold] text-sm">
                Do the questionnaire
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
