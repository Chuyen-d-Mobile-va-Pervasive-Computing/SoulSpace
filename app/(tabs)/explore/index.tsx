import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
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
  return (
    <View className="flex-1 bg-[#020659]">
      {/* Header */}
      <Heading title="Explore" showBack={true} />

      {/* Body */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Test Result */}
        <View className="py-3 px-1">
          <TouchableOpacity 
            className="w-full h-14 rounded-xl border border-white bg-white/15 px-3 justify-center"
            onPress={() => router.push("/(tabs)/explore/result")}
          >
            <View className="flex-row items-center justify-between">
              <Text className="text-white font-bold text-base">
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
              <Text className="text-white text-base font-bold mb-1">
                {item.title}
              </Text>
              <Text className="text-gray-300 text-sm">{item.desc}</Text>
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
              <Text className="text-white font-semibold text-sm">
                Do the questionnaire
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}