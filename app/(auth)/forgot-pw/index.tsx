import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Gift } from "lucide-react-native";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
    const router = useRouter();

    return (
        <LinearGradient
            colors={["#010440", "#020659"]}
            className="flex-1 justify-center px-6"
        >
        {/* Logo */}
        <View className="items-center mb-8">
            <LinearGradient
                colors={["#8736D9", "#cdaded"]}
                className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
            >
                <Gift size={42} color="#fff" />
            </LinearGradient>
            <Text className="text-white text-2xl font-inter_bold mt-5 tracking-widest">SOULSPACE</Text>
        </View>

        <View className="mb-6 px-4">
            <Text className="text-white text-[10px] text-center">Enter email for verification, we will send 4-digit verification code to this email</Text>
        </View>

        {/* Email */}
        <View className="mb-4">
            <TextInput
                placeholder="Email"
                placeholderTextColor="#cdaded"
                className="w-full h-14 bg-white/10 text-white rounded-2xl px-5 py-3 border border-[#5204BF]/40 font-inter"
            />
        </View>

        <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-pw/confirm-otp")}
            className="w-full rounded-2xl overflow-hidden shadow-xl"
        >
            <LinearGradient
                colors={["#8736D9", "#5204BF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 items-center"
            >
            <Text className="text-white font-bold text-lg tracking-wide">
                Continue
            </Text>
            </LinearGradient>
        </TouchableOpacity>
        </LinearGradient>
    );
}