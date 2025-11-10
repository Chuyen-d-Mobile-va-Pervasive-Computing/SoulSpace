"use client";

import Heading from "@/components/Heading";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Animated, Text, TouchableOpacity, Vibration, View, ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MatchItem = {
    id: string;
    word: string;
    meaning: string;
};

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function MatchWordScreen() {
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
            return () => navigation.getParent()?.setOptions({ tabBarStyle: undefined });
        }, [navigation])
    );

    const [pairs, setPairs] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [englishWords, setEnglishWords] = useState<MatchItem[]>([]);
    const [vietnameseWords, setVietnameseWords] = useState<MatchItem[]>([]);
    const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
    const [selectedVietnamese, setSelectedVietnamese] = useState<string | null>(null);
    const [wrongEnglish, setWrongEnglish] = useState<string | null>(null);
    const [wrongVietnamese, setWrongVietnamese] = useState<string | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<MatchItem[]>([]);
    const [showComplete, setShowComplete] = useState(false);

    useEffect(() => {
        const fetchPairs = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                const res = await fetch(`${API_BASE}/api/v1/game/match/pairs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                if (!res.ok) {
                    ToastAndroid.show(data?.detail || data?.error || "Failed to load pairs", ToastAndroid.LONG);
                    return;
                }

                setPairs(data);
                setEnglishWords(data);
                setVietnameseWords([...data].sort(() => Math.random() - 0.5));
            } catch (err: any) {
                ToastAndroid.show(err.message || "Network error", ToastAndroid.LONG);
            } finally {
                setLoading(false);
            }
        };
        fetchPairs();
    }, []);

    const total = pairs.length;
    const learnedCount = matchedPairs.length;
    const progress = (learnedCount / total) * 100;

    useEffect(() => {
        if (!selectedEnglish || !selectedVietnamese) return;

        const eng = englishWords.find(w => w.id === selectedEnglish);
        const viet = vietnameseWords.find(w => w.id === selectedVietnamese);
        if (!eng || !viet) return;

        if (eng.id === viet.id) {
            setMatchedPairs(prev => [...prev, eng]);
            setTimeout(() => {
                setEnglishWords(prev => prev.filter(w => w.id !== eng.id));
                setVietnameseWords(prev => prev.filter(w => w.id !== viet.id));
            }, 500);
        } else {
            Vibration.vibrate(80);
            setWrongEnglish(eng.id);
            setWrongVietnamese(viet.id);
            setTimeout(() => {
                setWrongEnglish(null);
                setWrongVietnamese(null);
            }, 500);
        }

        setTimeout(() => {
        setSelectedEnglish(null);
        setSelectedVietnamese(null);
        }, 400);
    }, [selectedEnglish, selectedVietnamese]);

    useEffect(() => {
        if (learnedCount === total && total > 0) setShowComplete(true);
    }, [learnedCount, total]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#FAF9FF] items-center justify-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    if (total === 0) {
        return (
            <View className="flex-1 bg-[#FAF9FF] items-center justify-center">
                <Text>No words available.</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#FAF9FF] justify-between">
            <Heading title={`${learnedCount}/${total}`} />

            {/* Progress */}
            <View className="px-4">
                <View className="w-full h-[4px] bg-gray-200 rounded-full mb-5">
                <View className="h-full bg-[#7F56D9] rounded-full" style={{ width: `${progress}%` }} />
                </View>
            </View>

            {/* Match Area */}
            <View className="flex-row justify-between flex-1 px-4 pb-4">
                {/* English Column */}
                <View className="flex-1 mr-2">
                    {englishWords.map(item => {
                        const selected = selectedEnglish === item.id;
                        const wrong = wrongEnglish === item.id;
                        const matched = matchedPairs.find(w => w.id === item.id);

                        if (matched) return <MatchedCard key={`eng-${item.id}`} word={item.word} meaning={item.meaning} />;

                        return (
                            <TouchableOpacity
                                key={`eng-${item.id}`}
                                onPress={() => setSelectedEnglish(item.id)}
                                disabled={!!matched}
                                className={`mb-3 p-3 h-[96px] rounded-[12px] items-center justify-center ${
                                wrong ? "bg-[#FCA5A5]" : selected ? "bg-[#7F56D9]" : "bg-[#E0D7F9]"
                                }`}
                            >
                                <Text className={`font-[Poppins-Medium] ${selected || wrong ? "text-white" : "text-[#111]"}`}>
                                    {item.word}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Vietnamese Column */}
                <View className="flex-1 ml-2">
                    {vietnameseWords.map(item => {
                        const selected = selectedVietnamese === item.id;
                        const wrong = wrongVietnamese === item.id;
                        const matched = matchedPairs.find(w => w.id === item.id);

                        if (matched) return <MatchedCard key={`viet-${item.id}`} word={matched.word} meaning={matched.meaning} />;

                        return (
                            <TouchableOpacity
                                key={`viet-${item.id}`}
                                onPress={() => setSelectedVietnamese(item.id)}
                                className={`mb-3 p-3 h-[96px] rounded-[12px] items-center justify-center ${
                                wrong ? "bg-[#FCA5A5]" : selected ? "bg-[#7F56D9]" : "bg-[#E0D7F9]"
                                }`}
                            >
                                <Text className={`font-[Poppins-Medium] ${selected || wrong ? "text-white" : "text-[#111]"}`}>
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
                        <Text className="text-2xl font-[Poppins-Bold] text-[#7F56D9] mb-2">🎉 All Words Learned!</Text>
                        <Text className="text-gray-600 font-[Poppins-Medium] text-center mb-6">
                            You’ve successfully matched all words. Great job!
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push("/(tabs)/home/minigame")}
                            className="bg-[#7F56D9] px-6 py-3 rounded-full"
                        >
                            <Text className="text-white font-[Poppins-Bold] text-lg">Back to Learn</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

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
            <Text className="text-[#00966D] font-[Poppins-Bold] text-base">{word}</Text>
            <Text className="text-[#373346] font-[Poppins-Medium]">{meaning}</Text>
        </Animated.View>
    );
}