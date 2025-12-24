import Activity1 from "@/assets/images/activity1.svg";
import Activity2 from "@/assets/images/activity2.svg";
import Activity3 from "@/assets/images/activity3.svg";
import Activity4 from "@/assets/images/activity4.svg";
import Activity5 from "@/assets/images/activity5.svg";
import Activity6 from "@/assets/images/activity6.svg";
import Angry from "@/assets/images/angry.svg";
import Confused from "@/assets/images/confused.svg";
import Decor from "@/assets/images/decor.svg";
import Excited from "@/assets/images/excited.svg";
import Happy from "@/assets/images/happy.svg";
import Logo from "@/assets/images/logo.svg";
import Worried from "@/assets/images/worried.svg";
import MoodTrends from "@/components/MoodTrends";
import { router, useFocusEffect } from "expo-router";
import { ArrowBigRight, Bell } from "lucide-react-native";
import { useRef, useState, useEffect, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChartItem } from "@/constants/types";
import { getPreviousWeekRange } from "@/constants/currentWeek";
import dayjs from "dayjs";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface Me {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

const progressIcons = [
  { name: "Angry", icon: Angry },
  { name: "Worried", icon: Worried },
  { name: "Confused", icon: Confused },
  { name: "Happy", icon: Happy },
  { name: "Excited", icon: Excited },
];

function getEmotionIndex(score: number) {
  const clamped = Math.max(0, Math.min(score, 1));
  const rawIndex = clamped * (progressIcons.length - 1);
  return Math.round(rawIndex);
}

export default function HomeScreen() {
  const [me, setMe] = useState<Me | null>(null);
  const [averageScore, setAverageScore] = useState(0);
  const activeIndex = getEmotionIndex(averageScore);
  const progressPercent = Math.round(averageScore * 100);
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const [activitiesY, setActivitiesY] = useState(0);

  const handleExploreMore = () => {
    scrollRef.current?.scrollTo({ y: activitiesY - 5, animated: true });
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch me");
        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };
    fetchMe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchMoodTrend = async () => {
        try {
          const token = await AsyncStorage.getItem("access_token");
          if (!token) return;

          const { startDate, endDate } = getPreviousWeekRange();

          const res = await fetch(
            `${API_BASE}/api/v1/journal/analytics` +
              `?period=week&start_date=${startDate}&end_date=${endDate}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) return;
          const json = await res.json();
          setChartData(json.chart_data ?? []);
        } catch (err) {
          console.error("Fetch mood trend error:", err);
        }
      };
      fetchMoodTrend();
    }, [])
  );

  useEffect(() => {
    const fetchDailySentiment = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;
        const date = dayjs().format("YYYY-MM-DD");
        const res = await fetch(
          `${API_BASE}/api/v1/journal/daily-sentiment?date=${date}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) return;
        const json = await res.json();
        setAverageScore(json.average_score ?? 0);
      } catch (err) {
        console.error("Fetch daily sentiment error:", err);
      }
    };

    fetchDailySentiment();
  }, []);

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Heading */}
      <View className="w-full flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-[#FAF9FF] mt-8">
        <View className="flex-row items-center">
          <Logo width={80} height={30} />
          <Text className="font-[Poppins-Bold] text-2xl text-[#7F56D9] ml-2">
            SOULSPACE
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home/noti")}>
            <Bell strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(tabs)/home/wall")}>
            <Image
              source={{ uri: me?.avatar_url }}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity> 
        </View>
      </View>

      {/* Body */}
      <View className="flex-1 bg-[#FAF9FF]">
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ flexGrow: 1 }}
          className="p-4"
        >
          {/* Greeting Card */}
          <View className="flex-row justify-between items-center bg-[#7F56D9] rounded-2xl">
            {/* Left side*/}
            <View className="flex-1 pl-4 pt-4 pb-4">
              <Text className="text-white font-[Poppins-Bold] text-2xl">
                Hello, SE405
              </Text>
              <Text className="text-white mt-2 font-[Poppins-Regular] text-sm">
                Hope you are enjoying your day. If not then we are here for you
                as always.
              </Text>
              <TouchableOpacity
                className="mt-4 bg-white rounded-full px-4 py-2 self-start"
                onPress={handleExploreMore}
              >
                <Text className="text-[#7F56D9] font-[Poppins-SemiBold]">
                  Explore more
                </Text>
              </TouchableOpacity>
            </View>

            {/* Right side */}
            <Decor width={100} height={170} />
          </View>

          {/* Progress */}
          <Text className="text-black font-[Poppins-Bold] text-2xl mt-6">
            How are you feeling today ?
          </Text>
          <View className="w-full items-center mt-6">
            <TouchableOpacity
              className="w-full"
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/home/diary")}
            >
              <View className="w-full h-6 bg-gray-200 rounded-full relative overflow-hidden">
                {/* Thanh progress */}
                <View
                  style={{ width: `${progressPercent}%` }}
                  className="absolute left-0 top-0 h-6 bg-[#7F56D9] rounded-full"
                />
              </View>
              {/* Icon cảm xúc */}
              <View className="flex-row justify-between w-full mt-[-25] px-2">
                {progressIcons.map((item, index) => {
                  const Icon = item.icon;
                  const active = index === activeIndex;

                  return (
                    <View
                      key={item.name}
                      className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
                        active ? "bg-[#7F56D9]" : "bg-yellow-100"
                      }`}
                    >
                      <Icon width={36} height={36} />
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
            <MoodTrends data={chartData} />
          </View>

          <View onLayout={(e) => setActivitiesY(e.nativeEvent.layout.y)}>
            <Text className="text-black font-[Poppins-Bold] text-2xl mt-6 mb-6">
              Activities you may like
            </Text>
            <View>
              <View className="self-stretch inline-flex flex-col justify-start items-start gap-4">
                <View className="flex-row w-full gap-4">
                  {/* Ảnh 1 */}
                  <View className="relative flex-1 items-center">
                    <Activity2 width={180} height={180} />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#FFB34D] rounded-full p-3 shadow"
                      onPress={() => router.push("/(tabs)/home/remind")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>

                  {/* Ảnh 2 */}
                  <View className="relative flex-1 items-center">
                    <Activity1
                      width={180}
                      height={180}
                      preserveAspectRatio="xMidYMid meet"
                    />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#3A6FE6] rounded-full p-3 shadow"
                      onPress={() => router.push("/(tabs)/explore")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row w-full gap-4">
                  {/* Ảnh 3 */}
                  <View className="relative flex-1 items-center">
                    <Activity3 width={180} height={180} />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#D15743] rounded-full p-3 shadow"
                      onPress={() => router.push("/(tabs)/home/consult")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>

                  {/* Ảnh 4 */}
                  <View className="relative flex-1 items-center">
                    <Activity4 width={180} height={180} />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#4CAADD] rounded-full p-3 shadow"
                      onPress={() => router.push("/(tabs)/home/diary")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-row w-full mb-8 gap-4">
                  {/* Ảnh 5 */}
                  <View className="relative flex-1 items-center">
                    <Activity5
                      width={180}
                      height={180}
                      preserveAspectRatio="xMidYMid meet"
                    />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#34D1BF] rounded-full p-3 shadow"
                      onPress={() => router.push("/(tabs)/home/plant")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>

                  {/* Ảnh 6 */}
                  <View className="relative flex-1 items-center">
                    <Activity6
                      width={180}
                      height={180}
                      preserveAspectRatio="xMidYMid meet"
                    />
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-[#D3A819] rounded-full p-3 shadow"
                      onPress={() => router.navigate("/(tabs)/community")}
                    >
                      <ArrowBigRight color="white" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
