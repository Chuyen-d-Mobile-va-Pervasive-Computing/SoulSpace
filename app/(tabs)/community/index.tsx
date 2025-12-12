import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import PostHeader from "@/components/PostHeader";
import { useRouter } from "expo-router";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  SlidersHorizontal,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Alert,
} from "react-native";
import ReportModal from "@/components/ReportModal";
import Logo from "@/assets/images/logo.svg";
import SvgAvatar from "@/components/SvgAvatar";
import LikeListModal from "@/components/LikeListModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface User {
  userId: string;
  username: string;
}

export default function CommunityScreen() {
  const router = useRouter();
  const currentUserId = "u1";

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportingTargetId, setReportingTargetId] = useState<string>("");
  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const user = {
    username: "SoulSpace",
    avatar: "https://i.pravatar.cc/300",
  };

  const formatToVNTime = (utcString: string) => {
    const safeUtc = utcString.endsWith("Z") ? utcString : utcString + "Z";
    const d = new Date(safeUtc);
    const pad = (n: number) => String(n).padStart(2, "0");
    // +7 giờ -> giờ Việt Nam
    const local = new Date(d.getTime() + 7 * 60 * 60 * 1000);

    return (
      local.getUTCFullYear() +
      "-" +
      pad(local.getUTCMonth() + 1) +
      "-" +
      pad(local.getUTCDate()) +
      " " +
      pad(local.getUTCHours()) +
      ":" +
      pad(local.getUTCMinutes()) +
      ":" +
      pad(local.getUTCSeconds())
    );
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/v1/anon-posts/`, {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item._id,
          userId: item.user_id,
          username: item.is_anonymous ? "Anonymous" : item.author_name,
          content: item.content,
          topic: item.hashtags?.[0],
          created_at: formatToVNTime(item.created_at),
          moderationStatus: item.moderation_status,
          scanResult: item.ai_scan_result, 
          flag: item.flagged_reason, 
          detectedKeywords: item.detected_keywords[0],
          likes: item.like_count,
          isLiked: item.is_liked,
          // likedBy: [],
          comments: item.comment_count,
          isOwner: item.is_owner,
        }));

        setPosts(formatted);
      } catch (error) {
        console.log("Lỗi fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleReport = (content: string) => {
    console.log("Nội dung báo cáo:", content);
    setReportVisible(false);
    setMenuVisible(false);
    setSelectedPost(null);
  };

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
    const target = posts.find(p => p.id === postId);
    if (!target) return;

    const currentlyLiked = target.isLiked;
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
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
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: currentlyLiked,
                likes: currentlyLiked ? p.likes + 1 : p.likes - 1,
              }
            : p
        )
      );
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Forum" />

      <View className="flex-1 px-4 mt-4">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between w-full mb-3">
            {/* Avatar */}
            <View className="mr-3">
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
            </View>
            {/* Input */}
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/community/add")}
              className="flex-1 flex-row items-center px-4 py-3 rounded-2xl border border-gray-300 bg-white"
              style={{ maxWidth: "90%" }}
            >
              <Text className="text-gray-500 text-base font-[Poppins-Regular]">
                Write something...
              </Text>
            </TouchableOpacity>
            {/* Filter */}
            <TouchableOpacity
              onPress={() => setFilterVisible(true)}
              className="ml-2"
            >
              <SlidersHorizontal width={20} height={20} color="black" />
            </TouchableOpacity>
          </View>

          {posts.map((post) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/community/comment",
                  params: { postId: post.id, focusInput: "false" },
                })
              }
              key={post.id}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EEEEEE]"
            >
              {/* Header */}
              <View className="flex-row justify-between">
                <PostHeader
                  username={post.username}
                  createdAt={post.created_at}
                  isAnonymous={false}
                />

                {post.topic && (
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/community/topic",
                        params: { topic: post.topic },
                      });
                    }}
                    className="border border-[#7F56D9] px-4 rounded-full flex-row items-center mb-4 mr-8"
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
                  <EllipsisVertical width={20} height={20} color="black" />
                </TouchableOpacity>
              </View>
              {/* Content */}
              <Text className="text-base mt-3 font-[Poppins-Regular]">
                {post.content}
              </Text>
              {/* Interaction */}
              <View className="flex-row mt-3 gap-6">
                <View className="flex-row items-center gap-6">
                  {/* LIKE */}
                  <View className="flex-row items-center gap-1">
                    <TouchableOpacity onPress={() => handleToggleLike(post.id)}>
                      <Heart
                        width={18}
                        height={18}
                        color={post.isLiked ? "#EF4444" : "#374151"}
                        fill={post.isLiked ? "#EF4444" : "transparent"}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setLikedUsers(post.likedBy || []);
                        setLikeListVisible(true);
                      }}
                      className="flex-row items-center gap-1"
                    >
                      <Text className="text-sm font-[Poppins-SemiBold] text-gray-700">
                        {post.likes}
                      </Text>
                      {post.likes > 0 && (
                        <Text className="text-sm text-gray-500 font-[Poppins-Regular]">likes</Text>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* COMMENT */}
                  <TouchableOpacity
                    className="flex-row items-center gap-1"
                    onPress={() => router.push({ pathname: "/(tabs)/community/comment", params: { postId: post.id, focusInput: "true" } })}
                  >
                    <MessageCircle width={18} height={18} color="#374151" />
                    <Text className="text-sm text-gray-700">{post.comments}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filter */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setFilterVisible(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="w-80 bg-white p-6 rounded-2xl">
              <Text className="text-lg font-[Poppins-Bold] mb-4">Sort</Text>
              <TagSelector
                options={[
                  { id: 2025, name: "2025" },
                  { id: 2024, name: "2024" },
                  { id: 2023, name: "2023" },
                ]}
                multiSelect={false}
                onChange={() => {}}
              />

              <Pressable
                className="mt-4 bg-[#7F56D9] py-2 rounded-xl"
                onPress={() => setFilterVisible(false)}
              >
                <Text className="text-center text-white font-[Poppins-Bold]">
                  Apply
                </Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Menu */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>
          <View className="bg-white rounded-t-2xl p-4">
            {selectedPost?.isOwner ? (
              <Pressable onPress={() => setShowConfirm(true)}>
                <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">
                  Delete
                </Text>
              </Pressable>
            ) : (
            <Pressable 
              onPress={() => {
                setReportingTargetId(selectedPost.id)
                setReportVisible(true);
                setMenuVisible(false);
              }}
            >
              <Text className="text-lg text-center font-[Poppins-Regular] text-red-500">
                Report
              </Text>
            </Pressable>
            )}
          </View>
        </View>
      </Modal>

      {/* Confirm delete */}
      <Modal transparent visible={showConfirm}>
        <TouchableWithoutFeedback
          onPress={() => {
            setShowConfirm(false);
            setMenuVisible(false);
          }}
        >
          <View className="flex-1 bg-black/60 justify-center items-center">
            <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
              <Text className="text-lg font-[Poppins-SemiBold] mb-6">
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
                  <Text className="text-base font-[Poppins-SemiBold]">
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(selectedPost.id)}
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
        onClose={() => setReportVisible(false)}
        targetId={reportingTargetId}
      />

      <LikeListModal
        visible={likeListVisible}
        onClose={() => setLikeListVisible(false)}
        users={likedUsers}
        currentUserId={currentUserId}
      />
    </View>
  );
}