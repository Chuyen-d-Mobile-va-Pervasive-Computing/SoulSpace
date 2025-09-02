import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Gift } from "lucide-react-native";
import { useState } from "react";
import {
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NewPasswordScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmpw, setConfirmPw] = useState("");

    const handleSignUp = () => {
        router.replace("/(auth)/login");
    };

    return (
        <LinearGradient
            colors={["#010440", "#020659"]}
            className="flex-1 justify-center px-6"
        >
            {/* Logo */}
            <View className="items-center mb-12">
                <LinearGradient
                    colors={["#8736D9", "#cdaded"]}
                    className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
                >
                    <Gift size={42} color="#fff" />
                </LinearGradient>
                <Text className="text-white text-2xl font-inter_bold mt-5 tracking-widest">SOULSPACE</Text>
            </View>

            {/* Password */}
            <View className="h-14 flex-row items-center bg-white/10 rounded-2xl px-5 mb-6 border border-[#5204BF]/40">
                <TextInput
                    placeholder="New Password"
                    placeholderTextColor="#cdaded"
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 text-white py-3 font-inter"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                    <Eye size={22} color="#cdaded" />
                ) : (
                    <EyeOff size={22} color="#cdaded" />
                )}
                </Pressable>
            </View>

            {/* Confirm Password */}
            <View className="h-14 flex-row items-center bg-white/10 rounded-2xl px-5 mb-6 border border-[#5204BF]/40">
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#cdaded"
                    onChangeText={setConfirmPw}
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 text-white py-3 font-inter"
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                    <Eye size={22} color="#cdaded" />
                ) : (
                    <EyeOff size={22} color="#cdaded" />
                )}
                </Pressable>
            </View>

            {/* Sign Up */}
            <TouchableOpacity
                disabled={!password || !confirmpw}
                onPress={handleSignUp}
                className={`${!password || !confirmpw ? "opacity-40" : ""}`}
            >
                <LinearGradient
                    colors={["#8736D9", "#5204BF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-4 items-center w-full rounded-2xl overflow-hidden"
                >
                    <Text className="text-white font-bold text-lg tracking-wide">
                        Change Password
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
}