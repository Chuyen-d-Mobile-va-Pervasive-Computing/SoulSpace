import Heading from "@/components/Heading";
import { router } from "expo-router";
import { ArrowUpCircle, Heart, MessageCircle } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CommentScreen() {
    const [comment, setComment] = useState("");

    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Posts" showBack onBackPress={() => router.back()} />
            {/* Body */}
            <View className="flex-1 px-4 mt-4">
                {/* Post */}
                <View className="mt-4">
                    <View className="p-4 rounded-2xl shadow-lg">
                        {/* Header */}
                        <View>
                            <Text className="text-white font-semibold text-sm">
                                user01234567
                            </Text>
                            <Text className="text-gray-300 text-xs mt-1">
                                12:20:20 26/4/2025
                            </Text>
                        </View>

                        {/* Content */}
                        <Text className="text-white text-base mt-3">Tôi vui lắm</Text>

                        {/* Interaction */}
                        <View className="flex-row mt-3 gap-6">
                            <View className="flex-row items-center gap-1">
                                <Heart width={18} height={18} color="white" />
                                <Text className="text-white text-sm">10</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <MessageCircle width={18} height={18} color="white" />
                                <Text className="text-white text-sm">10</Text>
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
                        <Text className="text-white font-bold text-base">All comments</Text>
                        <View className="ml-6 mt-4 p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg">
                            {/* Header */}
                            <View>
                                <Text className="text-white font-semibold text-sm">
                                    user01234567
                                </Text>
                                <Text className="text-gray-300 text-xs mt-1">
                                    12:20:20 26/4/2025
                                </Text>
                            </View>

                            {/* Content */}
                            <Text className="text-white text-base mt-3">Tôi vui lắm</Text>

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

                {/* Input comment */}
                <View className="flex-row items-center border-t border-white/20 p-3">
                    <TextInput
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Write a comment"
                        placeholderTextColor="#BBBBBB"
                        className="flex-1 text-white text-sm px-3 py-2 bg-white/10 rounded-full"
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