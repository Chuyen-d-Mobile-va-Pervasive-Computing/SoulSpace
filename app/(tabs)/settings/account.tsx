import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangeAccount() {
    const [username, setUsername] = useState<string>("");

    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Change Account" showBack={true} onBackPress={() => router.back()} />
            <View className="py-2 px-4 gap-1">
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="user1234567"
                    placeholderTextColor="#ccc"
                    maxLength={30}
                />
                <Text className="self-stretch text-right text-xs text-gray-400">
                    0/30
                </Text>
                <TouchableOpacity
                    disabled={!username}
                    className={`${!username? "opacity-40" : ""}`}
                    onPress={() => router.push("/(tabs)/settings")}
                >
                    <LinearGradient
                        colors={["#8736D9", "#5204BF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="py-3 items-center w-full rounded-2xl overflow-hidden"
                    >
                        <Text className="text-white text-base font-bold">SAVE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}