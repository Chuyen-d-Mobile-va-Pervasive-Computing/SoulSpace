import { router, useLocalSearchParams } from "expo-router";
import { X, Plus } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  FlatList,
  Keyboard,
} from "react-native";
import CustomSwitch from "@/components/CustomSwitch";
import Logo from "@/assets/images/logo.svg";
import SvgAvatar from "@/components/SvgAvatar";

export default function AddScreen() {
  const textInputRef = useRef<TextInput>(null);
  const [postContent, setPostContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const params = useLocalSearchParams();
  const initialTag = params.tag as string | undefined;
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : []
  );

  // Danh sách tất cả tag có thể có (gợi ý + đã tạo)
  const allAvailableTags = [
    "Family",
    "Lover",
    "Pet",
    "Technology",
    "Friends",
    "Travel",
    "Food",
    "Music",
    "Workout",
    "Study",
    "Work",
    "Healing",
  ];

  const user = {
    username: "SoulSpace",
    avatar: "https://i.pravatar.cc/300",
  };

  const toggleTag = (tag: string) => {
    setSelectedTags([tag]);
  };

  const addNewTag = () => {
    const trimmed = tagSearch.trim();
    if (trimmed && !selectedTags.includes(trimmed) && !allAvailableTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
    if (trimmed && !selectedTags.includes(trimmed)) {
      toggleTag(trimmed);
    }
    setTagSearch("");
    setShowTagModal(false);
  };

  const filteredTags = allAvailableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagSearch.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAF9FF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="w-full px-6 py-2 mt-8 flex-row items-center justify-between bg-[#FAF9FF]">
        <TouchableOpacity
          onPress={() => {
            if (postContent.trim().length === 0) {
              router.push("/(tabs)/community");
            } else {
              setShowConfirm(true);
            }
          }}
        >
          <X size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Username */}
        <View className="flex-row items-center gap-3 mb-6">
          {isAnonymous ? (
            <SvgAvatar size={48}>
              <Logo width={48} height={48} />
            </SvgAvatar>
          ) : (
            <Image
              source={{ uri: user.avatar }}
              className="w-12 h-12 rounded-full"
            />
          )}
          <Text className="text-lg font-[Poppins-SemiBold]">
            {isAnonymous ? "Anonymous" : user.username}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              setShowTagModal(true);
            }}
          >
            {selectedTags.length === 0 ? (
              <>
                <View className="bg-gray-200 px-6 py-2 rounded-full flex-row items-center gap-1">
                  <Plus size={16} color="#666" />
                  <Text className="text-gray-700 font-[Poppins-Medium]">Add tags</Text>
                </View>
              </>
            ) : (
              <View className="border border-[#7F56D9] px-6 py-2 rounded-full flex-row items-center gap-1">
                <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">
                  {selectedTags[0]}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Nội dung bài viết */}
        <TextInput
          ref={textInputRef}
          value={postContent}
          onChangeText={setPostContent}
          placeholder="Share on community..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={10}
          className="text-base text-black leading-6 font-[Poppins-Regular]"
          style={{ minHeight: 250, textAlignVertical: "top" }}
        />
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4 flex-row items-center justify-between shadow-lg">
        <View className="flex-row items-center gap-3">
          <Text className="text-gray-600 font-[Poppins-Medium]">Anonymous</Text>
          <CustomSwitch
            value={isAnonymous}
            onValueChange={() => setIsAnonymous(!isAnonymous)}
          />
        </View>

        <TouchableOpacity
          disabled={!postContent.trim()}
          onPress={() => router.push("/(tabs)/community")}
          className={`px-7 py-3 rounded-full ${
            postContent.trim() ? "bg-[#7F56D9]" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-[Poppins-Bold] text-base">Post now</Text>
        </TouchableOpacity>
      </View>

      {/* Modal xác nhận thoát */}
      <Modal transparent animationType="fade" visible={showConfirm}>
        <TouchableWithoutFeedback onPress={() => setShowConfirm(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white w-11/12 max-w-sm rounded-2xl p-6">
              <Text className="text-lg font-[Poppins-SemiBold] text-center mb-6">
                Discard this post?
              </Text>
              <View className="flex-row justify-center gap-4">
                <TouchableOpacity
                  onPress={() => setShowConfirm(false)}
                  className="px-8 py-3 bg-gray-200 rounded-xl"
                >
                  <Text className="font-[Poppins-SemiBold] text-gray-800">No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/community")}
                  className="px-8 py-3 bg-red-500 rounded-xl"
                >
                  <Text className="font-[Poppins-SemiBold] text-white">Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal chọn/thêm tag - có tìm kiếm */}
      <Modal transparent visible={showTagModal} animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowTagModal(false)}>
          <View className="flex-1 bg-black/40 justify-end">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-t-3xl max-h-[80%]">
                <View className="p-5 border-b border-gray-200">
                  <Text className="text-lg font-[Poppins-Bold] text-center">Add tags</Text>
                </View>

                <View className="px-5 pt-4">
                  <TextInput
                    value={tagSearch}
                    onChangeText={setTagSearch}
                    placeholder="Search or create new tag..."
                    className="border border-gray-300 rounded-xl px-4 py-4 mb-3 font-[Poppins-Regular]"
                    autoFocus
                    onSubmitEditing={addNewTag}
                  />
                </View>

                <FlatList
                  keyboardShouldPersistTaps="always"
                  data={filteredTags}
                  keyExtractor={(item) => item}
                  contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        toggleTag(item);
                        setShowTagModal(false);
                      }}
                      className="py-3 border-b border-gray-100"
                    >
                      <Text className="text-base text-gray-800 font-[Poppins-Regular]">{item}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    tagSearch.trim() ? (
                      <TouchableOpacity
                        onPress={addNewTag}
                        className="py-8 items-center"
                      >
                        <Text className="text-[#7F56D9] font-[Poppins-Medium]">
                          + Create "{tagSearch}"
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text className="text-center text-gray-500 py-8">
                        Type to search or create a new tag
                      </Text>
                    )
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
}