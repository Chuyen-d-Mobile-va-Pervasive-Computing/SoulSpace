import { useLocalSearchParams, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ngăn tự động ẩn splash
SplashScreen.preventAutoHideAsync();

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFn;
}

export default function TestDoingScreen() {
  const { test_code } = useLocalSearchParams<{ test_code: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<
    { question_id: string; chosen_option_id: string | null }[]
  >([]);

  // Gửi lưu draft (debounce 2s)
  const saveProgress = useDebounce(async (updatedAnswers: any[]) => {
    const token = await AsyncStorage.getItem("access_token");
    try {
      await fetch(`${API_BASE}/api/v1/tests/${test_code}/progress`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ test_code, answers: updatedAnswers }),
      });
      console.log("Progress saved");
    } catch (err) {
      console.warn("Error saving progress:", err);
    }
  }, 2000);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/tests/${test_code}/questions`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response format");

        const sorted = data.sort((a, b) => a.question_order - b.question_order);
        setAnswers(sorted.map((q: any) => ({ question_id: q._id, chosen_option_id: null })));
        setQuestions(sorted);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Cannot load test questions");
      } finally {
        setLoading(false);
      }
    };

    if (test_code) fetchQuestions();
  }, [test_code]);

  const handleSelect = (question_id: string, option_id: string) => {
    const updated = answers.map((a) =>
      a.question_id === question_id ? { ...a, chosen_option_id: option_id } : a
    );
    setAnswers(updated);

    // debounce 2 giây sau khi chọn mới gọi API progress
    saveProgress(updated);
  };

  const computeScore = () => {
    let sum = 0;
    for (const ans of answers) {
      if (!ans.chosen_option_id) continue;
      const q = questions.find((q) => q._id === ans.question_id);
      const opt = q?.options.find((o: any) => o.option_id === ans.chosen_option_id);
      if (opt) sum += opt.score_value ?? 0;
    }
    return sum;
  };

  const submitTest = async () => {
    const token = await AsyncStorage.getItem("access_token");
    try {
      const res = await fetch(`${API_BASE}/api/v1/tests/${test_code}/submit`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ test_code, answers }),
      });

      const result = await res.json();

      if (res.status === 201) {
        router.push({
          pathname: "/(tabs)/explore/test/done",
          params: { result: JSON.stringify(result) },
        });
      } else {
        Alert.alert("Error", "Failed to submit test");
      }
    } catch (err) {
      console.error("Error submitting test:", err);
      Alert.alert("Error", "Cannot submit test");
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      const totalScore = computeScore();
      console.log("Total score:", totalScore);
      submitTest();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF9FF]">
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF9FF]">
        <Text className="text-gray-500 text-lg">No questions available</Text>
      </View>
    );
  }

  const total = questions.length;
  const percent = Math.round(((current + 1) / total) * 100);
  const currentQ = questions[current];
  const currentAnswer = answers.find((a) => a.question_id === currentQ._id)?.chosen_option_id;

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="w-full flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-[#FAF9FF] mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft width={28} height={28} />
          </TouchableOpacity>
          <Text className="font-[Poppins-Bold] text-xl text-[#7F56D9] ml-3">
            {test_code} Test
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className="text-black text-lg font-[Poppins-Bold]">
            {current + 1}
          </Text>
          <Text className="text-[#ADADAD] text-lg font-[Poppins-Bold]">
            /{total}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2 bg-gray-200 mx-4 mt-3 rounded-full overflow-hidden">
        <View
          style={{ width: `${percent}%` }}
          className="h-2 bg-[#7F56D9] rounded-full"
        />
      </View>

      {/* Body */}
      <ScrollView
        className="flex-1 mt-4 px-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-[Poppins-Bold] text-[#605D67] mb-6">
          {currentQ.question_text}
        </Text>

        {currentQ.options.map((opt: any) => {
          const selected = currentAnswer === opt.option_id;
          return (
            <Pressable
              key={opt.option_id}
              onPress={() => handleSelect(currentQ._id, opt.option_id)}
              className={`flex-row justify-between items-center rounded-xl border px-4 py-3 mb-4 ${
                selected
                  ? "border-[#7F56D9] bg-[#EFE9FB]"
                  : "border-gray-300 bg-white"
              }`}
            >
              <Text
                className={`text-base font-[Poppins-Regular] ${
                  selected ? "text-[#7F56D9]" : "text-gray-800"
                }`}
              >
                {opt.option_text}
              </Text>
              <View
                className={`w-6 h-6 rounded-full border-2 ${
                  selected
                    ? "bg-[#7F56D9] border-[#7F56D9]"
                    : "border-gray-300"
                }`}
              />
            </Pressable>
          );
        })}

        {/* Footer */}
        <View className="flex-row justify-between mt-6">
          <TouchableOpacity
            disabled={current === 0}
            onPress={() => setCurrent((c) => c - 1)}
            className={`h-14 rounded-xl flex-1 mr-2 items-center justify-center ${
              current === 0 ? "bg-gray-300" : "bg-[#E0D7F9]"
            }`}
          >
            <Text
              className={`font-[Poppins-Bold] text-base ${
                current === 0 ? "text-white" : "text-[#7F56D9]"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={nextQuestion}
            className="bg-[#7F56D9] h-14 rounded-xl flex-1 ml-2 items-center justify-center"
          >
            <Text className="text-white font-[Poppins-Bold] text-base">
              {current === total - 1 ? "Finish" : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}