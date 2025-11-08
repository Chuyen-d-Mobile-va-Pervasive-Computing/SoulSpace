import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function ExploreScreen() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [percent, setPercent] = useState(0);
  const [currentTestCode, setCurrentTestCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/v1/tests`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await res.json();
        console.log("API /tests response:", data);

        if (Array.isArray(data)) {
          setTests(data);
          const unfinished = data.find(t => t.completion_percentage > 0 && t.completion_percentage < 100);
          if (unfinished) {
            setPercent(unfinished.completion_percentage);
            setCurrentTestCode(unfinished.test_code);
          } else {
            setPercent(0);
            setCurrentTestCode(null);
          }
        } else {
          setTests([]);
          setPercent(0);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
        setTests([]);
        setPercent(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const bgColors = ["#D9D8FF", "#BEC8CF", "#AFCEE8", "#AFE8E1"];
  const btnColors = ["#8130C8", "#01101C", "#066BBE", "#2DA800"];

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Explore" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Description */}
        <View className="pt-3">
          <Text className="text-[#605D67] font-[Poppins-Bold] text-2xl">
            Discover Yourself
          </Text>
          <Text className="text-[#605D67] font-[Poppins-Regular] text-sm mt-1">
            Start your journey of self-understanding through engaging
            psychological tests.
          </Text>
        </View>

        {/* Test Progress Card */}
        <View className="w-full pt-2">
          <TouchableOpacity
            className="w-full rounded-xl border border-white bg-[#E0D7F9] p-4 justify-center"
            onPress={() => router.push("/(tabs)/explore/result")}
          >
            <Text className="text-[#7F56D9] font-[Poppins-Bold] text-xl">
              {currentTestCode ? currentTestCode : "Tests"}
            </Text>
            <View className="w-full flex-row items-center mt-3 mb-2 gap-2">
              <Text className="text-[#7F56D9] font-semibold">{percent}%</Text>

              <View className="flex-1 h-4 bg-white rounded-full overflow-hidden mr-2">
                <View
                  className="h-4 bg-[#7F56D9]"
                  style={{ width: `${percent}%` }}
                />
              </View>
            </View>

            <Text className="text-[#7F56D9] font-[Poppins-Regular] text-base mt-2">
              to complete
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="p-2 font-[Poppins-Bold] text-xl text-[#605D67] mb-2">
          Explore Tests
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#7F56D9" />
        ) : Array.isArray(tests) && tests.length > 0 ? (
          tests.map((test, index) => {
            const bgColor = bgColors[index % bgColors.length];
            const btnColor = btnColors[index % btnColors.length];
            const isEven = index % 2 === 1;

            return (
              <View
                key={test._id}
                className="flex-row items-center rounded-2xl p-4 mb-4"
                style={{
                  backgroundColor: bgColor,
                  flexDirection: isEven ? "row-reverse" : "row",
                }}
              >
                <View
                  className={`flex-1 ${isEven ? "pl-10" : "pr-3"} justify-center`}
                >
                  <Text className="text-black text-lg font-[Poppins-SemiBold] mb-3">
                    {test.test_code}
                  </Text>

                  <TouchableOpacity
                    style={{ backgroundColor: btnColor }}
                    className="px-6 py-2 rounded-full max-w-[80px] items-center"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/explore/test",
                        params: { test: JSON.stringify(test) },
                      })
                    }
                  >
                    <Text className="text-white font-[Poppins-SemiBold]">Test</Text>
                  </TouchableOpacity>
                </View>

                <Image
                  source={{ uri: test.image_url }}
                  style={{
                    width: 100,
                    height: 80,
                    borderRadius: 12,
                    marginLeft: isEven ? 0 : 100,
                    marginRight: isEven ? 100 : 0,
                  }}
                  resizeMode="cover"
                />
              </View>
            );
          })
        ) : (
          <Text className="text-center text-gray-500 mt-4">
            No tests available.
          </Text>
        )} 
      </ScrollView>
    </View>
  );
}