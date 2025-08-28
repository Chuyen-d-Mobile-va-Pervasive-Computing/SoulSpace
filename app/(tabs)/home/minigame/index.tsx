import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Gift, HandHeart, Heart, Radar, Rainbow, Sun, SunMoon } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";

export default function MinigameScreen() {
    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Minigame" showBack={true} onBackPress={() => router.back()} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 pt-2"
            >
                <View className="w-full p-2 overflow-hidden">
                    <View className="flex-1 rounded-lg bg-white/30 border border-white p-2 justify-center items-center overflow-hidden">
                        <View className="py-2 gap-2 items-center w-full">
                            <View className="rounded-full bg-[#ECE852]/30 border border-[#ECE852] p-2">
                                <Gift width={36} height={36} className="rounded-full overflow-hidden" color="#ECE852" />
                            </View>
                            <Text className="text-lg font-bold text-white text-center">
                                Build your mental habits
                            </Text>
                            <Text className="text-sm text-gray-300 text-center">
                                Overcome challenges to earn badges and improve your mental health
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Minigame 1 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/write")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-white bg-white/30 rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] p-2">
                                            <Heart width={24} height={24} color="white" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-white text-[14px] font-bold">Inner Explorer</Text>
                                            <Text className="text-[#ccc] text-[13px]">
                                                Write your feelings daily for a week
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="justify-center items-center ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#6F04D9]/30 border-2 border-[#6F04D9] rounded-lg px-3">
                                            <Text className="text-white font-extrabold text-sm">+30 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={6/7}
                                        width={200}
                                        color="#6f04d9"
                                        borderRadius={10}
                                    />
                                    <Text className="text-white text-[13px] font-bold ml-3">
                                        6/7 days
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Minigame 2 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/share")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-white bg-white/30 rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#E6A117]/30 border border-[#E6A117] p-2">
                                            <Sun width={24} height={24} color="#E6A117" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-white text-[14px] font-bold">Spreading Smile</Text>
                                            <Text className="text-[#ccc] text-[13px]">
                                                Share three posts on the forum for a month
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="justify-center items-center ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#E6A117]/30 border-2 border-[#E6A117] rounded-lg px-3">
                                            <Text className="text-white font-extrabold text-sm">+50 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={1/3}
                                        width={200}
                                        color="#E6A117"
                                        borderRadius={10}
                                    />
                                    <Text className="text-white text-[13px] font-bold ml-3">
                                        1/3 posts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Minigame 3 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/(tabs)/home/minigame/comment")}
                >
                    <View className="w-full p-2 overflow-hidden">
                        <View className="flex-1">
                            <View className="w-full border border-white bg-white/30 rounded-lg px-3 py-5 gap-2">
                                {/* Name Row */}
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row items-center gap-2 flex-1">
                                        <View className="rounded-full bg-[#ECE852]/30 border border-[#ECE852] p-2">
                                            <Rainbow width={24} height={24} color="#ECE852" />
                                        </View>
                                        <View className="h-full gap-1 flex-1">
                                            <Text className="text-white text-[14px] font-bold">Light Bearer</Text>
                                            <Text className="text-[#ccc] text-[13px]">
                                                Leave positive messages on five different posts
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="justify-center items-center ml-2">
                                        <View className="flex-row items-center justify-center h-8 bg-[#ECE852]/30 border-2 border-[#ECE852] rounded-lg px-3">
                                            <Text className="text-white font-extrabold text-sm">+50 pts</Text>
                                        </View>
                                    </View>
                                </View>
                                {/* Progress Row */}
                                <View className="flex-row items-center justify-between px-8">
                                    <Progress.Bar
                                        progress={0/5}
                                        width={200}
                                        color="#ECE852"
                                        borderRadius={10}
                                    />
                                    <Text className="text-white text-[13px] font-bold ml-3">
                                        0/5 posts
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Badges */}
                <View className="mt-6">
                    <View className="flex-col gap-6">
                        <Text className="text-white font-bold text-[15px]">My Badges</Text>
                        <View className="flex-row px-6 gap-4">
                            {/* Badge 1 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#6F04D9]/30 border border-[#6F04D9] p-2">
                                    <Radar width={36} height={36} className="rounded-full overflow-hidden" color="white" />
                                </View>
                                <Text className="text-white text-[13px] text-base font-bold">PathFinder</Text>
                            </View>
                            {/* Badge 2 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <HandHeart width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-[13px] text-base font-bold">SilentHealer</Text>
                            </View>
                            {/* Badge 3 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <SunMoon width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-[13px] text-base font-bold">LightBearer</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}