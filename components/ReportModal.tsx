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
  ToastAndroid,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { X, Circle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetId: string;
}

const REASON_SUGGESTIONS = [
  "Objectionable Content",
  "Offensive language",
  "False information",
  "Advertising / spam",
  "Harassment",
  "Violence or hate",
  "Other",
];

export default function ReportModal({ visible, onClose, targetId }: ReportModalProps) {
  const [text, setText] = useState('');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleReason = (reason: string) => {
    setSelectedReason(prev => (prev === reason ? null : reason));
  };

  const handleClose = () => {
    setText('');
    setSelectedReason(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedReason && !text.trim()) return;

    const reason = selectedReason === 'Other'
      ? text.trim() || 'No detail provided'
      : selectedReason + (text.trim() ? `: ${text.trim()}` : '');

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/v1/reports/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target_id: targetId,
          target_type: 'post',
          reason: reason,
        }),
      });

      if (res.ok) {
        ToastAndroid.show('You have reported this post', ToastAndroid.SHORT);
        handleClose();
      } else {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Failed', err.detail || 'Unable to send report');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error, please try again');
    } finally {
      setLoading(false);
    }
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View className="bg-white p-5 rounded-t-2xl">
                <View className="justify-between" style={{ minHeight: 420 }}>
                  <View>
                    <View className="flex-row justify-between items-center mb-3">
                      <Text className="text-lg font-[Poppins-Bold]">Report</Text>
                      <TouchableOpacity onPress={handleClose} disabled={loading}>
                        <X size={24} color="black" />
                      </TouchableOpacity>
                    </View>

                    <Text className="text-base mb-2 font-[Poppins-Bold]">
                      Why do you report this post?
                    </Text>

                    <View className="mb-4">
                      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
                        {REASON_SUGGESTIONS.map((reason) => (
                          <TouchableOpacity
                            key={reason}
                            activeOpacity={0.7}
                            onPress={() => toggleReason(reason)}
                            className="flex-row items-center py-4 border-b border-gray-100"
                            disabled={loading}
                          >
                            <View className="relative">
                              <Circle
                                size={24}
                                color={selectedReason === reason ? '#7F56D9' : '#D1D5DB'}
                                fill={selectedReason === reason ? '#7F56D9' : 'transparent'}
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

                    {/* Input*/}
                    {(selectedReason === 'Other' || !selectedReason) && (
                      <TextInput
                        placeholder="Please describe why you want to report..."
                        placeholderTextColor="#666"
                        multiline
                        value={text}
                        onChangeText={setText}
                        className="border border-gray-300 rounded-xl p-3 h-32 text-base font-[Poppins-Regular]"
                        editable={!loading}
                      />
                    )}
                  </View>

                  <TouchableOpacity
                    className={`mt-6 py-3 rounded-xl ${
                      selectedReason || text.trim() ? 'bg-red-500' : 'bg-gray-300'
                    }`}
                    onPress={handleSubmit}
                    disabled={loading || (!selectedReason && !text.trim())}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-center text-white text-base font-[Poppins-Bold]">
                        Send
                      </Text>
                    )}
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