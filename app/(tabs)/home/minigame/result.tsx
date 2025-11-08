"use client";

import { useLocalSearchParams, useRouter } from "expo-router";
import { RotateCw, X } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ResultScreen() {
  const { correct, wrong, total, results } = useLocalSearchParams();
  const router = useRouter();
  const resultList = results ? JSON.parse(results as string) : [];

  const correctNum = Number(correct || 0);
  const wrongNum = Number(wrong || 0);
  const totalNum = Number(total || correctNum + wrongNum);
  const percent = Math.round((correctNum / totalNum) * 100);
  const score = Math.round((10 / totalNum) * correctNum);
  const isGood = percent >= 70;
  const [activeTab, setActiveTab] = useState<"total" | "correct" | "wrong">("total");

  const filteredList =
    activeTab === "correct"
      ? resultList.filter((i: any) => i.isCorrect)
      : activeTab === "wrong"
      ? resultList.filter((i: any) => !i.isCorrect)
      : resultList;

  return (
    <View className="flex-1 bg-[#F6F6F6]">
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8 mb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home/minigame")}>
            <X width={28} height={28} color="#000000" />
          </TouchableOpacity>
          <Text
            className="ml-3 text-2xl text-[#7F56D9]"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Results
          </Text>
        </View>
      </View>
      <ScrollView>
        {/* Header */}
        <View className="flex shadow-lg mx-6 mb-6 gap-2 p-6 items-center justify-center bg-[#E9EFFD] rounded-[20px]">
          <Text className=" text-lg text-[#2563EB] font-[Poppins-ExtraBold]">Score</Text>
          <Text className="text-2xl text-[#EBAD25] font-[Poppins-ExtraBold]">{score} points</Text>
          <Text className="text-xl font-[Poppins-Bold]">Congratulations!</Text>
          <Text className="text-xl font-[Poppins-Bold] text-[#111] mb-2">
            {isGood ? "You do the best! 🎉" : "You can do better next time!"}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap justify-between px-6 shadow-lg">
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-3xl font-[Poppins-ExtraBold] text-[#2563EB]">{totalNum}</Text>
            <Text className="text-[#616161] font-[Poppins-Bold]">Total Questions</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#EBAD25] text-3xl font-[Poppins-ExtraBold]">{percent}%</Text>
            <Text className="text-[#616161] font-[Poppins-Bold]">Accuracy</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#00966D] text-3xl font-[Poppins-ExtraBold]">{correctNum}</Text>
            <Text className="text-[#616161] font-[Poppins-Bold]">Correct Answers</Text>
          </View>
          <View className="w-[48%] bg-white rounded-[16px] px-4 py-6 mb-4 gap-2">
            <Text className="text-[#C30000] text-3xl font-[Poppins-ExtraBold]">{wrongNum}</Text>
            <Text className="text-[#616161] font-[Poppins-Bold]">Wrong Answers</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row justify-around mt-6 mb-4 px-6">
          {[
            { key: "total", label: `Total (${totalNum})` },
            { key: "correct", label: `Correct (${correctNum})` },
            { key: "wrong", label: `Wrong (${wrongNum})` },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-full ${
                  isActive ? "bg-[#2563EB]" : "bg-white"
                }`}
              >
                <Text
                  className={`font-[Poppins-SemiBold] ${
                    isActive ? "text-white" : "text-[#111]"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Result list */}
        <View className="px-6 mb-8">
          {filteredList.length === 0 ? (
            <Text className="text-center text-gray-500 font-[Poppins-Medium]">
              No results in this tab.
            </Text>
          ) : (
            filteredList.map((item: any) => (
              <View
                key={item.id}
                className="bg-white rounded-[16px] p-5 mb-4 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-lg font-[Poppins-Bold]">{item.word}</Text>
                  </View>
                  <Text
                    className={`font-[Poppins-Bold] ${
                      item.isCorrect ? "text-[#16A34A]" : "text-[#EF4444]"
                    }`}
                  >
                    {item.isCorrect ? "✅" : "❌"}
                  </Text>
                </View>

                {/* Meaning */}
                <Text className="font-[Poppins-Medium] mt-2 text-base">{item.meaning}</Text>

                {!item.isCorrect && (
                  <View className="mt-3">
                    <Text className="text-[#C30000] font-[Poppins-Medium]">
                      ❌ Your answer: {item.selectedAnswer}
                    </Text>
                    <Text className="text-[#00966D] font-[Poppins-Medium]">
                      ✅ Correct answer: {item.correctAnswer}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Buttons */}
        <View className="w-full items-center mb-6">
          <TouchableOpacity
            onPress={() =>
              router.replace({
                pathname: "/(tabs)/home/minigame/choose",
                params: { reset: "true" },
              })
            }
            className="bg-[#2563EB] w-[200px] py-3 rounded-full mb-4 items-center justify-center flex-row gap-2"
          >
            <RotateCw size="20" color="white"/>
            <Text className="text-white text-center font-[Poppins-Bold]">
              Retry Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}