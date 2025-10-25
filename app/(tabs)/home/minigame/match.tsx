"use client";

import Heading from "@/components/Heading";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, Vibration, View } from "react-native";

type MatchItem = {
  id: number;
  word: string;
  meaning: string;
};

const mockData: MatchItem[] = [
    { id: 1, word: "Positive", meaning: "Optimistic" },
    { id: 2, word: "Negative", meaning: "Pessimistic" },
    { id: 3, word: "PHQ", meaning: "Depression scale" },
    { id: 4, word: "GAD", meaning: "Anxiety scale" },
    { id: 5, word: "PSS", meaning: "Stress scale" },
];

export default function MatchWordScreen() {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
        }, [navigation])
    );

    const total = mockData.length;
    const [learnedCount, setLearnedCount] = useState(0);
    const [englishWords, setEnglishWords] = useState<MatchItem[]>([]);
    const [vietnameseWords, setVietnameseWords] = useState<MatchItem[]>([]);
    const [selectedEnglish, setSelectedEnglish] = useState<number | null>(null);
    const [selectedVietnamese, setSelectedVietnamese] = useState<number | null>(null);
    const [wrongEnglish, setWrongEnglish] = useState<number | null>(null);
    const [wrongVietnamese, setWrongVietnamese] = useState<number | null>(null);
    const [showComplete, setShowComplete] = useState(false);
    const [showMatched, setShowMatched] = useState<number[]>([]); // cặp đúng đang hiển thị tạm thời

    useEffect(() => {
        setEnglishWords(mockData);
        setVietnameseWords([...mockData].sort(() => Math.random() - 0.5));
    }, []);

    useEffect(() => {
        if (selectedEnglish !== null && selectedVietnamese !== null) {
        const eng = englishWords.find((w) => w.id === selectedEnglish);
        const viet = vietnameseWords.find((w) => w.id === selectedVietnamese);

        if (eng && viet) {
            if (eng.id === viet.id) {
            setShowMatched((prev) => [...prev, eng.id]);
            setLearnedCount((prev) => prev + 1);

            setTimeout(() => {
                setShowMatched((prev) => prev.filter((id) => id !== eng.id));
                setEnglishWords((prev) => prev.filter((w) => w.id !== eng.id));
                setVietnameseWords((prev) => prev.filter((w) => w.id !== viet.id));
            }, 1500);
            } else {
            Vibration.vibrate(80);
            setWrongEnglish(eng.id);
            setWrongVietnamese(viet.id);
            setTimeout(() => {
                setWrongEnglish(null);
                setWrongVietnamese(null);
            }, 500);
            }
        }

        setTimeout(() => {
            setSelectedEnglish(null);
            setSelectedVietnamese(null);
        }, 400);
        }
    }, [selectedEnglish, selectedVietnamese]);

    useEffect(() => {
        if (learnedCount === total) {
            setTimeout(() => {
                setShowComplete(true);
            }, 400);
        }
    }, [learnedCount]);

    const progress = (learnedCount / total) * 100;
    const toLearn = total - learnedCount;

    return (
        <View className="flex-1 bg-[#FAF9FF] justify-between">
            <Heading title={`${learnedCount}/${total}`} />

            {/* Progress bar */}
            <View className="px-4">
                <View className="w-full h-[4px] bg-gray-200 rounded-full mb-5">
                    <View
                        className="h-full bg-[#7F56D9] rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </View>
            </View>

            {/* Match Area */}
            <View className="flex-row justify-between flex-1 px-4 pb-4">
                {/* Cột trái */}
                <View className="flex-1 mr-2">
                    {englishWords.map((item) => {
                        const selected = selectedEnglish === item.id;
                        const isWrong = wrongEnglish === item.id;
                        const isMatched = showMatched.includes(item.id);

                        if (isMatched) {
                            return <MatchedCard key={item.id} word={item.word} meaning={item.meaning} />;
                        }

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedEnglish(item.id)}
                                disabled={showMatched.includes(item.id)}
                                className={`mb-3 p-3 h-[96px] rounded-[12px] items-center justify-center
                                ${
                                    isWrong
                                    ? "bg-[#FCA5A5]"
                                    : selected
                                    ? "bg-[#7F56D9]"
                                    : "bg-[#E0D7F9]"
                                }`}
                            >
                                <Text
                                    className={`font-[Montserrat-SemiBold] ${
                                        selected || isWrong ? "text-white" : "text-[#111]"
                                    }`}
                                >
                                    {item.word}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Cột phải */}
                <View className="flex-1 ml-2">
                    {vietnameseWords.map((item) => {
                        const selected = selectedVietnamese === item.id;
                        const isWrong = wrongVietnamese === item.id;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => setSelectedVietnamese(item.id)}
                                className={`mb-3 p-3 h-[96px] rounded-[12px] items-center justify-center
                                ${
                                    isWrong
                                    ? "bg-[#FCA5A5]"
                                    : selected
                                    ? "bg-[#7F56D9]"
                                    : "bg-[#E0D7F9]"
                                }`}
                            >
                                <Text
                                    className={`font-[Montserrat-SemiBold] ${
                                        selected || isWrong ? "text-white" : "text-[#111]"
                                    }`}
                                >
                                    {item.meaning}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {showComplete && (
                <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 items-center justify-center z-50">
                    <View className="bg-white rounded-[20px] w-[80%] p-6 items-center shadow-lg">
                        <Text className="text-2xl font-[Montserrat-Bold] text-[#7F56D9] mb-2">
                            🎉 All Words Learned!
                        </Text>
                        <Text className="text-gray-600 font-[Montserrat-Medium] text-center mb-6">
                            You’ve successfully matched all words. Great job!
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                            setShowComplete(false);
                            router.push("/(tabs)/home/minigame");
                            }}
                            className="bg-[#7F56D9] px-6 py-3 rounded-full"
                        >
                            <Text className="text-white font-[Montserrat-Bold] text-lg">Back to Learn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
        </View>
    );
}

// Hiệu ứng fade-out khi match đúng
function MatchedCard({ word, meaning }: { word: string; meaning: string }) {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="mb-3 p-3 h-[96px] rounded-[12px] bg-[#D5FFD9] items-center justify-center"
        >
            <Text className="text-[#00966D] font-[Montserrat-Bold] text-base">{word}</Text>
            <Text className="text-[#373346] font-[Montserrat-Medium]">{meaning}</Text>
        </Animated.View>
    );
}