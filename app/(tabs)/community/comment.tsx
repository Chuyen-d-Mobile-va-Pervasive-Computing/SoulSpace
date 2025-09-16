import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ArrowUpCircle, Heart, MessageCircle } from "lucide-react-native";
import { useState, useEffect } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CommentScreen() {
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
    const [comment, setComment] = useState("");

    const presetRepliesMap: Record<string, string[]> = {
        vui: ["That's awesome!", "Happy for you!", "Keep smiling!"],
        buồn: ["You're not alone", "Stay strong", "Better days will come"],
        default: ["Thank you for sharing", "I understand", "Sending love ❤️"],
    };

    const getPresetReplies = (content: string) => {
        if (content.includes("vui")) return presetRepliesMap["vui"];
        if (content.includes("buồn")) return presetRepliesMap["buồn"];
        return presetRepliesMap["default"];
    };

    const [presetReplies, setPresetReplies] = useState<string[]>([]);

    useEffect(() => {
        const content = "Tôi vui lắm";
        setPresetReplies(getPresetReplies(content));
    }, []);

    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Posts" showBack={true} onBackPress={() => router.back()} />
            {/* Body */}
            <View className="flex-1 px-4">
                {/* Post */}
                <View>
                    <View className="p-4 rounded-2xl shadow-lg">
                        {/* Header */}
                        <View>
                            <Text className="text-white font-[Poppins-SemiBold] text-sm">
                                user01234567
                            </Text>
                            <Text className="text-gray-300 font-[Poppins-Regular] text-xs mt-1">
                                12:20:20 26/4/2025
                            </Text>
                        </View>

                        {/* Content */}
                        <Text className="text-white font-[Poppins-Regular] text-base mt-3">Tôi vui lắm</Text>

                        {/* Interaction */}
                        <View className="flex-row mt-3 gap-6">
                            <View className="flex-row items-center gap-1">
                                <Heart width={18} height={18} color="white" />
                                <Text className="text-white text-sm font-[Poppins-Regular]">10</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <MessageCircle width={18} height={18} color="white" />
                                <Text className="text-white text-sm font-[Poppins-Regular]">10</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Comments */}
                    <View className="mt-6 space-y-3">
                        <Text className="text-white font-[Poppins-Bold] text-base">All comments</Text>
                        <View className="ml-6 mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg">
                            {/* Header */}
                            <View>
                                <Text className="text-white font-[Poppins-SemiBold] text-sm">
                                    user01234567
                                </Text>
                                <Text className="text-gray-300 font-[Poppins-Regular] text-xs mt-1">
                                    12:20:20 26/4/2025
                                </Text>
                            </View>

                            {/* Content */}
                            <Text className="text-white text-base mt-3 font-[Poppins-Regular]">Tôi vui lắm</Text>

                            {/* Interaction */}
                            {/* <View className="flex-row mt-3 gap-6">
                                <View className="flex-row items-center gap-1">
                                    <Heart width={18} height={18} color="white" />
                                    <Text className="text-white text-sm">10</Text>
                                </View>
                                <View className="flex-row items-center gap-1">
                                    <MessageCircle width={18} height={18} color="white" />
                                    <Text className="text-white text-sm">10</Text>
                                </View>
                            </View> */}
                        </View>
                    </View>
                </ScrollView>
                <View className="flex-end">
                    {presetReplies.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row mb-2"
                        >
                            {presetReplies.map((reply, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => setComment(reply)}
                                    className="bg-white/20 h-10 px-4 py-2 rounded-xl mr-2"
                                >
                                    <Text className="text-white text-sm font-[Poppins-Regular]">{reply}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                    </View>
                {/* Input comment */}
                <View className="flex-row items-center border-t border-white/20 p-3">
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Write a comment"
                        placeholderTextColor="#BBBBBB"
                        className="flex-1 text-white text-sm px-3 py-2 bg-white/10 rounded-full font-[Poppins-Regular]"
                    />
                    <TouchableOpacity
                        disabled={!comment.trim()}
                        onPress={() => {
                            console.log("Send:", comment);
                            setComment("");
                        }}
                        className={`ml-3 ${!comment.trim() ? "opacity-40" : ""}`}
                        >
                        <ArrowUpCircle size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}