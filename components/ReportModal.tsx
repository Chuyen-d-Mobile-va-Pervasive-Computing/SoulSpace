import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid
} from "react-native";
import { X, Circle } from "lucide-react-native";

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}

const REASON_SUGGESTIONS = [
    "Objectionable Content",
    "Offensive language",
    "False information",
    "Advertising / spam",
    "Harassment",
    "Violence or hate",
];

export default function ReportModal({
  visible,
  onClose,
  onSubmit,
}: ReportModalProps) {
    const [text, setText] = useState("");
    const [selectedReason, setSelectedReason] = useState<string | null>(null);

    const handleSubmit = () => {
        if (!text.trim() && !selectedReason) return;

        const finalReason = selectedReason
        ? selectedReason + (text ? "; " + text.trim() : "")
        : text.trim();

        onSubmit(finalReason);
        ToastAndroid.show("You have reported this post", ToastAndroid.SHORT);
        onClose();
    };

    const handleClose = () => {
        setText("");
        setSelectedReason(null);
        onClose();
    };

    const toggleReason = (reason: string) => {
        setSelectedReason((prev) => (prev === reason ? null : reason));
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View className="flex-1 bg-black/40 justify-end">
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                            <View className="bg-white p-5 rounded-t-2xl">
                                <View className="justify-between" style={{ minHeight: 420 }}>                          
                                    <View>
                                        <View className="flex-row justify-between items-center mb-3">
                                            <Text className="text-lg font-[Poppins-Bold]">Report</Text>
                                            <TouchableOpacity onPress={handleClose}>
                                                <X size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>

                                        <Text className="text-base mb-2 font-[Poppins-Bold]">Why do you report this post?</Text>
                                        <View className="mb-4">
                                            <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
                                                {REASON_SUGGESTIONS.map((reason) => (
                                                    <TouchableOpacity
                                                        key={reason}
                                                        activeOpacity={0.7}
                                                        onPress={() => toggleReason(reason)}
                                                        className="flex-row items-center py-4 border-b border-gray-100"
                                                    >
                                                        <View className="relative">
                                                            <Circle
                                                                size={24}
                                                                color={selectedReason === reason ? "#7F56D9" : "#D1D5DB"}
                                                                fill={selectedReason === reason ? "#7F56D9" : "transparent"}
                                                                strokeWidth={2}
                                                            />
                                                            {selectedReason === reason && (
                                                                <View className="absolute inset-0 items-center justify-center">
                                                                    <View className="w-3 h-3 bg-white rounded-full" />
                                                                </View>
                                                            )}
                                                        </View>

                                                        <Text className="ml-4 text-base font-[Poppins-Regular] flex-1">
                                                            {reason}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}                                         
                                            </ScrollView>
                                        </View>

                                        {/* Input */}
                                        <TextInput
                                            placeholder="Please describe why you want to report..."
                                            placeholderTextColor="#666"
                                            multiline
                                            value={text}
                                            onChangeText={setText}
                                            className="border border-gray-300 rounded-xl p-3 h-32 text-base font-[Poppins-Regular]"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        className={`mt-6 py-3 rounded-xl ${selectedReason || text.trim() ? 'bg-red-500' : 'bg-gray-300'}`}
                                        onPress={handleSubmit}
                                        disabled={!selectedReason && !text.trim()}
                                    >
                                        <Text className="text-center text-white text-base font-[Poppins-Bold]">Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}