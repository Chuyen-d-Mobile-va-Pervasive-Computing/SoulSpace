import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowUp,
  EllipsisVertical,
  Heart,
  MessageCircle,
} from "lucide-react-native";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ToastAndroid,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import ReportModal from "@/components/ReportModal";
import Heading from "@/components/Heading";
import PostHeader from "@/components/PostHeader";
import { mockPosts } from "@/constants/mockPosts";
import LikeListModal from "@/components/LikeListModal";

interface User {
  userId: string;
  username: string;
}

export default function CommentScreen() {
  const router = useRouter();
  const { postId, focusInput } = useLocalSearchParams();
  const [hasCommentedAnonymous, setHasCommentedAnonymous] = useState(false);
  const currentUserId = "u1";
  const [reportVisible, setReportVisible] = useState(false);
  // Lấy bài post hiện tại
  const [post, setPost] = useState(
    mockPosts.find((p) => p.id === postId) || null
  );

  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  // COMMENT LIST
  const [comments, setComments] = useState([
    {
      id: "c1",
      userId: "u1",
      username: "user 01234567",
      createdAt: "2025-01-05 11:00:00",
      content: "Bình luận mẫu 1",
      visibility: "public",
    },
    {
      id: "c2",
      userId: "u2",
      username: "user 987654321",
      createdAt: "2025-01-05 11:05:00",
      content: "Bình luận mẫu 2",
      visibility: "public",
    },
  ]);

  // Chế độ comment: public / anonymous
  const [commentMode, setCommentMode] = useState<"public" | "anonymous">("public");
  const [visibilityModalVisible, setVisibilityModalVisible] = useState(false);

  // Nếu đã chọn anonymous 1 lần → khóa luôn
  const handleChangeVisibility = (mode: "public" | "anonymous") => {
    if (hasCommentedAnonymous) return;
    setCommentMode(mode);
    setVisibilityModalVisible(false);
  };

  // Convert tất cả comment cũ về anonymous
  const convertOldCommentsToAnonymous = () => {
    setComments((prev) =>
      prev.map((c) =>
        c.userId === currentUserId
          ? { ...c, visibility: "anonymous" }
          : c
      )
    );
  };

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

  const handleReport = (content: string) => {
    console.log("Nội dung báo cáo:", content);
    setReportVisible(false);
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
        <Text className="text-lg">Post not found</Text>
      </View>
    );
  }

  // Gửi comment
  const handleSendComment = () => {
    const newComment = {
      id: "c" + Date.now(),
      userId: currentUserId,
      username: post.username,
      createdAt: new Date().toLocaleString("sv-SE").replace("T", " "),
      content: comment,
      visibility: commentMode,
    };

    setComments((prev) => [...prev, newComment]);

    // Nếu lần đầu chọn anonymous → convert comment cũ
    if (commentMode === "anonymous") {
      if (!hasCommentedAnonymous) {
        setHasCommentedAnonymous(true);
        convertOldCommentsToAnonymous();
      }
    }
    setComment("");
    Keyboard.dismiss();

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-[#FAF9FF]">
        <Heading title="Comments" />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* POST */}
          <View className="p-4 bg-white rounded-2xl border border-[#EEEEEE]">
            <View className="flex-row justify-between items-center">
              <PostHeader
                username={post.username}
                createdAt={post.createdAt}
                isAnonymous={false}
              />
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/community/topic")} 
                className="border border-[#7F56D9] px-4 py-1 rounded-full flex-row items-center mb-4 mr-8"
              >
                <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">
                  Travel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <EllipsisVertical width={20} height={20} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 font-[Poppins-Regular] text-base">
              {post.content}
            </Text>

            <View className="flex-row mt-3 gap-6">
              {/* LIKE */}
              <View className="flex-row items-center gap-1">
                <TouchableOpacity onPress={handleToggleLike}>
                  <Heart
                    width={18}
                    height={18}
                    color={post.isLiked ? "#EF4444" : "#374151"}
                    fill={post.isLiked ? "#EF4444" : "transparent"}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLikedUsers(post?.likedBy || []);
                    setLikeListVisible(true);
                  }}
                  className="flex-row items-center gap-1"
                >
                  <Text className="text-sm font-[Poppins-SemiBold] text-gray-700">
                    {post.likes}
                  </Text>
                  {post.likes > 0 && (
                    <Text className="text-sm text-gray-500">likes</Text>
                  )}
                </TouchableOpacity>
              </View>
              {/* COMMENT  */}
              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="#374151" />
                <Text className="text-sm text-gray-700">{post.comments}</Text>
              </View>
            </View>
          </View>

          {/* COMMENTS */}
          <View className="mt-4 mb-4">
            <Text className="font-[Poppins-Bold] text-lg mb-2">
              All comments
            </Text>

            {comments.map((c) => (
              <View
                key={c.id}
                className="mt-3 p-3 rounded-xl border border-[#EEEEEE] bg-white"
              >
                <PostHeader
                  username={c.username}
                  createdAt={c.createdAt}
                  isAnonymous={c.visibility === "anonymous"}
                  size="sm"
                />

                <Text className="mt-2.5 font-[Poppins-Regular] text-base ml-11">
                  {c.content}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* FOOTER */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#FAF9FF] border-t border-[#EEEEEE] p-3">
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
          <View className="flex-row items-end">
            {/* Avatar chọn chế độ */}
            <TouchableOpacity
              onPress={() => {
                if (hasCommentedAnonymous) return;
                setVisibilityModalVisible(true);
              }}
              className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center mr-2"
            >
              <Text className="text-white font-[Poppins-Bold]">
                {commentMode === "anonymous" ? "?" : currentUserId.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>

            {/* Input */}
            <TextInput
              ref={inputRef}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              placeholderTextColor="#7B7B7B"
              multiline
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                setInputHeight(Math.max(40, Math.min(h, MAX_INPUT_HEIGHT)));
              }}
              style={{
                height: Math.max(44, inputHeight),
                fontFamily: "Poppins-Regular",
              }}
              className="flex-1 bg-white rounded-2xl px-3 py-2 text-base"
              textAlignVertical="top"
            />
            <TouchableOpacity
              disabled={!comment.trim()}
              onPress={handleSendComment}
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
              <Pressable onPress={() => {
                setReportVisible(true);
                setMenuVisible(false);
              }} >
                <Text className="text-lg text-center font-[Poppins-Regular] text-red-500">
                    Report
                  </Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
      {/* VISIBILITY MODAL */}
      <Modal visible={visibilityModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={() => setVisibilityModalVisible(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>

          <View className="bg-white rounded-t-2xl p-4">
            <Text className="text-lg font-[Poppins-SemiBold] mb-4 text-center">
              Choose Comment Mode
            </Text>

            {/* PUBLIC */}
            <Pressable
              onPress={() => handleChangeVisibility("public")}
              className="flex-row items-center gap-4 py-3"
            >
              <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                <Text className="text-white font-[Poppins-Bold]">
                  {currentUserId.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text
                className={`text-lg ${
                  commentMode === "public"
                    ? "font-[Poppins-Bold]"
                    : "font-[Poppins-Regular]"
                }`}
              >
                Public
              </Text>
            </Pressable>

            {/* ANONYMOUS */}
            <Pressable
              onPress={() => handleChangeVisibility("anonymous")}
              className="flex-row items-center gap-4 py-3"
            >
              <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                <Text className="text-white font-[Poppins-Bold]">?</Text>
              </View>

              <Text
                className={`text-lg ${
                  commentMode === "anonymous"
                    ? "font-[Poppins-Bold]"
                    : "font-[Poppins-Regular]"
                }`}
              >
                Anonymous
              </Text>
            </Pressable>
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

      <ReportModal
        visible={reportVisible}
        onClose={() => {
          setReportVisible(false);
          setMenuVisible(false);
        }}
        onSubmit={handleReport}
      />

      <LikeListModal
        visible={likeListVisible}
        onClose={() => setLikeListVisible(false)}
        users={likedUsers}
        currentUserId={currentUserId}
      />
    </KeyboardAvoidingView>
  );
}