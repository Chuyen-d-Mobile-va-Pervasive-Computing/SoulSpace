import { useEffect, useRef, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { ArrowUp, EllipsisVertical, Heart, MessageCircle, ArrowLeft, Star } from "lucide-react-native";
import { ScrollView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Keyboard, ToastAndroid, 
        Alert, Modal, TouchableWithoutFeedback, Pressable, Image } from "react-native";
import ReportModal from "@/components/ReportModal";
import PostHeader from "@/components/PostHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LikeListModal from "@/components/LikeListModal";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface User {
  userId: string;
  username: string;
}

interface Me {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

export default function CommentScreen() {
  const router = useRouter();
  const { postId, focusInput } = useLocalSearchParams();
  const [hasCommentedAnonymous, setHasCommentedAnonymous] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const currentUserId = me ? me.id : "";
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<
    {
      id: string;
      userId: string;
      username: string;
      avatar?: string | null;
      createdAt: string;
      content: string;
      visibility: "public" | "anonymous";
    }[]
  >([]);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [commentMode, setCommentMode] = useState<"public" | "anonymous">("public");
  const [visibilityModalVisible, setVisibilityModalVisible] = useState(false);
  const [menuTarget, setMenuTarget] = useState<"post" | "comment" | null>(null);

  const scrollRef = useRef<ScrollView | null>(null);
  const inputRef = useRef<TextInput | null>(null);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(44);
  const MAX_INPUT_HEIGHT = 100;
  
  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportingTargetId, setReportingTargetId] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (focusInput === "true") {
        const timer = setTimeout(() => {
          inputRef.current?.focus();
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 700);

        return () => clearTimeout(timer);
      }
    }, [focusInput])
  );

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;
        const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch me");
        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error("Fetch me error:", err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/v1/anon-posts/${postId}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();

        const isAnonymous = data.is_anonymous || !data.author_name;
        const formatted = {
          id: data._id,
          username: isAnonymous ? "Anonymous" : data.author_name || "Unknown",
          avatar: isAnonymous ? null : data.author_avatar || null,
          role: data.author_role,
          title: data.title,
          image_url: data.image_url || null,
          content: data.content,
          createdAt: new Date(data.created_at).toLocaleString("sv-SE").replace("T", " "),
          topic: data.hashtags?.[0] || null,
          likes: data.like_count || 0,
          comments: data.comment_count || 0,
          isLiked: data.is_liked || false,
          isAnonymous,
          isOwner: data.is_owner || false,
        };
        setPost(formatted);
      } catch (err) {
        console.error("Error fetching post:", err);
        Alert.alert("Error", "Could not load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, me]);

  useEffect(() => {
    const loadComments = async () => {
      if (!postId) return;
      const list = await fetchComments(postId as string);
      setComments(list);
    };
    loadComments();
  }, [postId]);

  const likePost = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/anon-likes/${postId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch (err) {
      console.log("LIKE error:", err);
      return false;
    }
  };

  const unlikePost = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/anon-likes/${postId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.ok;
    } catch (err) {
      console.log("UNLIKE error:", err);
      return false;
    }
  };

  const handleToggleLike = async (postId: string) => {
    if (!post) return;
    const currentlyLiked = post.isLiked;
    setPost((prev: any) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));

    let ok = false;
    if (!currentlyLiked) {
      ok = await likePost(postId);
    } else {
      ok = await unlikePost(postId);
    }

    if (!ok) {
      setPost((prev: any) => ({
        ...prev,
        isLiked: currentlyLiked,
        likes: currentlyLiked ? prev.likes + 1 : prev.likes - 1,
      }));
    }
  };

  const sendCommentToServer = async (content: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/anon-comments/`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          content,
          is_preset: false,
          is_anonymous: commentMode === "anonymous",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { ok: false, data: null, message: err.detail || "Send comment failed" };
      }
      const data = await res.json();
      return { ok: true, data, message: "OK" };
    } catch (error) {
      return { ok: false, data: null, message: "Network error" };
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    const result = await sendCommentToServer(comment.trim());
    if (!result.ok) {
      Alert.alert("Error", result.message);
      return;
    }

    const serverComment = result.data;
    const newComment = {
      id: serverComment._id,
      userId: me?.id ?? "",
      username: commentMode === "anonymous" ? "Anonymous" : me?.username ?? "Unknown",
      avatar: commentMode === "anonymous" ? null : me?.avatar_url ?? null,
      createdAt: new Date(serverComment.created_at)
        .toLocaleString("sv-SE")
        .replace("T", " "),
      content: serverComment.content,
      visibility: commentMode,
      isOwner: true,
    };
    setComments((prev) => [...prev, newComment]);

    if (commentMode === "anonymous" && !hasCommentedAnonymous) {
      setHasCommentedAnonymous(true);
      setComments((prev) =>
        prev.map((c) =>
          c.userId === currentUserId ? { ...c, visibility: "anonymous" } : c
        )
      );
    }
    setPost((prev: any) => ({ ...prev, comments: prev.comments + 1 }));
    setComment("");
    Keyboard.dismiss();
    setTimeout(async () => {
      const list = await fetchComments(postId as string);
      setComments(list);
    }, 300);
  };

  const fetchComments = async (postId: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/anon-comments/${postId}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return [];

      const data = await res.json();
      return data.map((c: any) => ({
        id: c._id,
        userId: c.user_id ?? "",
        username: c.is_anonymous ? "Anonymous" : c.username ?? "Unknown",
        avatar: c.is_anonymous ? null : c.avatar_url ?? null,
        isOwner: c.is_owner ?? false,
        content: c.content,
        visibility: c.is_anonymous ? "anonymous" : "public",
        createdAt: new Date(c.created_at).toLocaleString("sv-SE").replace("T", " "),
      }));
    } catch (err) {
      console.error("Fetch comments error:", err);
      return [];
    }
  };

  const deletePostOnServer = async (postId: string): Promise<{ ok: boolean; message: string }> => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}/api/v1/anon-posts/${postId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) return { ok: true, message: "Deleted" };
      const err = await res.json();
      return { ok: false, message: err.detail || "Delete failed" };
    } catch (err) {
      return { ok: false, message: "Network error" };
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    setShowConfirm(false);
    setMenuVisible(false);

    const result = await deletePostOnServer(post.id);
    if (!result.ok) {
      Alert.alert("Error", result.message);
      return;
    }

    ToastAndroid.show("Post deleted", ToastAndroid.SHORT);
    router.replace("/(tabs)/community");
  };

  const deleteCommentOnServer = async (commentId: string): Promise<{ ok: boolean; message: string }> => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        return { ok: false, message: "No authentication token" };
      }
      const res = await fetch(`${API_BASE}/api/v1/anon-comments/${commentId}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        return { ok: true, message: "Comment deleted" };
      }
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: err.detail || "Delete failed" };
    } catch (err) {
      console.error("Delete comment error:", err);
      return { ok: false, message: "Network error" };
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    setMenuVisible(false);
    const result = await deleteCommentOnServer(selectedComment.id);
    if (!result.ok) {
      Alert.alert("Error", result.message);
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
    setPost((prev: any) => ({ ...prev, comments: prev.comments - 1 }));
    ToastAndroid.show("Comment deleted", ToastAndroid.SHORT);
    setSelectedComment(null);
  };

  const formatUTCtoLocal = (utcString: string) => {
    const d = new Date(utcString);
    if (isNaN(d.getTime())) return "";
    return new Date(d.getTime() + 7 * 60 * 60 * 1000)
      .toLocaleString("sv-SE")
      .replace("T", " ");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Post not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 bg-[#FAF9FF]">
        <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push("/(tabs)/community")}>
              <ArrowLeft width={36} height={36} />
            </TouchableOpacity>
            <Text
              className="ml-3 text-2xl text-[#7F56D9]"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Comment
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* POST */}
          <View className="p-4 bg-white rounded-2xl border border-[#EEEEEE] mb-4">
            <View className="flex-row justify-between items-center">
              <View className="relative">
                <PostHeader
                  username={post.username}
                  avatarUrl={post.avatar}
                  createdAt={post.createdAt}
                  isAnonymous={!post.avatar && post.username === "Anonymous"}
                />
                {post.role === "expert" && (
                  <View className="absolute -top-1 left-8 bg-[#F59E0B] p-1 rounded-full">
                    <Star size={10} color="white" fill="white" />
                  </View>
                )}
              </View>
              {post.topic && (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/community/topic",
                      params: { topic: post.topic },
                    })
                  }
                  className="border border-[#7F56D9] px-4 py-1 rounded-full flex-row items-center mb-4 mr-4"
                >
                  <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">
                    {post.topic}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => { setMenuTarget("post"); setMenuVisible(true); }} >
                <EllipsisVertical width={20} height={20} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 text-base font-[Poppins-Regular]">{post.content}</Text>
            {post.title && (
              <Text className="mt-3 font-[Poppins-Bold]">{post.title}</Text>
            )}
            {post.image_url && (
              <Image
                source={{ uri: post.image_url }}
                className="w-full h-64 rounded-xl mt-3"
                resizeMode="contain"
              />
            )}

            <View className="flex-row mt-3 gap-6 items-center">
              <TouchableOpacity onPress={() => handleToggleLike(post.id)} className="flex-row items-center gap-1">
                <Heart
                  width={18}
                  height={18}
                  color={post.isLiked ? "#EF4444" : "#374151"}
                  fill={post.isLiked ? "#EF4444" : "transparent"}
                />
                <Text className="ml-1">{post.likes}</Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="#374151" />
                <Text className="ml-1">{post.comments}</Text>
              </View>
            </View>
          </View>

          {/* COMMENTS */}
          <View className="mb-20">
            <Text className="font-[Poppins-Bold] text-lg mb-3">All comments</Text>
            {comments.length === 0 ? (
              <Text className="font-[Poppins-Regular] mt-10 text-center text-gray-500">
                No comments yet. Be the first to comment!
              </Text>
            ) : null}
            {comments.map((c) => (
              <View key={c.id} className="mt-3 p-3 rounded-xl border border-[#EEEEEE] bg-white">
                <View className="flex-row justify-between">
                  <PostHeader
                    username={c.visibility === "anonymous" ? undefined : c.username}
                    avatarUrl={c.visibility === "anonymous" ? undefined : c.avatar ?? undefined}
                    createdAt={formatUTCtoLocal(c.createdAt)}
                    isAnonymous={c.visibility === "anonymous"}
                    size="sm"
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedComment(c);
                      setMenuTarget("comment");
                      setMenuVisible(true);
                    }}
                  >
                    <EllipsisVertical size={18} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text className="mt-2.5 font-[Poppins-Regular] text-base ml-10">
                  {c.content}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* FOOTER: input comment */}
        <View className="absolute bottom-0 left-0 right-0 bg-[#FAF9FF] border-t border-[#EEEEEE] p-3">
          <View className="flex-row items-end">
            <TouchableOpacity
              onPress={() => {
                if (hasCommentedAnonymous) return;
                setVisibilityModalVisible(true);
              }}
            >
              <View className="w-10 h-10 rounded-full mr-1 mb-2 justify-center items-center bg-gray-300 overflow-hidden">
                {commentMode === "anonymous" ? (
                  <Text className="text-white text-xl font-[Poppins-Bold]">?</Text>
                ) : me?.avatar_url ? (
                  <Image
                    source={{ uri: me.avatar_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-xl font-[Poppins-Bold]">
                    {me?.username?.charAt(0).toUpperCase() ?? "U"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              placeholderTextColor="#7B7B7B"
              multiline
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                setInputHeight(Math.max(44, Math.min(h, MAX_INPUT_HEIGHT)));
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

       {/* MENU: Delete / Report */}
        <Modal visible={menuVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={() => {
            setMenuVisible(false);
            setMenuTarget(null);
            setSelectedComment(null);
          }}>
            <View className="flex-1 bg-black/50" />
          </TouchableWithoutFeedback>

          <View className="bg-white rounded-t-3xl p-2">
            {/* POST */}
            {menuTarget === "post" && (
              <>
                {post.isOwner ? (
                  <Pressable
                    onPress={() => {
                      setMenuVisible(false);
                      setShowConfirm(true);
                      handleDelete();
                    }}
                    className="py-3"
                  >
                    <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">
                      Delete Post
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setReportingTargetId(post.id);
                      setReportVisible(true);
                      setMenuVisible(false);
                    }}
                    className="py-3"
                  >
                    <Text className="text-red-500 text-lg font-[Poppins-Regular] text-center">
                      Report Post
                    </Text>
                  </Pressable>
                )}
              </>
            )}
            {/* COMMENT */}
            {menuTarget === "comment" && selectedComment && (
              <>
                {selectedComment.isOwner ? (
                  <Pressable
                    onPress={() => {
                      setMenuVisible(false);
                      handleDeleteComment();
                    }}
                    className="py-3"
                  >
                    <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">
                      Delete Comment
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      setReportingTargetId(selectedComment.id);
                      setReportVisible(true);
                      setMenuVisible(false);
                    }}
                    className="py-3"
                  >
                    <Text className="text-red-500 text-lg font-[Poppins-Regular] text-center">
                      Report Comment
                    </Text>
                  </Pressable>
                )}
              </>
            )}
          </View>
        </Modal>

        <ReportModal
          visible={reportVisible}
          onClose={() => setReportVisible(false)}
          targetId={reportingTargetId}
          targetType={menuTarget === "post" ? "post" : "comment"}
        />

        <LikeListModal
          visible={likeListVisible}
          onClose={() => setLikeListVisible(false)}
          users={likedUsers}
          currentUserId={currentUserId}
        />

        {/* Visibility select modal for anonymous/public */}
        <Modal visible={visibilityModalVisible} transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback onPress={() => setVisibilityModalVisible(false)}>
              <View className="flex-1" />
            </TouchableWithoutFeedback>
            <View className="bg-white rounded-t-2xl p-4">
              <Text className="text-lg font-[Poppins-SemiBold] mb-4 text-center">Choose Comment Mode</Text>
              <Pressable
                onPress={() => {
                  setCommentMode("public");
                  setVisibilityModalVisible(false);
                }}
                className="flex-row items-center gap-4 py-3"
              >
                <Image
                  source={{ uri: me?.avatar_url ?? me?.username?.charAt(0).toUpperCase() ?? "U" }}
                  className="w-10 h-10 rounded-full mt-3"
                  resizeMode="cover"
                />
                <Text className={`text-lg ${commentMode === "public" ? "font-[Poppins-Bold]" : "font-[Poppins-Regular]"}`}>{me?.username ?? "Public"}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setCommentMode("anonymous");
                  setVisibilityModalVisible(false);
                }}
                className="flex-row items-center gap-4 py-3"
              >
                <View className="w-10 h-10 bg-gray-300 rounded-full justify-center items-center">
                  <Text className="text-white font-[Poppins-Bold]">?</Text>
                </View>
                <Text className={`text-lg ${commentMode === "anonymous" ? "font-[Poppins-Bold]" : "font-[Poppins-Regular]"}`}>Anonymous</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}