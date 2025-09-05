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

export default function SignUpScreen() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

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

            {/* Email */}
            <View className="mb-4">
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#cdaded"
                    className="w-full h-14 bg-white/10 text-white rounded-2xl px-5 py-3 border border-[#5204BF]/40 font-inter"
                />
            </View>

            {/* Username */}
            <View className="mb-4">
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#cdaded"
                    className="w-full h-14 bg-white/10 text-white rounded-2xl px-5 py-3 border border-[#5204BF]/40 font-inter"
                />
            </View>

            {/* Password */}
            <View className="h-14 flex-row items-center bg-white/10 rounded-2xl px-5 mb-6 border border-[#5204BF]/40">
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#cdaded"
                    value={password}
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

            {/* Sign Up */}
            <TouchableOpacity
                disabled={!email || !password || !username}
                onPress={handleSignUp}
                className={`${!email || !password || !username ? "opacity-40" : ""}`}
            >
                <LinearGradient
                    colors={["#8736D9", "#5204BF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="py-4 items-center w-full rounded-2xl overflow-hidden"
                >
                    <Text className="text-white font-bold text-lg tracking-wide">
                        SIGN UP
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </LinearGradient>
    );
}