import Heading from "@/components/Heading";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmScreen() {
    return(
        <View className="flex-1 bg-[#020659]">
            <Heading title="" showBack={true} onBackPress={() => router.back()} />

            <ScrollView className="flex-1 px-3 gap-5" contentContainerStyle={{flexGrow: 1, paddingBottom: 20 }}>
                <View className="flex-1 justify-between">
                    <View className="items-center gap-5 px-2">
                        <Text className="font-bold text-base text-white">Public Policy</Text>
                        <Text className="text-sm text-white">
                            Before posting, please make sure you are at least 13 years old. Your post must not contain links, phone numbers, or sensitive keywords (such as “kms” and similar terms). Please read and fully understand these rules before sharing any content.
                        </Text>
                    </View>
                </View>

                <View className="px-3">
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: "/(tabs)/community/add" })}
                    >
                        <LinearGradient
                            colors={["#8736D9", "#5204BF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            className="py-3 items-center w-full rounded-2xl overflow-hidden"
                        >
                            <Text className="text-white text-base font-bold">Agree</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}