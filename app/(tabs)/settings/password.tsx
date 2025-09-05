import Heading from "@/components/Heading";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ChangePassword() {
    const [oldpw, setOldPw] = useState("");
    const [newpw, setNewPw] = useState("");
    const [confirmpw, setConfirmPw] = useState("");

    return (
        <View className="flex-1 bg-[#020659]">
            <Heading title="Change Password" showBack={true} onBackPress={() => router.back()} />
            <View className="py-2 px-4 gap-4">
                {/* Old Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white"
                    value={oldpw}
                    onChangeText={setOldPw}
                    placeholder="Old Password"
                    placeholderTextColor="#ccc"
                />
                {/* New Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white"
                    value={newpw}
                    onChangeText={setNewPw}
                    placeholder="New Password"
                    placeholderTextColor="#ccc"
                />
                {/* Confirm Password */}
                <TextInput
                    className="h-14 w-full rounded-xl border border-white/20 bg-white/15 px-3 text-white"
                    value={confirmpw}
                    onChangeText={setConfirmPw}
                    placeholder="Confirm Password"
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity
                    disabled={!oldpw || !newpw || !confirmpw}
                    className={`${!oldpw || !newpw || !confirmpw ? "bg-[#A894C1]" : "bg-[rgba(111,4,217,0.3)] border border-[#6f04d9]"} rounded-xl h-12 items-center justify-center`}
                    onPress={() => router.push("/(tabs)/settings")}
                >
                    <Text className="text-white text-base font-bold">SAVE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}