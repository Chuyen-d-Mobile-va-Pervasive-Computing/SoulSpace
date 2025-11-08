import Minigame from "@/assets/images/minigame.svg";
import MiniGameCard from "@/components/MiniGameCard";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Trophy, Vote, Lightbulb, Grid2X2Check, LineSquiggle, GraduationCap } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View} from "react-native";

export default function MinigameScreen() {
    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Minigame" />
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
                    <View className="flex-col gap-6">
                        <Text className="font-[Poppins-Bold] text-lg">My Badges</Text>
                        <View className="flex-row px-10 justify-between">
                            {/* Badge 1 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#3A6FE6]/30 border border-[#3A6FE6] p-2">
                                    <Lightbulb width={36} height={36} className="rounded-full overflow-hidden" color="#3A6FE6" />
                                </View>
                                <Text className="text-base text-[#3A6FE6] font-[Poppins-SemiBold]">Explorer</Text>
                            </View>
                            {/* Badge 2 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <Trophy width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-base text-base font-[Poppins-SemiBold]">Champion</Text>
                            </View>
                            {/* Badge 3 */}
                            <View className="flex-col items-center gap-2">
                                <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                                    <GraduationCap width={36} height={36} className="rounded-full overflow-hidden" color="#CCCCCC" />
                                </View>
                                <Text className="text-[#CCCCCC] text-base text-base font-[Poppins-SemiBold]">Master</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}