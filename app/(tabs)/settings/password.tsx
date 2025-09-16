import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePassword() {
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
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");

    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Change Password" showBack={true} onBackPress={() => router.back()} />
            <View className="py-2 px-4 gap-4">
                {/* Old Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white font-[Poppins-Regular]"
                    value={old_password}
                    onChangeText={setOldPassword}
                    placeholder="Old Password"
                    placeholderTextColor="#ccc"
                />
                {/* New Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white font-[Poppins-Regular]"
                    value={new_password}
                    onChangeText={setNewPassword}
                    placeholder="New Password"
                    placeholderTextColor="#ccc"
                />
                {/* Confirm Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white font-[Poppins-Regular]"
                    value={confirm_password}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm Password"
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity
                    disabled={!old_password || !new_password || !confirm_password}
                    className={`${!old_password || !new_password || !confirm_password ? "opacity-40" : ""}`}
                    onPress={() => router.push("/(tabs)/settings")}
                >
                    <LinearGradient
                        colors={["#8736D9", "#5204BF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="py-3 items-center w-full rounded-2xl overflow-hidden"
                    >
                        <Text className="text-white text-base font-[Poppins-Bold]">SAVE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}