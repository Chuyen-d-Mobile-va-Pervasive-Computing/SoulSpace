import HappyIcon from "@/assets/images/happy.svg";
import EmotionDisplay from "@/components/EmotionDisplay";
import { emotionMap } from "@/constants/EmotionMap";
import { router } from "expo-router";
import { Bell, Gamepad2, Heart, MessageCircle, Sprout } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import EmotionChartWrapper from "./components/EmotionChartWrapper";

type LatestJournal = {
  emotion_label: keyof typeof emotionMap;
};

// fake dữ liệu journal gần nhất
const latestJournal: LatestJournal = {
  emotion_label: "Hào hứng", // key phải khớp với emotionMap
};

export default function HomeScreen() {
  const openDiary = () => {
    router.push("/(tabs)/home/diary");
  };
  const openCommunity = () => {
    router.push("/(tabs)/community");
  };
  const openAnalytic = () => {
    router.push("/(tabs)/home/analytic");
  };
  return (
    <View className="flex-1 bg-[#020659]">
      {/* Heading */}
      <View>
        <View className="w-full items-center px-4 mt-8">
          <View className="w-full h-[60px] flex-row items-center justify-between rounded-2xl border border-[#6f04d9] bg-[#6f04d94d] p-2">
            {/* User Info */}
            <View className="flex-row items-center gap-2">
              <View className="px-2">
                <Text className="text-[12px] text-white">
                  Tuesday, 1st January
                </Text>
                <Text className="text-[14px] font-bold text-white">
                  user01234567
                </Text>
              </View>
            </View>
            <Bell width={28} height={28} color="white" />
          </View>
        </View>
      </View>
      {/* Body */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="flex-1 px-4 pt-2">
        {/* Emotion */}
        <EmotionDisplay emotionLabel={latestJournal.emotion_label} />
        <View>
          <View className="flex-row justify-between w-full p-5 rounded-xl">
            {/* Trồng cây */}
            <TouchableOpacity 
              className="w-[100px] p-2 items-center justify-center border border-[#5cb338] rounded-lg bg-[rgba(92,179,56,0.3)]"
              onPress={() => router.push("/(tabs)/home/plant")}
            >
              <View className="flex-1 items-center justify-center">
                <Sprout size={24} color="#5cb338" />
                <Text className="text-center font-extrabold text-[14px] text-[#5cb338]">
                  Plant
                </Text>
              </View>
            </TouchableOpacity>

            {/* Nhắc nhở */}
            <TouchableOpacity 
              className="w-[100px] h-[100px] p-2 items-center justify-center border border-[#c9c40b] rounded-lg bg-[rgba(201,196,11,0.3)]"
              onPress={() => router.push("/(tabs)/home/remind")}
            >
              <View className="flex-1 items-center justify-center">
                <Bell width={24} height={24} color="#ece852" />
                <Text className="text-center font-extrabold text-[14px] text-[#ece852]">
                  Remind
                </Text>
              </View>
            </TouchableOpacity>

            {/* Minigame */}
            <TouchableOpacity 
              className="w-[100px] h-[100px] p-2 items-center justify-center border border-[#e6a117] rounded-lg bg-[rgba(230,161,23,0.3)]"
              onPress={() => router.push("/(tabs)/home/minigame")}
            >
              <View className="flex-1 items-center justify-center">
                <Gamepad2 size={24} color="#e6a117" />
                <Text className="text-center font-extrabold text-[14px] text-[#e6a117]">
                  Minigame
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* Analytic */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <Text className="text-white font-bold text-base">Emotion</Text>
              <TouchableOpacity onPress={openAnalytic}>
                <Text className="text-right text-sm font-semibold text-[#8736D9]">
                  View stats
                </Text>
              </TouchableOpacity>
          </View>
          <View className="mt-6">
            <EmotionChartWrapper type="year" />
          </View>
        </View>
        {/* Diary */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <Text className="text-white font-bold text-base">My recent diary</Text>
              <TouchableOpacity onPress={openDiary}>
                <Text className="text-right text-sm font-semibold text-[#8736D9]">
                  View all
                </Text>
              </TouchableOpacity>
          </View>
          <View className="flex-1">
            <View className=" gap-2 rounded-xl mt-4 bg-white/10 border border-white/20 p-4">
              <View className="w-full items-center self-stretch gap-2">
                <View className="flex-row self-stretch justify-between">
                  <Text className="text-white text-[12px] font-bold">Hôm qua</Text>
                  <HappyIcon width={20} height={20} className="overflow-hidden" />
                </View>
                <Text className="self-stretch text-base text-white">Tôi vui lắm</Text>
              </View>

              <View className="self-start rounded-full border border-[#6f04d9] bg-[#6f04d94d] px-3 py-0.5">
                <Text className="text-xs font-bold text-white">Gia đình</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Community */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <Text className="text-white font-bold text-base">Posts from community</Text>
              <TouchableOpacity onPress={openCommunity}>
                <Text className="text-right text-sm font-semibold text-[#8736D9]">
                  View all
                </Text>
              </TouchableOpacity>
          </View>
          <View className="mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg">
            {/* Header */}
            <View>
              <Text className="text-white font-semibold text-sm">
                user01234567
              </Text>
              <Text className="text-gray-300 text-xs mt-1">
                12:20:20 26/4/2025
              </Text>
            </View>
            {/* Content */}
            <Text className="text-white text-base mt-3">Tôi vui lắm</Text>
            {/* Interaction */}
            <View className="flex-row mt-3 gap-6">
              <View className="flex-row items-center gap-1">
                <Heart width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}