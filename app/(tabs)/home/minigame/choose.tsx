"use client";

import Heading from "@/components/Heading";
import { useFocusEffect, useLocalSearchParams, useNavigation } from "expo-router";
import { CheckCheck, Frown, Laugh } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Question = {
    id: number;
    question: string;
    correctAnswer: string;
    options: string[];
    meaning: string;
};

const mockQuestions: Question[] = [
    {
        id: 1,
        question: "What is PHQ?",
        correctAnswer: "Depression scale",
        options: ["Depression scale", "Anxiety scale", "Stress scale", "Happiness scale"],
        meaning: "PHQ (Patient Health Questionnaire): A questionnaire used to screen for depression."
    },
    {
        id: 2,
        question: "What is GAD?",
        correctAnswer: "Anxiety scale",
        options: ["Anxiety scale", "Depression scale", "Stress scale", "Behavior scale"],
        meaning: "GAD (Generalized Anxiety Disorder): A questionnaire used to assess anxiety levels."
    },
    {
        id: 3,
        question: "What is PSS?",
        correctAnswer: "Stress scale",
        options: ["Stress scale", "Anxiety scale", "Depression scale", "Happiness scale"],
        meaning: "PSS (Perceived Stress Scale): A scale measuring perceived stress levels."
    }
];

export default function QuizFlashcardScreen() {
    const total = mockQuestions.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [checked, setChecked] = useState(false);
    const [learnedCount, setLearnedCount] = useState(0);
    const currentQuestion = mockQuestions[currentIndex];
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const { reset } = useLocalSearchParams();

    useEffect(() => {
        if (reset === "true") {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setChecked(false);
        setLearnedCount(0);
        setCorrectCount(0);
        setWrongCount(0);
        }
    }, [reset]);

    const handleCheck = () => {
        if (selectedAnswer === null) return;
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
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
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect,
            },
        ]);
    };

    const handleNext = () => {
        setLearnedCount((prev) => prev + 1);
        if (currentIndex < total - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setChecked(false);
        } else {
            setTimeout(() => {
                // router.push({
                //   pathname: "/(tabs)/learn/collection/learn/result",
                //   params: {
                //     results: JSON.stringify(results),
                //     correct: correctCount,
                //     wrong: wrongCount,
                //     total,
                //   },
                // });
            }, 400);
        }
    };

    const toLearn = total - learnedCount;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const isWrong = selectedAnswer && selectedAnswer !== currentQuestion.correctAnswer;

    const navigation = useNavigation();
    useFocusEffect(
        useCallback(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
        return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
        }, [navigation])
    );

  return (
    <View className="flex-1 bg-[#F6F6F6]">
        {/* Header */}
        <Heading title={`${currentIndex + 1}/${total}`} />

        {/* Progress bar */}
        <View className="px-4">
            <View className="w-full h-[4px] bg-gray-200 rounded-full mb-5">
            <View
                className="h-full bg-[#7F56D9] rounded-full"
                style={{ width: `${((learnedCount) / total) * 100}%` }}
            />
            </View>
        </View>

        {/* Word Section */}
        <View className="bg-white ml-4 mr-4 p-4 rounded-[16px]">
            <View className="flex items-center mb-6">
                <Text className="text-2xl font-[Montserrat-Bold] text-[#111] mb-1">
                    {currentQuestion.question}
                </Text>
            </View>

            {/* Options */}
            <View className="flex-row flex-wrap justify-between mb-4">
            {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;

                let bgColor = "#E0D7F9";
                if (checked && option === currentQuestion.correctAnswer) bgColor = "#D5FFD9";
                else if (checked && isSelected && option !== currentQuestion.correctAnswer)
                bgColor = "#FEE2E2";
                else if (isSelected) bgColor = "#7F56D9";

                let textColor =
                isSelected && !checked ? "#fff" : checked && option === currentQuestion.correctAnswer
                    ? "#48A05D"
                    : "#111";

                return (
                <TouchableOpacity
                    key={idx}
                    disabled={checked}
                    onPress={() => setSelectedAnswer(option)}
                    className="w-[48%] h-[96px] items-center justify-center rounded-[16px] p-3 mb-3"
                    style={{ backgroundColor: bgColor }}
                >
                    <Text
                    className="text-center font-[Montserrat-SemiBold]"
                    style={{ color: textColor }}
                    >
                    {option}
                    </Text>
                </TouchableOpacity>
                );
            })}
            </View>
        </View>

        {/* Feedback box */}
        {checked && (
            <View
            className={`rounded-xl px-8 py-3 mt-4 mr-4 ml-4 ${
                isCorrect ? "bg-[#D5FFD9]" : "bg-[#FEE2E2]"
            }`}
            >
            <View className="items-center justify-center flex-row gap-3">
            {isCorrect ? <Laugh color="#55BA5D"/> : <Frown color="#FF4040"/> }
            <View>
                <Text
                className={`font-[Montserrat-Bold] mb-1 ${
                    isCorrect ? "text-[#48A05D]" : "text-[#FF4040]"
                }`}
                >
                {isCorrect ? "Great!" : "Oh no :("}
                </Text>
                <Text className={`font-[Montserrat-Regular] ${isCorrect ? "text-[#2B8143]" : "text-[#813232]"}`}>
                {currentQuestion.meaning}
                </Text>
            </View>
            </View>
            </View>
        )}

        {/* Button */}
        <View className="bg-white mt-auto mb-20 items-center justify-center p-4">
            <TouchableOpacity
            onPress={checked ? handleNext : handleCheck}
            disabled={!selectedAnswer}
            className={`w-[160px] h-12 rounded-full flex-row gap-2 items-center justify-center ${
                !selectedAnswer
                ? "bg-gray-300"
                : checked
                ? "bg-[#7F56D9]"
                : "bg-[#7F56D9]"
            }`}
            >
            <CheckCheck  color="white"/>
            <Text className="text-white font-[Montserrat-Bold] text-base">
                {checked ? "Next" : "Check"}
            </Text>
            </TouchableOpacity>
        </View>
    </View>
  );
}