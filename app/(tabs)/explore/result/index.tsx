import Heading from "@/components/Heading";
import { router } from "expo-router";
import { BookCheck } from "lucide-react-native";
import { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function TestResultTypeScreen() {
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${API_BASE}/api/v1/tests/completed`, {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Completed tests:", data);
        setResults(data);
      } catch (err) {
        console.log("Error fetching completed tests:", err);
      }
    };
    fetchCompletedTests();
  }, []);

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Test done" />

      {/* Body */}
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {results.length === 0 ? (
          <View className="flex-1 items-center mt-10">
            <Text className="text-gray-500 text-base font-[Poppins-Regular]">
              No completed tests yet.
            </Text>
          </View>
        ) : (
          results.map((item, index) => (
            <View key={index} className="py-3 px-1">
              <View className="w-full rounded-2xl bg-white px-4 py-4 shadow">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-purple-100 p-3 rounded-xl">
                      <BookCheck color="#7F56D9" />
                    </View>
                    <View>
                      <Text className="font-[Poppins-Bold] text-xl text-black">
                        {item.test_code}
                      </Text>
                      <Text className="font-[Poppins-Regular] text-xs text-gray-500">
                        Completed on {new Date(item.completed_at).toDateString()}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <View className="bg-[#FFE9F2] px-3 py-1 rounded-full mb-2">
                      <Text className="text-base font-[Poppins-SemiBold] text-[#F43F5E]">
                        {item.severity_level}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-4">
                  <Text className="text-2xl font-[Poppins-Bold] text-black">
                    {item.score_ratio} points
                  </Text>

                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/explore/test/done",
                        params: { result_id: item.result_id, source: "result" },
                      })
                    }
                  >
                    <Text className="text-sm font-[Poppins-SemiBold] text-[#7F56D9]">
                      View results
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}