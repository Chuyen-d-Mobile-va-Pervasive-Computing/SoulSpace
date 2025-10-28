import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function ChangeAccount() {
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Lấy username hiện tại
    useEffect(() => {
        const loadUsername = async () => {
        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) setUsername(savedUsername);
        };
        loadUsername();
    }, []);

    // Gọi API update username
    const handleSave = async () => {
        if (!username.trim()) {
        Alert.alert("Error", "Username cannot be empty.");
        return;
        }

        if (username.length > 30) {
        Alert.alert("Error", "Username must be 30 characters or less.");
        return;
        }

        try {
        setLoading(true);
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
            Alert.alert("Error", "Missing token. Please login again.");
            router.replace("/(auth)/login");
            return;
        }

        const response = await fetch(`${API_BASE}/api/v1/auth/update-username`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_username: username }),
        });

        const data = await response.json();

        if (!response.ok) {
            if (data?.detail) {
            if (Array.isArray(data.detail)) {
                Alert.alert("Update failed", data.detail[0]?.msg || "Invalid input");
            } else {
                Alert.alert("Update failed", data.detail);
            }
            } else {
            Alert.alert("Update failed", "An unexpected error occurred");
            }
            return;
        }

        // Thành công -> lưu lại vào AsyncStorage
        await AsyncStorage.setItem("username", username);

        Alert.alert("Success", "Username updated successfully!", [
            { text: "OK", onPress: () => router.push("/(tabs)/settings") },
        ]);
        } catch (error: any) {
        Alert.alert("Error", error.message || "Network error");
        } finally {
        setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Change Account" />
            <View className="py-2 px-4 gap-1">
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Poppins-Regular]"
                    value={username}
                    onChangeText={setUsername}
                    placeholder="user1234567"
                    placeholderTextColor="#7B7B7B"
                    maxLength={30}
                />
                <Text className="self-stretch text-right text-xs text-gray-400 font-[Poppins-Regular]">
                    {username.length}/30
                </Text>
                <TouchableOpacity
                    disabled={!username || loading}
                    className={`w-full h-14 rounded-xl items-center justify-center ${
                        !username || loading ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"
                    }`}
                    onPress={handleSave}
                >
                    <Text className="text-white text-base font-[Poppins-Bold]">
                        {loading ? "Saving..." : "SAVE"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}