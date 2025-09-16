import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { router } from "expo-router";
import { CalendarDays, SlidersHorizontal, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DiaryListScreen() {
    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
        "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
        "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
        "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
        "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
    });
                
    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
        await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
                
    if (!fontsLoaded) return null;
    const [filterVisible, setFilterVisible] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCancel = () => {
        setShowConfirm(true);
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
    };
    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="My diary" showBack={true} onBackPress={() => router.back()} />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 mt-4"
            >
                {/* Filter */}
                <TouchableOpacity
                    className="flex-row justify-end items-center mb-4"
                    onPress={() => setFilterVisible(true)}
                >
                    <Text className="text-white font-[Poppins-Bold] text-xs mr-2">Filter</Text>
                    <SlidersHorizontal width={20} height={20} color="white" />
                </TouchableOpacity>
                <View className="w-full p-2 overflow-hidden gap-4">
                    <View className="flex-1">
                        <View className="w-full border border-white px-3 py-5 gap-3 bg-white/30 rounded-lg overflow-hidden">
                            {/* Date */}
                            <View className="w-full flex-row justify-between">
                                <Text className="text-white text-[15px] font-[Poppins-Regular]">Saturday, Jan 19</Text>
                                <TouchableOpacity onPress={handleCancel}>
                                    <Trash2 width={24} height={24} color="#FB4141" />
                                </TouchableOpacity>
                            </View>
                            {/* Emoji */}
                            <View className="h-20 justify-center items-center w-full">
                                <CalendarDays width={20} height={20} color="white" />
                                <Text className="text-white text-xs font-[Poppins-Bold] text-center w-full">
                                    Hạnh phúc
                                </Text>
                            </View>
                            {/* Time */}
                            <View className="items-center w-full">
                                <Text className="text-white text-[15px] font-[Poppins-Regular]">--- 19:01 AM ---</Text>
                            </View>
                            {/* Content */}
                            <View className="items-center w-full">
                                <Text className="text-white text-[15px] font-[Poppins-Regular]">
                                    aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <Modal
                visible={filterVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterVisible(false)}
            >
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="w-[300px] bg-white p-6 rounded-2xl gap-4">
                        <>
                            <Text className="text-base font-[Poppins-Bold]">Sort</Text>
                            <TagSelector
                                options={[
                                { id: "recent", name: "Recent" },
                                { id: "older", name: "Older" },
                                ]}
                                multiSelect={false}
                                onChange={(ids) => console.log("Sort by:", ids)}
                            />
                        </>
                        <>
                            <Text className="text-base font-[Poppins-Bold]">Tags</Text>
                            <TagSelector
                                options={[
                                { id: "1", name: "Family" },
                                { id: "2", name: "Work" },
                                { id: "3", name: "Study" },
                                ]}
                                multiSelect={false}
                                onChange={(ids) => console.log("Sort by:", ids)}
                            />
                        </>
                        <Pressable
                          className="mt-4 bg-[#6F04D9] py-2 rounded-xl"
                          onPress={() => setFilterVisible(false)}
                        >
                          <Text className="text-center text-white font-[Poppins-Bold]">Apply</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            {/* Delete Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={showConfirm}
                onRequestClose={() => setShowConfirm(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center">
                    <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
                        <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
                            Are you sure you want to delete this diary?
                        </Text>
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => setShowConfirm(false)}
                                className="bg-gray-300 px-8 py-4 rounded-xl"
                            >
                                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">
                                    No
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleConfirmCancel}
                                className="bg-red-500 px-8 py-4 rounded-xl"
                            >
                                <Text className="text-base font-[Poppins-SemiBold] text-white">
                                    Yes
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}