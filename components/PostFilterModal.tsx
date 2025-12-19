import React from "react";
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import { X, Check } from "lucide-react-native";

export type SortOption = "latest" | "oldest" | "most-liked" | "most-commented";
export const SORT_OPTIONS = [
  "latest",
  "oldest",
  "most-liked",
  "most-commented",
] as const;

export type FilterTopic = string | "all";

interface PostFilterModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedTopic: FilterTopic;
  onTopicChange: (topic: FilterTopic) => void;
  availableTopics: string[];
  showExpertOnly: boolean;
  onExpertOnlyChange: (value: boolean) => void;
}

export default function PostFilterModal({
  visible,
  onClose,
  sortBy,
  onSortChange,
  selectedTopic,
  onTopicChange,
  availableTopics,
  showExpertOnly,
  onExpertOnlyChange,
}: PostFilterModalProps) {
  const sortOptions = [
    { id: "latest", label: "Recent", icon: "🕒" },
    { id: "oldest", label: "Older", icon: "📅" },
    { id: "most-liked", label: "Most likes", icon: "❤️" },
    { id: "most-commented", label: "Most comments", icon: "💬" },
  ];

  const topics = ["all", ...availableTopics];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white rounded-t-3xl max-h-[80%]">
              {/* Header */}
              <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
                <Text className="text-xl font-[Poppins-Bold]">Filter</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <ScrollView className="px-5 py-4">
                {/* Sắp xếp */}
                <Text className="text-lg font-[Poppins-SemiBold] mb-3">Sort By</Text>
                <View className="mb-6">
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => onSortChange(option.id as SortOption)}
                      className={`flex-row items-center py-3 px-4 rounded-xl mb-2 ${
                        sortBy === option.id ? "bg-[#7F56D9]" : "bg-gray-100"
                      }`}
                    >
                      <Text className="text-2xl mr-3">{option.icon}</Text>
                      <Text
                        className={`font-[Poppins-Medium] ${
                          sortBy === option.id ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Lọc theo chủ đề */}
                <Text className="text-lg font-[Poppins-SemiBold] mb-3">Topics</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: "row", gap: 8 }}
                  className="flex-row flex-wrap gap-2 mb-6"
                >
                  {topics.map((topic) => (
                    <TouchableOpacity
                      key={topic}
                      onPress={() => onTopicChange(topic as FilterTopic)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedTopic === topic
                          ? "bg-[#7F56D9] border-[#7F56D9]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <Text
                        className={`font-[Poppins-Medium] ${
                          selectedTopic === topic ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {topic === "all" ? "All" : topic}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Chỉ hiển thị bài từ Expert */}
                <Text className="text-lg font-[Poppins-SemiBold] mb-3">Other</Text>
                <TouchableOpacity
                  onPress={() => onExpertOnlyChange(!showExpertOnly)}
                  className="flex-row items-center py-3"
                >
                  <View
                    className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                      showExpertOnly ? "bg-[#7F56D9] border-[#7F56D9]" : "border-gray-400"
                    }`}
                  >
                    {showExpertOnly && (
                      <Check size={16} color="#FFF"/>
                    )}
                  </View>
                  <Text className="font-[Poppins-Medium] text-gray-800">
                    Show only posts from Experts
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Apply Button */}
              <View className="p-5 border-t border-gray-200">
                <TouchableOpacity
                  onPress={onClose}
                  className="bg-[#7F56D9] py-4 rounded-xl"
                >
                  <Text className="text-center text-white font-[Poppins-Bold] text-lg">
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}