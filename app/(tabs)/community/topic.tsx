import { View, Text, TouchableOpacity, Modal, Pressable, TouchableWithoutFeedback, ScrollView, Image, ActivityIndicator } from "react-native";
import { ChevronLeft, EllipsisVertical, Heart, MessageCircle } from "lucide-react-native";
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
  userId: string;
  username: string;
  content: string;
  is_anonymous: boolean;
  topic: string;
  created_at: string;
  moderation_status: string;
  ai_scan_result: string;
  flagged_reason: string;
  detected_keywords: string;
  like_count: number;
  is_liked: boolean;
  // likedBy?: { userId: string; username: string }[];
  comment_count: number;
  is_owner: boolean;
}

export default function TopicScreen() {
  const currentUserId = "u1";
  const { topic: initialTopic, posts: postsParam } = useLocalSearchParams();
  const topicParam = Array.isArray(initialTopic) ? initialTopic[0] : initialTopic;
  const safeTopic = topicParam?.trim() || "";

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
        setSelectedTopic(safeTopic);

        // Truyền từ trang Index
        if (preloadedPosts.length > 0) {
          const filtered = preloadedPosts.filter(
            (p) => p.topic?.trim() === safeTopic
          );
          setPostList(filtered);
          setLoading(false);
          return;
        }

        // Truyền từ trang Comment
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
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
          setLoading(false);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        const formatted: Post[] = list.map((item: any) => ({
          id: item._id,
          userId: item.user_id,
          username: item.is_anonymous ? "Anonymous" : item.author_name,
          content: item.content,
          is_anonymous: item.is_anonymous,
          topic: item.hashtags?.[0]?.trim() || null,
          created_at: formatToVNTime(item.created_at),
          moderation_status: item.moderation_status,
          ai_scan_result: item.ai_scan_result, 
          flagged_reason: item.flagged_reason, 
          detected_keywords: item.detected_keywords[0],
          like_count: item.like_count || 0,
          is_liked: item.is_liked || false,
          comment_count: item.comment_count || 0,
          is_owner: item.is_owner || false,
        }));

        const filtered = formatted.filter(
          (p) => p.topic && p.topic === safeTopic
        );

        setPostList(filtered);
      } catch (err: any) {
        console.error("Error loading topic posts:", err.message || err);
      } finally {
        setLoading(false);
      }
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

  const handleDelete = (id: string) => {
    setPostList((prev) => prev.filter((p) => p.id !== id));
    setMenuVisible(false);
    setShowConfirm(false);
  };

  const handleReport = (text: string) => {
    console.log("Report:", text);
    setReportVisible(false);
    setMenuVisible(false);
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
                <PostHeader
                  username={post.username}
                  createdAt={post.created_at}
                  isAnonymous={post.is_anonymous}
                />

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
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical size={20} color="#000" />
                </TouchableOpacity>
              </View>

              <Text className="mt-3 text-base font-[Poppins-Regular]">{post.content}</Text>

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
                <Pressable onPress={() => { setReportVisible(true); setMenuVisible(false); }}>
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

      <ReportModal visible={reportVisible} onClose={() => setReportVisible(false)} onSubmit={handleReport} />
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