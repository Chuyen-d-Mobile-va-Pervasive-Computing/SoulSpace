import { useEffect, useRef, useState } from "react";
import Heading from "@/components/Heading";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowUp, EllipsisVertical, Heart, MessageCircle } from "lucide-react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid, Modal, TouchableWithoutFeedback, Pressable } from "react-native";

export default function CommentScreen() {
  const router = useRouter();
  const { postId, focusInput } = useLocalSearchParams<{
    postId: string;
    focusInput?: string;
  }>();

  const currentUserId = "u1";
  const postsList = [
    {
      id: "p1",
      userId: "u1",
      username: "user 01234567",
      createdAt: "2025-01-01 12:20:20",
      content: "Tôi vui lắm",
      likes: 10,
      comments: 10,
      isInterested: false,
      isLiked: false,
    },
    {
      id: "p2",
      userId: "u2",
      username: "user 987654321",
      createdAt: "2025-01-02 10:15:00",
      content: "Hôm nay trời đẹp",
      likes: 2,
      comments: 1,
      isInterested: true,
      isLiked: true,
    },
  ];

  const [post, setPost] = useState<any>(postsList.find((p) => p.id === postId) || null);

  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(44);
  const MAX_INPUT_HEIGHT = 100;

  const presetRepliesMap: Record<string, string[]> = {
    vui: ["That's awesome!", "Happy for you!", "Keep smiling!"],
    buồn: ["You're not alone", "Stay strong", "Better days will come"],
    default: ["Thank you for sharing", "I understand", "Sending love ❤️"],
  };

  const getPresetReplies = (content?: string) => {
    const c = (content || "").toLowerCase();
    if (c.includes("vui")) return presetRepliesMap["vui"];
    if (c.includes("buồn")) return presetRepliesMap["buồn"];
    return presetRepliesMap["default"];
  };

  const presetReplies = getPresetReplies(post?.content);

  useEffect(() => {
    if (focusInput === "true" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [focusInput]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleToggleLike = () => {
    setPost((prev: any) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleToggleInterested = () => {
    setPost((prev: any) => {
      const updated = { ...prev, isInterested: !prev.isInterested };
      ToastAndroid.show(
        updated.isInterested
          ? "You will see more posts like this."
          : "You will see fewer posts like this.",
        ToastAndroid.SHORT
      );
      return updated;
    });
    setMenuVisible(false);
  };

  const handleDelete = () => {
    ToastAndroid.show("Post deleted", ToastAndroid.SHORT);
    setShowConfirm(false);
    setMenuVisible(false);
    router.back();
  };

  const safeHeight = Math.min(inputHeight, MAX_INPUT_HEIGHT);

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-[Poppins-SemiBold]">Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-[#FAF9FF]">
        <Heading title="Comments" />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* POST */}
          <View className="p-4 bg-white rounded-2xl border border-[#EEEEEE]">
            <View className="flex-row justify-between">
              <View>
                <Text className="font-[Poppins-SemiBold] text-base">
                  {post.username}
                </Text>
                <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-sm mt-1">
                  {post.createdAt}
                </Text>
              </View>

              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <EllipsisVertical width={20} height={20} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 font-[Poppins-Regular] text-base">
              {post.content}
            </Text>

            <View className="flex-row mt-3 gap-6">
              <TouchableOpacity
                className="flex-row items-center gap-1"
                onPress={handleToggleLike}
              >
                <Heart
                  width={18}
                  height={18}
                  color={post.isLiked ? "red" : "black"}
                  fill={post.isLiked ? "red" : "transparent"}
                />
                <Text className="font-[Poppins-Regular] text-sm">
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="black" />
                <Text className="font-[Poppins-Regular] text-sm">
                  {post.comments}
                </Text>
              </View>
            </View>
          </View>

          {/* COMMENTS */}
          <View className="mt-4 mb-4">
            <Text className="font-[Poppins-Bold] text-lg mb-2">
              All comments
            </Text>

            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                className="mt-3 ml-2 p-3 rounded-xl border border-[#EEEEEE] bg-white"
              >
                <Text className="font-[Poppins-SemiBold] text-base">
                  user000{i}
                </Text>
                <Text className="text-[#7B7B7B] font-[Poppins-Regular] text-sm mt-1">
                  12:20:20 26/4/2025
                </Text>
                <Text className="mt-2.5 font-[Poppins-Regular] text-base">
                  Bình luận mẫu {i + 1}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View className="bg-[#FAF9FF] border-t border-[#EEEEEE]">
          {presetReplies.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="pb-2 pl-2"
            >
              {presetReplies.map((reply, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setComment(reply)}
                  className="bg-white h-10 px-4 rounded-full justify-center mr-2"
                >
                  <Text className="font-[Poppins-Regular] text-base">
                    {reply}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View className="flex-row items-end px-4 mb-2">
            <TextInput
              ref={inputRef}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment"
              placeholderTextColor="#7B7B7B"
              multiline
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                setInputHeight(Math.max(40, Math.min(h, MAX_INPUT_HEIGHT)));
              }}
              style={{
                height: Math.max(44, safeHeight),
                fontFamily: "Poppins-Regular",
              }}
              className="flex-1 bg-white rounded-2xl px-3 py-2 text-base"
              textAlignVertical="top"
            />
            <TouchableOpacity
              disabled={!comment.trim()}
              onPress={() => {
                console.log("Send:", comment);
                setComment("");
                Keyboard.dismiss();
              }}
              className="ml-2"
              style={{ opacity: comment.trim() ? 1 : 0.4 }}
            >
              <View className="w-10 h-10 items-center justify-center bg-[#7f56d9] rounded-full">
                <ArrowUp size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>

          <View className="bg-white rounded-t-2xl p-4">
            {post.userId === currentUserId ? (
              <Pressable onPress={() => setShowConfirm(true)} className="py-2">
                <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">
                  Delete
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={handleToggleInterested} className="py-2">
                <Text className="text-lg text-center">
                  {post.isInterested ? "Ignore" : "Interested"}
                </Text>
              </Pressable>
            )}

            {/* <Pressable
              onPress={() => setMenuVisible(false)}
              className="py-3 mt-1"
            >
              <Text className="text-center font-[Poppins-Bold]">Cancel</Text>
            </Pressable> */}
          </View>
        </View>
      </Modal>

      {/* DELETE CONFIRM */}
      <Modal visible={showConfirm} transparent>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowConfirm(false);
            setMenuVisible(false);
          }}
        >
          <View className="flex-1 bg-black/60 justify-center items-center">
            <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
              <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
                Are you sure you want to delete this post?
              </Text>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirm(false);
                    setMenuVisible(false);
                  }}
                  className="bg-gray-300 px-8 py-4 rounded-xl"
                >
                  <Text className="text-base font-[Poppins-SemiBold] text-gray-800">
                    No
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
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
    </KeyboardAvoidingView>
  );
}