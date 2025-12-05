import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { X } from "lucide-react-native";
import { useState } from "react";

interface TopicPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (topic: string) => void;
}

const ALL_TOPICS = [
  "Travel",
  "Food",
  "Sport",
  "Study",
  "Gaming",
  "Health",
  "Business",
  "Lifestyle",
  "Technology",
  "Music",
];

export default function TopicPickerModal({
  visible,
  onClose,
  onSelect,
}: TopicPickerModalProps) {
  const [search, setSearch] = useState("");

  const filtered = ALL_TOPICS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-2xl p-5 max-h-[70%]">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-[Poppins-Bold]">Select topic</Text>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="black" />
              </TouchableOpacity>
            </View>
            {/* Search */}
            <TextInput
              placeholder="Search topic..."
              placeholderTextColor="#777"
              value={search}
              onChangeText={setSearch}
              className="border border-gray-300 rounded-xl px-4 py-3 mb-3 font-[Poppins-Regular]"
            />
            {/* FlatList */}
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-gray-200"
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text className="text-base font-[Poppins-Regular]">{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-center text-gray-500 py-4 font-[Poppins-Regular]">
                  No topic found.
                </Text>
              }
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}