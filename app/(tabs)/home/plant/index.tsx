import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Sprout } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";

export default function PlantScreen() {
    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Plant" showBack={true} onBackPress={() => router.back()} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4"
            >
                <View className="py-3 px-1 gap-8 items-center">
                    {/* Tree */}
                    <TouchableOpacity 
                        onPress={() => router.push("/(tabs)/home/plant/list")}
                        className="rounded-full bg-[#5CB338]/30 border border-[#5CB338] p-2"
                    >
                        <Sprout width={250} height={250} className="rounded-full overflow-hidden" color="#5CB338" />
                    </TouchableOpacity>
                    {/* Level */}
                    <TouchableOpacity 
                        className="w-[80px] h-10 rounded-xl border border-[#ECE852] bg-[#ECE852]/30 justify-center items-center"
                    >
                        <Text className="text-[#ECE852] font-bold text-base">
                            Level 1
                        </Text>
                    </TouchableOpacity>
                    {/* Info */}
                    <Text className="text-white text-[14px] text-center">
                        "Water" your tree daily with positive actions to help it grow!
                    </Text>
                    {/* Progress Bar */}
                    <View className="items-center">
                        <Progress.Bar
                            progress={3/7}
                            width={350}
                            color="white"
                            borderRadius={10}
                        />
                        <Text className="mt-2 text-white text-sm">
                            3/7 days to next level
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}