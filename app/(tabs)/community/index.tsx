import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Heart,
  MessageCircle,
  Plus,
  SlidersHorizontal,
  EllipsisVertical,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";

export default function CommunityScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });
          
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
          
  if (!fontsLoaded) return null;
  const router = useRouter();

  const currentUserId = "u1";
  const [posts, setPosts] = useState([
    {
      id: "p1",
      userId: "u1",
      username: "user 01234567",
      createdAt: "2025-01-01 12:20:20",
      content: "Tôi vui lắm",
      likes: 10,
      comments: 10,
      isInterested: false,
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
    },
  ]);

  const [filterVisible, setFilterVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const handleCancel = () => {
    setShowConfirm(true);
  };

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
    setMenuVisible(false);

    const post = posts.find((p) => p.id === id);
    if (post?.isInterested) {
      ToastAndroid.show(
        "You will see fewer posts like this.",
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(
        "You will see more posts like this.",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <View className="flex-1 bg-[#020659]">
      {/* Heading */}
      <Heading title="Forum" showBack onBackPress={() => router.back()} />

      {/* Body */}
      <View className="flex-1 px-4 mt-4">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 120, // tránh đè nút Add
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Filter */}
          <TouchableOpacity
            className="flex-row justify-end items-center mb-4"
            onPress={() => setFilterVisible(true)}
          >
            <Text className="text-white font-[Poppins-Bold] text-xs mr-2">Filter</Text>
            <SlidersHorizontal width={20} height={20} color="white" />
          </TouchableOpacity>

          {/* Posts */}
          {posts.map((post) => (
            <View
              key={post.id}
              className="p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg"
            >
              {/* Header */}
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-white font-[Poppins-SemiBold] text-sm">
                    {post.username}
                  </Text>
                  <Text className="text-gray-300 font-[Poppins-Regular] text-xs mt-1">
                    {post.createdAt}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPost(post);
                    setMenuVisible(true);
                  }}
                >
                  <EllipsisVertical width={20} height={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/community/comment")}
              >
                <Text className="text-white text-base mt-3 font-[Poppins-Regular]">
                  {post.content}
                </Text>
              </TouchableOpacity>

              {/* Interaction */}
              <View className="flex-row mt-3 gap-6">
                <View className="flex-row items-center gap-1">
                  <Heart width={18} height={18} color="white" />
                  <Text className="text-white text-sm font-[Poppins-Regular]">{post.likes}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <MessageCircle width={18} height={18} color="white" />
                  <Text className="text-white text-sm font-[Poppins-Regular]">{post.comments}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-16 h-16 shadow-lg"
        onPress={() => router.push("/(tabs)/community/confirm")}
      >
        <LinearGradient
          colors={["#8736D9", "#5204BF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 items-center w-full rounded-full overflow-hidden"
        >
          <Plus width={24} height={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="w-80 bg-white p-6 rounded-2xl">
            <Text className="text-lg font-[Poppins-Bold] mb-4">Sort</Text>
            <TagSelector
              options={[
                { id: 2025, name: "2025" },
                { id: 2024, name: "2024" },
                { id: 2023, name: "2023" },
              ]}
              multiSelect={false}
              onChange={(ids) => console.log("Years:", ids)}
            />
            {/* Close Button */}
            <Pressable
              className="mt-4 bg-[#6F04D9] py-2 rounded-xl"
              onPress={() => setFilterVisible(false)}
            >
              <Text className="text-center text-white font-[Poppins-Bold]">Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-2xl p-4">
            {selectedPost?.userId === currentUserId ? (
              <>
                <Pressable onPress={handleCancel}>
                  <Text className="text-red-500 text-lg font-[Poppins-Bold] text-center">Delete</Text>
                </Pressable>
                {/* <Pressable onPress={() => handleEdit(selectedPost.id)}>
                  <Text className="text-lg mt-2">Chỉnh sửa</Text>
                </Pressable> */}
              </>
            ) : (
              <Pressable
                onPress={() => handleToggleInterested(selectedPost.id)}
              >
                <Text className="text-lg text-center">
                  {selectedPost?.isInterested ? "Ignore" : "Interested"}
                </Text>
              </Pressable>
            )}
            {/* <Pressable onPress={() => handleShare(selectedPost.id)}>
              <Text className="text-lg mt-2">Chia sẻ</Text>
            </Pressable> */}
            <Pressable onPress={() => setMenuVisible(false)}>
              <Text className="text-center font-[Poppins-Bold] mt-4">
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-4/5 rounded-2xl p-6 items-center">
            <Text className="text-lg font-[Poppins-SemiBold] mb-6 text-gray-800">
              Are you sure you want to delete this post?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="bg-gray-300 px-8 py-4 rounded-xl"
              >
                <Text className="text-base font-[Poppins-SemiBold] text-gray-800">No</Text>
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
      </Modal>
    </View>
  );
}