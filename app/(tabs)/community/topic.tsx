import { View, Text, TouchableOpacity, Modal, Pressable, TouchableWithoutFeedback, ScrollView } from "react-native";
import { ChevronLeft, EllipsisVertical, Heart, MessageCircle } from "lucide-react-native";
import { router } from "expo-router";
import { useState } from "react";
import { mockPosts } from "@/constants/mockPosts";
import PostHeader from "@/components/PostHeader";
import ReportModal from "@/components/ReportModal";
import LikeListModal from "@/components/LikeListModal";

interface User {
  userId: string;
  username: string;
}

export default function TopicScreen() {
  const currentUserId = "u1";
  const [posts, setPosts] = useState(mockPosts);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const [likeListVisible, setLikeListVisible] = useState(false);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
        : p
      )
    );
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setMenuVisible(false);
    setShowConfirm(false);
  };

  const handleReport = (content: string) => {
    console.log("Nội dung báo cáo:", content);
    setReportVisible(false);
    setMenuVisible(false);
    setSelectedPost(null);
  };

  return(
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="items-center flex-row mr-8 ml-2 py-10 gap-3">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28}/>
        </TouchableOpacity>
        <View className="flex-1 items-center py-3 rounded-2xl bg-gray-300">
          <Text>Travel</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120, gap: 12 }}
        showsVerticalScrollIndicator={false}
        className="px-4"
      >
        {posts.map((post) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
              pathname: "/(tabs)/community/comment",
              params: { postId: post.id, focusInput: "false" },
            })}
            key={post.id}
            className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#EEEEEE]"
          >
            {/* Header */}
            <View className="flex-row justify-between">
              <PostHeader
                username={post.username}
                createdAt={post.createdAt}
                isAnonymous={false}
              />
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/community/topic")} 
                className="border border-[#7F56D9] px-4 rounded-full flex-row items-center mb-4 mr-8"
              >
                <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-sm">
                  Travel
                </Text>
              </TouchableOpacity>

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
                      <Text className="text-sm text-gray-500">likes</Text>
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

      {/* Menu */}
      <Modal visible={menuVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View className="flex-1" />
          </TouchableWithoutFeedback>
          <View className="bg-white rounded-t-2xl p-4">
            {selectedPost?.userId === currentUserId ? (
              <Pressable onPress={() => setShowConfirm(true)}>
                <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">Delete</Text>
              </Pressable>
              ) : (
              <Pressable 
                onPress={() => {
                  setReportVisible(true);
                  setMenuVisible(false);
                }}
              >
                <Text className="text-lg text-center font-[Poppins-Regular] text-red-500">Report</Text>
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
                Delete this post?
              </Text>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirm(false);
                    setMenuVisible(false);
                  }}
                  className="bg-gray-300 px-8 py-4 rounded-xl"
                >
                  <Text className="text-base font-[Poppins-SemiBold]">No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(selectedPost.id)}
                  className="bg-red-500 px-8 py-4 rounded-xl"
                >
                  <Text className="text-base font-[Poppins-SemiBold] text-white">Yes</Text>
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
          setSelectedPost(null);
        }}
        onSubmit={handleReport}
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