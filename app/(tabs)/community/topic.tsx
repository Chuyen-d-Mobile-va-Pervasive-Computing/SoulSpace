import { View, Text, TouchableOpacity, Modal, Pressable, TouchableWithoutFeedback, ScrollView, Image, ActivityIndicator, Alert } from "react-native";
import { ChevronLeft, EllipsisVertical, Heart, MessageCircle, Star } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PostHeader from "@/components/PostHeader";
import ReportModal from "@/components/ReportModal";
import LikeListModal from "@/components/LikeListModal";
import TopicPickerModal from "@/components/TopicPickerModal";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface Post {
  id: string;
  username: string;
  avatar: string | null;
  role: string;
  title: string;
  image_url?: string | null;
  content: string;
  is_anonymous: boolean;
  topic: string | null;
  created_at: string;
  like_count: number;
  is_liked: boolean;
  comment_count: number;
  is_owner: boolean;
}

interface Me {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
}

export default function TopicScreen() {
  const [me, setMe] = useState<Me | null>(null);
  const currentUserId = me ? me.id : "";
  const { topic: initialTopic, posts: postsParam } = useLocalSearchParams();
  const topicParam = Array.isArray(initialTopic) ? initialTopic[0] : initialTopic;
  const safeTopic = topicParam?.trim() || "";
  const [menuTarget, setMenuTarget] = useState<"post" | "comment" | null>(null);

  const preloadedPosts: Post[] = postsParam
    ? JSON.parse(postsParam as string)
    : [];

  const [loading, setLoading] = useState(true);
  const [postList, setPostList] = useState<Post[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>(safeTopic);

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportingTargetId, setReportingTargetId] = useState<string>("");
  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState<any[]>([]);
  const [topicPickerVisible, setTopicPickerVisible] = useState(false);

  const user = {
    username: "SoulSpace",
    avatar: "https://i.pravatar.cc/300",
  };

  const formatToVNTime = (utcString: string) => {
    const safeUtc = utcString.endsWith("Z") ? utcString : utcString + "Z";
    const d = new Date(safeUtc);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);

    return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(
      local.getUTCDate()
    )} ${pad(local.getUTCHours())}:${pad(local.getUTCMinutes())}:${pad(
      local.getUTCSeconds()
    )}`;
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setSelectedTopic(safeTopic || "All");

        if (postsParam && typeof postsParam === "string") {
          try {
            const parsed = JSON.parse(postsParam);
            if (Array.isArray(parsed)) {
              const formatted = parsed.map(formatPost).filter(p => p.topic === safeTopic);
              setPostList(formatted);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn("Failed to parse preloaded posts, falling back to API");
          }
        }

        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          setPostList([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/v1/anon-posts/`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Fetch posts failed:", res.status);
          setPostList([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const formatted = list.map(formatPost);
        const filtered = safeTopic
          ? formatted.filter(p => p.topic === safeTopic)
          : formatted;

        setPostList(filtered);
      } catch (err: any) {
        console.error("Error loading topic posts:", err);
        setPostList([]);
      } finally {
        setLoading(false);
      }
    };

    const formatPost = (item: any): Post => {
      const isAnonymous = item.is_anonymous || item.author_name === "Anonymous" || !item.author_name;
      return {
        id: item._id,
        username: isAnonymous ? "Anonymous" : item.author_name || "Unknown",
        avatar: isAnonymous ? null : item.author_avatar || null,
        role: item.author_role,
        title: item.title,
        image_url: item.image_url || null,
        content: item.content || "",
        is_anonymous: isAnonymous,
        topic: item.hashtags?.[0]?.trim() || null,
        created_at: formatToVNTime(item.created_at),
        like_count: item.like_count || 0,
        is_liked: item.is_liked || false,
        comment_count: item.comment_count || 0,
        is_owner: item.is_owner || false,
      };
    };

    loadPosts();
  }, [safeTopic, postsParam]);

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

      if (!res.ok) return false;

      return true;
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
    const target = postList.find(p => p.id === postId);
    if (!target) return;

    const currentlyLiked = target.is_liked;
    setPostList(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              is_liked: !p.is_liked,
              like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1,
            }
          : p
      )
    );

    let ok = false;

    if (!currentlyLiked) {
      ok = await likePost(postId);
    } else {
      ok = await unlikePost(postId);
    }

    if (!ok) {
      setPostList(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                is_liked: currentlyLiked,
                like_count: currentlyLiked ? p.like_count + 1 : p.like_count - 1,
              }
            : p
        )
      );
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

      if (res.ok) {
        return { ok: true, message: "Deleted" };
      }
      const error = await res.json();
      return { ok: false, message: error.detail || "Delete failed" };
    } catch (err) {
      return { ok: false, message: "Network error" };
    }
  };

  const handleDelete = async (id: string) => {
    setShowConfirm(false);
    setMenuVisible(false);
    
    const result = await deletePostOnServer(id);
    if (!result.ok) {
      Alert.alert("Error", result.message);
      return;
    }
    setPostList(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF9FF]">
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="items-center flex-row mr-8 ml-2 mt-10 mb-4 gap-3">
        <TouchableOpacity onPress={() => router.push("/(tabs)/community")}>
          <ChevronLeft size={28}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTopicPickerVisible(true)}
          className="flex-1 items-center py-3 rounded-2xl bg-gray-200"
        >
          <Text className="font-[Poppins-SemiBold]">
            {selectedTopic}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center border-b border-gray-200 pb-4 mx-4">
        <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full mr-3" />
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/community/add",
              params: { tag: selectedTopic },
            })
          }
        >
          <Text className="text-gray-500 font-[Poppins-Regular]">
            Post about {selectedTopic}...
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post List */}
      {postList.length === 0 ? (
        <View className="items-center mt-20">
          <Text className="text-gray-500 font-[Poppins-Regular] text-base">
            There are no posts for "{selectedTopic}" yet.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 120, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {postList.map((post) => (
            <TouchableOpacity
              key={post.id}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/community/comment",
                  params: { postId: post.id, focusInput: "false" },
                })
              }
              className="p-4 bg-white rounded-2xl border border-[#EEEEEE]"
            >
              <View className="flex-row justify-between items-start">
                <View className="relative">
                  <PostHeader
                    username={post.username}
                    avatarUrl={post.avatar || undefined}
                    createdAt={post.created_at}
                    isAnonymous={post.is_anonymous}
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
                        params: {
                          topic: post.topic,
                          posts: JSON.stringify(postList.filter((p) => p.topic === post.topic)),
                        },
                      })
                    }
                    className="border border-[#7F56D9] px-4 py-1 rounded-full"
                  >
                    <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">
                      {post.topic}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setSelectedPost(post);
                    setMenuTarget("post");
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical size={20} color="#000" />
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
                  resizeMode="cover"
                />
              )}

              <View className="flex-row items-center mt-4 gap-8">
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity onPress={() => handleToggleLike(post.id)}>
                    <Heart
                      size={18}
                      color={post.is_liked ? "#EF4444" : "#374151"}
                      fill={post.is_liked ? "#EF4444" : "transparent"}
                    />
                  </TouchableOpacity>
                  <Text className="text-sm font-[Poppins-SemiBold] text-gray-700">
                    {post.like_count}
                  </Text>
                </View>

                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/community/comment",
                      params: { postId: post.id, focusInput: "true" },
                    })
                  }
                >
                  <MessageCircle size={18} color="#374151" />
                  <Text className="text-sm text-gray-700">{post.comment_count}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Modals */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-2xl p-4">
              {selectedPost?.is_owner ? (
                <Pressable onPress={() => setShowConfirm(true)}>
                  <Text className="text-red-500 text-center text-lg font-[Poppins-Bold]">Delete</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    if (selectedPost) {
                      setReportingTargetId(selectedPost.id);
                      setReportVisible(true);
                      setMenuVisible(false);
                    }
                  }}
                >
                  <Text className="text-red-500 text-center text-lg font-[Poppins-Regular]">Report</Text>
                </Pressable>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal transparent visible={showConfirm}>
        <TouchableWithoutFeedback onPress={() => setShowConfirm(false)}>
          <View className="flex-1 bg-black/60 justify-center items-center">
            <View className="bg-white w-4/5 rounded-2xl p-6">
              <Text className="text-lg font-[Poppins-SemiBold] text-center mb-6">
                Are you sure you want to delete this post?
              </Text>
              <View className="flex-row justify-center gap-4">
                <TouchableOpacity onPress={() => setShowConfirm(false)} className="bg-gray-300 px-8 py-3 rounded-xl">
                  <Text className="font-[Poppins-SemiBold]">No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => selectedPost && handleDelete(selectedPost.id)}
                  className="bg-red-500 px-8 py-3 rounded-xl"
                >
                  <Text className="font-[Poppins-SemiBold] text-white">Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ReportModal visible={reportVisible} onClose={() => setReportVisible(false)} targetId={reportingTargetId} targetType={menuTarget === "post" ? "post" : "comment"} />
      <LikeListModal visible={likeListVisible} onClose={() => setLikeListVisible(false)} users={likedUsers} currentUserId={currentUserId} />
      <TopicPickerModal
        visible={topicPickerVisible}
        onClose={() => setTopicPickerVisible(false)}
        onSelect={(newTopic) => {
          setSelectedTopic(newTopic);
          if (preloadedPosts.length > 0) {
            setPostList(preloadedPosts.filter((p) => p.topic?.trim() === newTopic.trim()));
          }
          setTopicPickerVisible(false);
        }}
      />
    </View>
  );
}