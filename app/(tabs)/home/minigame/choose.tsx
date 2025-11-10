"use client";

import Heading from "@/components/Heading";
import { useFocusEffect, useLocalSearchParams, useNavigation, router } from "expo-router";
import { CheckCheck, Frown, Laugh } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Question = {
    id: string | number;
    question: string;
    correct_answer?: string;
    correctAnswer?: string;
    options: string[];
    meaning?: string;
};

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function QuizFlashcardScreen() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [learnedCount, setLearnedCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [isNavigating, setIsNavigating] = useState(false);
    const total = questions.length;
    const { reset } = useLocalSearchParams();
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
        }, [navigation])
    );

    useEffect(() => {
        let mounted = true;
        const fetchQuestions = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                const res = await fetch(`${API_BASE}/api/v1/game/choose/questions`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const data = await res.json();

                if (!res.ok) {
                    ToastAndroid.show(
                        data?.detail || data?.error || "Failed to load questions",
                        ToastAndroid.LONG
                    );
                    if (mounted) {
                        setQuestions([]);
                    }
                    return;
                }

                if (mounted) {
                    const normalized = (data || []).map((q: any) => ({
                        id: q.id ?? q._id,
                        question: q.question,
                        correctAnswer: q.correct_answer ?? q.correctAnswer,
                        options: q.options ?? [],
                        meaning: q.meaning ?? q.explanation ?? "",
                    }));
                    setQuestions(normalized);
                }
            } catch (err: any) {
                ToastAndroid.show(err.message || "Network error", ToastAndroid.LONG);
                if (mounted) setQuestions([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchQuestions();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (reset === "true") {
            setCurrentIndex(0);
            setSelectedAnswer(null);
            setChecked(false);
            setLearnedCount(0);
            setCorrectCount(0);
            setWrongCount(0);
            setResults([]);
            setIsNavigating(false);
        }
    }, [reset]);

    const currentQuestion = questions?.[currentIndex] ?? null;

    if (loading) {
        return (
            <View className="flex-1 bg-[#FAF9FF] items-center justify-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!loading && questions.length === 0) {
        return (
            <View className="flex-1 bg-[#FAF9FF] items-center justify-center">
                <Text>No questions available.</Text>
            </View>
        );
    }

    if (!currentQuestion) {
        return (
        <View className="flex-1 bg-[#FAF9FF] items-center justify-center">
            <Text>Loading question...</Text>
        </View>
        );
    }

    const handleCheck = () => {
        if (selectedAnswer === null) return;

        const correctAns = (currentQuestion.correctAnswer ?? currentQuestion.correct_answer) as string;
        const isCorrect = selectedAnswer === correctAns;
        setChecked(true);

        if (isCorrect) {
            setCorrectCount((prev) => prev + 1);
        } else {
            setWrongCount((prev) => prev + 1);
        }

        setResults((prev) => [
            ...prev,
            {
                id: currentQuestion.id,
                word: currentQuestion.question,
                meaning: currentQuestion.meaning,
                selectedAnswer,
                correctAnswer: correctAns,
                isCorrect,
            },
        ]);
    };

    const handleNext = async () => {
        if (isNavigating) return;
        setLearnedCount((prev) => prev + 1);

        if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setChecked(false);
        } else {
            setIsNavigating(true);
            await handleFinish();
        }
    };

    const handleFinish = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");

            const res = await fetch(`${API_BASE}/api/v1/game/complete`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                game_type: "choose",
                score: correctCount * 10, // mỗi câu đúng 10 điểm
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                ToastAndroid.show(
                    data?.detail || data?.error || "Submit score failed",
                    ToastAndroid.LONG
                );
                setIsNavigating(false);
                return;
            }

            ToastAndroid.show(`+${data.earned_points} điểm!`, ToastAndroid.LONG);

            router.push({
                pathname: "/(tabs)/home/minigame/result",
                params: {
                results: JSON.stringify(results),
                correct: correctCount,
                wrong: wrongCount,
                total,
                earned_points: data.earned_points,
                new_badges: JSON.stringify(data.new_badges || []),
                },
            });
        } catch (err: any) {
            ToastAndroid.show(err.message || "Network error", ToastAndroid.LONG);
            setIsNavigating(false);
        }
    };

    const isCorrect = selectedAnswer === (currentQuestion.correctAnswer ?? currentQuestion.correct_answer);
    const isWrong = selectedAnswer && !isCorrect;

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title={`${currentIndex + 1}/${total}`} />

            {/* Progress bar */}
            <View className="px-4">
                <View className="w-full h-[4px] bg-gray-200 rounded-full mb-5">
                <View
                    className="h-full bg-[#7F56D9] rounded-full"
                    style={{ width: `${(learnedCount / total) * 100}%` }}
                />
                </View>
            </View>

            {/* Word Section */}
            <View className="bg-white ml-4 mr-4 p-4 rounded-[16px]">
                <View className="flex items-center mb-6">
                    <Text className="text-2xl font-[Poppins-Bold] text-[#111] mb-1">
                        {currentQuestion.question}
                    </Text>
                </View>

                {/* Options */}
                <View className="flex-row flex-wrap justify-between mb-4">
                    {(currentQuestion.options || []).map((option, idx) => {
                        const selected = selectedAnswer === option;

                        let bgColor = "#E0D7F9";
                        if (checked && option === (currentQuestion.correctAnswer ?? currentQuestion.correct_answer)) bgColor = "#D5FFD9";
                        else if (checked && selected && option !== (currentQuestion.correctAnswer ?? currentQuestion.correct_answer))
                        bgColor = "#FEE2E2";
                        else if (selected) bgColor = "#7F56D9";

                        let textColor = selected && !checked ? "#fff" : checked && option === (currentQuestion.correctAnswer ?? currentQuestion.correct_answer) ? "#48A05D" : "#111";

                        return (
                            <TouchableOpacity
                                key={idx}
                                disabled={checked}
                                onPress={() => setSelectedAnswer(option)}
                                className="w-[48%] h-[96px] items-center justify-center rounded-[16px] p-3 mb-3"
                                style={{ backgroundColor: bgColor }}
                            >
                                <Text className="text-center" style={{ color: textColor }}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Feedback box */}
            {checked && (
                <View className={`rounded-xl px-8 py-3 mt-4 mr-4 ml-4 ${isCorrect ? "bg-[#D5FFD9]" : "bg-[#FEE2E2]"}`}>
                    <View className="items-center justify-center flex-row gap-3">
                        {isCorrect ? <Laugh color="#55BA5D" /> : <Frown color="#FF4040" />}
                        <View>
                            <Text className={`font-[Poppins-Bold] mb-1 ${isCorrect ? "text-[#48A05D]" : "text-[#FF4040]"}`}>
                                {isCorrect ? "Great!" : "Oh no :("}
                            </Text>
                            <Text className={`font-[Poppins-Regular] ${isCorrect ? "text-[#2B8143]" : "text-[#813232]"}`}>
                                {currentQuestion.meaning}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            <View className="bg-white mt-auto mb-20 items-center justify-center p-4">
                <TouchableOpacity
                    onPress={checked ? handleNext : handleCheck}
                    disabled={!selectedAnswer || isNavigating}
                    className={`w-[160px] h-12 rounded-full flex-row gap-2 items-center justify-center ${!selectedAnswer || isNavigating ? "bg-gray-300" : "bg-[#7F56D9]"}`}
                >
                    <CheckCheck color="white" />
                    <Text className="text-white font-[Poppins-Bold] text-base">
                        {checked ? (isNavigating ? "Loading..." : "Next") : "Check"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}