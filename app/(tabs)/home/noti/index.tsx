"use client";

import Heading from "@/components/Heading";
import { useState } from "react";
import { TriangleAlert } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function NotiScreen() {
    const [search, setSearch] = useState("");

    const notifications = [
        {
            id: 1,
            content: "Your post has been reported",
            time: "now",
            unread: true,
        },
        {
            id: 2,
            content: "Your comment has been reported",
            time: "11:00",
            unread: false,
        },
        {
            id: 3,
            content: "Your post has been reported",
            time: "3 days ago",
            unread: true,
        },
        {
            id: 4,
            content: "Your post has been reported",
            time: "2025-01-01",
            unread: false,
        },
    ];

    const filteredCollections = notifications.filter((item) =>
        item.content.toLowerCase().includes(search.toLowerCase())
    );

//   const handleSelectUser = (userId: number) => {
//     const user = notifications.find((user) => user.id === userId);
//     if (user) {
//       router.push({ pathname: "/noti/[id]", params: { id: String(user.id), name: user.name, time: user.time, avatar: user.avatar } });
//     }
//   };

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Notification" />

            <ScrollView className="mt-4" contentContainerStyle={{ paddingBottom: 40 }}>
                <View>
                    {filteredCollections.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            //   onPress={() => handleSelectUser(item.id)}
                            className={`flex-row items-center justify-between px-6 py-4 mb-2y ${
                                item.unread ? "bg-[#E0D7F9]" : "bg-transparent"
                            }`}
                        >
                            <View className="w-12 h-12 rounded-full">
                                <TriangleAlert />
                            </View>
                            <View className="flex-row items-center flex-1">
                                <View className="flex-col flex-1">
                                    <Text
                                        className={`text-black ${
                                            item.unread ? "font-[Poppins-Bold]" : "font-[Poppins-Regular]"
                                        }`}
                                    >
                                        {item.content}
                                    </Text>
                                    <Text className="text-sm text-[#9CA3AF] font-[Poppins-Medium]">
                                        {item.time}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}