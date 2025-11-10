import Minigame from "@/assets/images/minigame.svg";
import MiniGameCard from "@/components/MiniGameCard";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";
import * as Icons from "lucide-react-native";
import { Vote, Grid2X2Check, LineSquiggle, ArrowLeft } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";

type BadgeIcon = {
    badge_id: string;
    name: string;
    icon: string;
}

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

function BadgeIcon({ name, locked }: { name: string; locked?: boolean }) {
    const IconComponent = (Icons as any)[name] || Icons.Award;
    return (
        <IconComponent width={36} height={36} color={locked ? "#9C9C9C" : "#3A6FE6"} />
    );
}

export default function MinigameScreen() {
    const [badges, setBadges] = useState<{earned: any[], locked: any[]} | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBadges = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            if (!token) throw new Error("No access token found");
            const payload: any = jwtDecode(token);
            const userId = payload.sub;
            await AsyncStorage.setItem("user_id", userId);
            const res = await fetch(`${API_BASE}/api/v1/badges/user/${userId}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if(res.ok){
                setBadges({ earned: data.earned_badges, locked: data.locked_badges });
            } else {
                console.warn("Failed to fetch badges", data);
            }
            } catch(err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBadges();
    }, []);

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
                        <ArrowLeft width={36} height={36} />
                    </TouchableOpacity>
                    <Text
                        className="ml-3 text-2xl text-[#7F56D9]"
                        style={{ fontFamily: "Poppins-Bold" }}
                    >
                        Minigame
                    </Text>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 pt-2"
            >
                <View className="w-full p-2 overflow-hidden">
                    <View className="flex-1 rounded-2xl bg-[#FFFFFF] border border-[#EEEEEE] p-2 justify-center items-center overflow-hidden">
                        <View className="py-2 gap-2 items-center w-full">
                            <Minigame width={100} height={100} />
                            <Text className="text-lg font-[Poppins-Bold] text-center">
                                Build your mental habits
                            </Text>
                            <Text className="text-base font-[Poppins-Regular] text-center">
                                Overcome challenges to earn badges and improve your mental health
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Minigame 1 */}
                <MiniGameCard
                    title="Word Pick"
                    subtitle="Choose the correct word"
                    points={100}
                    icon={<Vote width={24} height={24} color="#fff" />}
                    gradient={["#6FA9FF", "#3A6FE6"]}
                    onPress={() => router.push("/(tabs)/home/minigame/choose")}
                />

                {/* Minigame 2 */}
                <MiniGameCard
                    title="Mind Match"
                    subtitle="Match related words"
                    points={200}
                    icon={<LineSquiggle width={24} height={24} color="#fff" />}
                    gradient={['#4CAADD', '#2B8FCC']}
                    onPress={() => router.push("/(tabs)/home/minigame/match")}
                />

                {/* Minigame 3 */}
                <MiniGameCard
                    title="Puzzle Grid"
                    subtitle="Complete the crossword"
                    points={500}
                    icon={<Grid2X2Check width={24} height={24} color="#fff" />}
                    gradient={['#1EC7B0', '#34D1BF']}
                    onPress={() => router.push("/(tabs)/home/minigame/crossword")}
                />

                {/* Badges */}
                <View className="mt-6">
                    <Text className="font-[Poppins-Bold] text-lg mb-2">My Badges</Text>
                    {loading ? (
                        <Text>Loading...</Text>
                    ) : (
                        <View className="flex-row flex-wrap justify-between px-2">                      
                        {/* Earned */}
                        {badges?.earned.map((b, index) => (
                            <View
                                key={`${b.id}-${index}`}
                                className="w-[30%] my-3 items-center"
                            >
                                <LinearGradient
                                    colors={["#D5E4FF", "#A0C4FF"]}
                                    style={{ borderRadius: 999, padding: 10 }}
                                >
                                    <BadgeIcon name={b.icon} locked={false}/>
                                </LinearGradient>
                                <Text className="text-[#3A6FE6] font-[Poppins-SemiBold] text-sm text-center mt-2">
                                    {b.name}
                                </Text>
                            </View>
                        ))}

                        {/* Locked */}
                        {badges?.locked.map((b, index) => (
                            <View
                                key={`${b.id}-locked-${index}`}
                                className="w-[30%] my-3 items-center opacity-50"
                            >
                                <LinearGradient
                                    colors={["#F2F2F2", "#E0E0E0"]}
                                    style={{ borderRadius: 999, padding: 10 }}
                                >
                                    <BadgeIcon name={b.icon} locked={true}/>
                                </LinearGradient>
                                <Text className="text-[#9C9C9C] font-[Poppins-Medium] text-sm text-center mt-2">
                                    {b.name}
                                </Text>
                            </View>
                        ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}