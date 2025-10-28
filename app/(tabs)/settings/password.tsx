import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function ChangePassword() {
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!old_password || !new_password || !confirm_password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        if (new_password !== confirm_password) {
            Alert.alert("Error", "New password and confirmation do not match.");
            return;
        }

        if (new_password.length < 6) {
            Alert.alert("Error", "New password must be at least 6 characters long.");
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

            const response = await fetch(`${API_BASE}/api/v1/auth/change-password`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                old_password,
                new_password,
                confirm_password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data?.detail) {
                if (Array.isArray(data.detail)) {
                    Alert.alert("Error", data.detail[0]?.msg || "Invalid input");
                } else {
                    Alert.alert("Error", data.detail);
                }
                } else {
                Alert.alert("Error", "An unexpected error occurred.");
                }
                return;
            }

            Alert.alert("Success", "Password changed successfully!", [
                { text: "OK", onPress: () => router.push("/(tabs)/settings") },
            ]);
        } catch (error: any) {
            Alert.alert("Network Error", error.message || "Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Change Password" />
            <View className="py-2 px-4 gap-4">
                {/* Old Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Poppins-Regular]"
                    value={old_password}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    placeholderTextColor="#7B7B7B"
                />
                {/* New Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Poppins-Regular]"
                    value={new_password}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor="#7B7B7B"
                />
                {/* Confirm Password */}
                <TextInput
                    className="h-16 w-full rounded-xl border border-[#EEEEEE] bg-white px-3 font-[Poppins-Regular]"
                    value={confirm_password}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="#7B7B7B"
                />
                <TouchableOpacity
                    disabled={!old_password || !new_password || !confirm_password || loading}
                    className={`w-full h-14 rounded-xl items-center justify-center ${
                        !old_password || !new_password || !confirm_password || loading
                        ? "opacity-40 bg-[#7F56D9]"
                        : "bg-[#7F56D9]"
                    }`}
                    onPress={handleChangePassword}
                >
                    <Text className="text-white text-base font-[Poppins-Bold]">
                        {loading ? "Saving..." : "SAVE"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}