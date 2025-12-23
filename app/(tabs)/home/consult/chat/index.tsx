"use client";

import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface Partner {
  id: string;
  full_name: string;
  avatar_url: string;
  online_status: boolean;
  last_seen_at: string | null;
}

interface ChatItem {
  chat_id: string;
  partner: Partner;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export default function ChatScreen() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChats = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_BASE}/api/v1/chat/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch chats");

      const result = await response.json();
      setChats(result.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không tải được danh sách chat");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(() => {
      fetchChats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const filteredChats = chats.filter((chat) =>
    chat.partner.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectChat = (chat: ChatItem) => {
    router.push({
      pathname: "/(tabs)/home/consult/chat/[chat_id]",
      params: {
        chat_id: chat.chat_id,
        name: chat.partner.full_name,
        avatar: chat.partner.avatar_url,
        status: chat.partner.online_status ? "online" : "offline",
        last_seen_at: chat.partner.last_seen_at,
      },
    });
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#FAF9FF] justify-center items-center">
        <ActivityIndicator size="large" color="#7F56D9" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Chat" />

      <ScrollView
        className="px-4 mt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="w-full bg-white rounded-full flex-row items-center px-4 py-3 mb-6 shadow-sm">
          <Search color="#696674" size={20} />
          <TextInput
            className="flex-1 ml-2 text-base font-[Poppins-Regular] text-[#333]"
            placeholder="Search expert by name..."
            placeholderTextColor="#696674"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filteredChats.length === 0 ? (
          <Text className="text-center text-gray-500 font-[Poppins-Regular]">
            {search ? "No chats found." : "You have no chats."}
          </Text>
        ) : (
          filteredChats.map((chat) => (
            <TouchableOpacity
              key={chat.chat_id}
              onPress={() => handleSelectChat(chat)}
              className="flex-row items-center justify-between p-3 mb-4 bg-white rounded-[16px] shadow-sm"
            >
              <View className="flex-row items-center flex-1">
                <View className="relative mr-3">
                  <Image
                    source={{
                      uri: chat.partner.avatar_url || "https://i.pravatar.cc/100",
                    }}
                    className="w-12 h-12 rounded-full"
                  />

                  {chat.partner.online_status && (
                    <View className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-white" />
                  )}
                </View>
                <View className="flex-1">
                  {/* <Text
                    className={`text-black ${
                      chat.unread_count > 0
                        ? "font-[Poppins-Bold]"
                        : "font-[Poppins-Regular]"
                    }`}
                  > */}
                  <Text className="font-[Poppins-Bold]">
                    {chat.partner.full_name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className={`text-[#666] ${
                      chat.unread_count > 0
                        ? "font-[Poppins-Bold]"
                        : "font-[Poppins-Regular]"
                    }`}
                  >
                    {chat.last_message || "No messages yet."}
                  </Text>
                </View>
              </View>

              {chat.unread_count > 0 && (
                <View className="bg-[#7F56D9] rounded-full px-2 py-1 min-w-[20px] items-center">
                  <Text className="text-white text-xs font-[Poppins-Bold]">
                    {chat.unread_count}
                  </Text>
                </View>
              )}
              
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}