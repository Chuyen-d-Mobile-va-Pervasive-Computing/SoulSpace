import Heading from "@/components/Heading";
import React, { useState } from "react";
import { router } from "expo-router";
import { Audio } from "expo-av";
import { AudioLines } from "lucide-react-native";
import AngryIcon from "@/assets/images/angry.svg";
import { ScrollView, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from "react-native";

export default function DiaryListScreen() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [audioUri, setAudioUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const handleCancel = () => setShowConfirm(true);
    const handleConfirmCancel = () => {
        setShowConfirm(false);
        router.push("/(tabs)/home/diary");
    };

    const playRecording = async () => {
        if (!audioUri) return;
    
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);
        await sound.playAsync();
    };

    return (
        <View className="flex-1 bg-[#FAF9FF]">
            <Heading title="Diary" />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                className="flex-1 px-4 mt-4"
            >
                <TouchableOpacity onPress={handleCancel}>
                    <Text className="text-[#FF0000] font-[Poppins-Bold] text-right">Delete</Text>
                </TouchableOpacity>
                <View className="flex-1 w-full gap-6 px-4 items-center">
                    <Text className="text-[36px] text-center font-[Poppins-SemiBold]">24/09/2025</Text>
                    <Text className="text-[24px] text-center font-[Poppins-Regular]">19:00 AM</Text>
                    <AngryIcon width={100} height={100} />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ flexDirection: "row", gap: 8 }}
                    >
                        <View className="px-4 py-2 rounded-full border border-[#7F56D9]">
                            <Text className="font-[Poppins-Regular] text-[#7F56D9]">Family</Text>
                        </View>
                    </ScrollView>
                    <Text className="mt-1 text-[18px] font-[Poppins-Regular] text-[#736B66] text-center">
                        I felt really angry, and I am still learning asdasd
                        adsasdasdasdasdas
                        asdasdsadasdsadasdasdsadsadsadas
                    </Text>
                    <TouchableOpacity
                        className="h-[60px] px-6 rounded-lg flex-row items-center justify-center gap-2 mt-3"
                        onPress={playRecording}
                    >
                        <AudioLines width={30} height={30} color="#4ADE80" />
                        <Text className="text-black font-[Poppins-SemiBold] text-sm tracking-wide">
                            Record Name
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal transparent animationType="fade" visible={showConfirm}>
                <TouchableWithoutFeedback onPress={() => setShowConfirm(false)}>
                    <View className="flex-1 bg-black/60 justify-center items-center">
                        <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
                            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
                                Are you sure you want to discard this diary?
                            </Text>
                            <View className="flex-row gap-4">
                                <TouchableOpacity
                                    onPress={() => setShowConfirm(false)}
                                    className="bg-gray-300 px-8 py-4 rounded-xl"
                                >
                                    <Text className="text-base font-[Poppins-SemiBold] text-gray-800">
                                        No
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleConfirmCancel}
                                    className="bg-red-500 px-8 py-4 rounded-xl"
                                >
                                    <Text className="text-base font-[Poppins-SemiBold] text-white">
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}