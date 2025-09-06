import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Question = {
  question: string;
  options: string[];
};

type QuestionCardProps = {
  index: number;
  question: string;
  options: string[];
  value: number | null;           // đáp án đã chọn cho câu hỏi này
  onSelect: (val: number) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  index,
  question,
  options,
  value,
  onSelect,
}) => {
  return (
    <View className="rounded-lg overflow-hidden bg-white/20 mb-5">
      {/* Header */}
      <View className="p-3 bg-white/30">
        <Text className="text-[#ccc] text-sm font-medium text-center">
          Câu hỏi {index + 1}/7
        </Text>
        <Text className="text-white text-base font-medium text-center">
          {question}
        </Text>
      </View>

      {/* Options */}
      {options.map((item, i) => (
        <Pressable
          key={i}
          onPress={() => onSelect(i)}
          className="flex-row justify-between items-center h-12 px-3 border-t border-white/20"
        >
          <Text className="text-white text-base font-medium">{item}</Text>
          <View
            className={`w-6 h-6 rounded-full border-2 ${
              value === i ? "border-[#6f04d9] bg-[#6f04d9]" : "border-white"
            }`}
          />
        </Pressable>
      ))}
    </View>
  );
};

export default function TestDoingScreen() {
  const questions: Question[] = [
    {
      question:
        "Bạn thường cảm thấy tràn đầy năng lượng khi tham gia các hoạt động cùng nhiều người?",
      options: ["Có", "Không", "Đôi khi", "Chưa chắc"],
    },
    {
      question:
        "Bạn ưu tiên dữ liệu thực tế hơn là trực giác khi ra quyết định?",
      options: ["Có", "Không", "Đôi khi", "Chưa chắc"],
    },
  ];

  // mỗi câu hỏi có 1 ô trong mảng answers (null nếu chưa chọn)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const handleSelect = (qIndex: number, val: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = val;
      return next;
    });
  };

  const allAnswered = answers.every((a) => a !== null);

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Header */}
      <Heading title="" showBack onBackPress={() => router.back()} />

      {/* Body */}
      <ScrollView
        className="flex-1 mt-4 px-3 py-8"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Mô tả */}
        <Text className="text-white text-base font-medium text-center mb-5">
          Bài trắc nghiệm MBTI giúp xác định kiểu tính cách dựa trên 4 nhóm đặc
          điểm, từ đó hiểu cách bạn suy nghĩ, cảm nhận và tương tác với thế
          giới.
        </Text>

        {/* Danh sách câu hỏi */}
        {questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            index={idx}
            question={q.question}
            options={q.options}
            value={answers[idx]}
            onSelect={(val) => handleSelect(idx, val)}
          />
        ))}

        {/* Footer Buttons */}
        <View className="pb-6">
          <Pressable
            disabled={!allAnswered}
            className={`${!allAnswered? "opacity-40": ""}`}
            onPress={() => router.push("/(tabs)/explore/test/done")}
          >
            <LinearGradient
              colors={["#8736D9", "#5204BF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-3 items-center w-full rounded-2xl overflow-hidden"
            >
              <Text className="text-white font-bold text-base">Complete</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}