import { useFonts } from "expo-font";
import { useCallback, useEffect, useRef, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ArrowUpCircle, Heart, MessageCircle } from "lucide-react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Keyboard, LayoutAnimation, UIManager, Platform } from "react-native";

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
        if (fontsLoaded) await SplashScreen.hideAsync();
    }, [fontsLoaded]);

    useEffect(() => {
        if (!fontsLoaded) return;
        onLayoutRootView();
    }, [fontsLoaded, onLayoutRootView]);

    useEffect(() => {
        if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }, []);

    if (!fontsLoaded) return null;

    const scrollRef = useRef<ScrollView | null>(null);

    const [comment, setComment] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [inputHeight, setInputHeight] = useState(44);
    const MAX_INPUT_HEIGHT = 100;

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
        setPresetReplies(getPresetReplies("Tôi vui lắm"));
    }, []);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setKeyboardHeight(e.endCoordinates.height);
            setTimeout(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
            }, 50);
        });
        const hide = Keyboard.addListener("keyboardDidHide", () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const presetAreaHeight = presetReplies.length > 0 ? 48 : 8;
    const safeInputHeight = Math.min(inputHeight, MAX_INPUT_HEIGHT);
    const FOOTER_BASE = presetAreaHeight + safeInputHeight + 20;

    return (
        <View className="flex-1 bg-[#020659]">
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: FOOTER_BASE + keyboardHeight + 8,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Heading title="Posts" showBack onBackPress={() => router.back()} />

                {/* Post */}
                <View className="mt-2">
                    <View className="p-4 mb-2">
                        <View>
                            <Text className="text-white font-[Poppins-SemiBold] text-sm">user01234567</Text>
                            <Text className="text-[#cfcfe0] font-[Poppins-Regular] text-xs mt-1">
                                12:20:20 26/4/2025
                            </Text>
                        </View>

                        <Text className="text-white mt-3 font-[Poppins-Regular] text-base">Tôi vui lắm</Text>

                        <View className="flex-row mt-3 gap-4">
                            <View className="flex-row items-center gap-1.5">
                                <Heart width={18} height={18} color="white" />
                                <Text className="text-[#cfcfe0] font-[Poppins-Regular] text-xs">10</Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                                <MessageCircle width={18} height={18} color="white" />
                                <Text className="text-[#cfcfe0] font-[Poppins-Regular] text-xs">10</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Comments list */}
                <View className="mt-4">
                    <Text className="text-white font-[Poppins-Bold] text-base mb-2">All comments</Text>

                    {Array.from({ length: 8 }).map((_, i) => (
                        <View
                            key={i}
                            className="mt-3 ml-2 p-3 rounded-xl border border-white/10 bg-white/5"
                        >
                            <Text className="text-white font-[Poppins-SemiBold] text-sm">user01234567</Text>
                            <Text className="text-[#cfcfe0] font-[Poppins-Regular] text-xs mt-1">
                                12:20:20 26/4/2025
                            </Text>
                            <Text className="text-white mt-2.5 font-[Poppins-Regular] text-[15px]">
                                Tôi vui lắm
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Footer */}
            <View
                className="absolute left-0 right-0 bg-[#020659] border-t border-white/10 pt-2"
                style={{ bottom: keyboardHeight, paddingBottom: Platform.OS === "ios" ? 18 : 10 }}
            >
                {/* Preset replies */}
                {presetReplies.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="pb-2 pl-2"
                        contentContainerStyle={{ alignItems: "center" }}
                    >
                        {presetReplies.map((reply, idx) => (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => setComment(reply)}
                                className="bg-white/15 h-10 px-4 rounded-full justify-center mr-2"
                            >
                                <Text className="text-white font-[Poppins-Regular] text-sm">{reply}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                {/* Input row */}
                <View className="flex-row items-end px-4">
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Write a comment"
                        placeholderTextColor="#BBBBBB"
                        multiline
                        onContentSizeChange={(e) => {
                            const h = e.nativeEvent.contentSize.height;
                            setInputHeight(Math.max(40, Math.min(h, MAX_INPUT_HEIGHT)));
                        }}
                        style={{
                            height: Math.max(44, safeInputHeight),
                            fontFamily: "Poppins-Regular",
                        }}
                        className="flex-1 bg-white/10 rounded-2xl px-3 py-2 text-white text-sm"
                        textAlignVertical="top"
                        onFocus={() => {
                            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
                        }}
                    />
                    <TouchableOpacity
                        disabled={!comment.trim()}
                        onPress={() => {
                            console.log("Send:", comment);
                            setComment("");
                            Keyboard.dismiss();
                        }}
                        className="ml-2"
                        style={{ opacity: comment.trim() ? 1 : 0.4 }}
                    >
                        <ArrowUpCircle size={36} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}