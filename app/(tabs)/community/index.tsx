import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import PostHeader from "@/components/PostHeader";
import { useRouter } from "expo-router";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Plus,
  SlidersHorizontal,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { mockPosts } from "@/constants/mockPosts";

export default function CommunityScreen() {
  const router = useRouter();
  const currentUserId = "u1";

  const [posts, setPosts] = useState(mockPosts);
  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setMenuVisible(false);
    setShowConfirm(false);
  };

  const handleToggleInterested = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isInterested: !p.isInterested } : p
      )
    );

    const post = posts.find((p) => p.id === id);
    ToastAndroid.show(
      post?.isInterested
        ? "You will see fewer posts like this."
        : "You will see more posts like this.",
      ToastAndroid.SHORT
    );

    setMenuVisible(false);
  };

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

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Forum" />

      <View className="flex-1 px-4 mt-4">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            className="flex-row justify-end items-center mb-4"
            onPress={() => setFilterVisible(true)}
          >
            <Text className="text-black font-[Poppins-Bold] text-xs mr-2">
              Filter
            </Text>
            <SlidersHorizontal width={20} height={20} color="black" />
          </TouchableOpacity>

          {posts.map((post) => (
            <View
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
                  onPress={() => {
                    setSelectedPost(post);
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical width={20} height={20} color="black" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/community/comment",
                    params: { postId: post.id, focusInput: "false" },
                  })
                }
              >
                <Text className="text-base mt-3 font-[Poppins-Regular]">
                  {post.content}
                </Text>
              </TouchableOpacity>

              {/* Interaction */}
              <View className="flex-row mt-3 gap-6">
                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  onPress={() => handleToggleLike(post.id)}
                >
                  <Heart
                    width={18}
                    height={18}
                    color={post.isLiked ? "red" : "black"}
                    fill={post.isLiked ? "red" : "transparent"}
                  />
                  <Text className="text-sm">{post.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center gap-1"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/community/comment",
                      params: { postId: post.id, focusInput: "true" },
                    })
                  }
                >
                  <MessageCircle width={18} height={18} color="black" />
                  <Text className="text-sm">{post.comments}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        className="absolute bg-[#7F56D9] bottom-6 right-6 w-16 h-16 shadow-lg p-4 items-center rounded-full"
        onPress={() => router.push("/(tabs)/community/confirm")}
      >
        <Plus width={24} height={24} color="white" />
      </TouchableOpacity>

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
            {selectedPost?.userId === currentUserId ? (
              <Pressable onPress={() => setShowConfirm(true)}>
                <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">
                  Delete
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => handleToggleInterested(selectedPost.id)}
              >
                <Text className="text-lg text-center">
                  {selectedPost?.isInterested ? "Ignore" : "Interested"}
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
    </View>
  );
}