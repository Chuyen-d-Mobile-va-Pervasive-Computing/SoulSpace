import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;
const WS_BASE = API_BASE?.replace(/^http/, "ws");

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  created_at?: string;
  is_read?: boolean;
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { chat_id, name, avatar, status: initialStatus, last_seen_at } = useLocalSearchParams<{
    chat_id: string;
    name: string;
    avatar?: string;
    status?: string;
    last_seen_at?: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [text, setText] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(initialStatus || "offline");
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(
    typeof last_seen_at === "string" ? last_seen_at : null
  );
  const flatListRef = useRef<FlatList>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingReadReceipts, setPendingReadReceipts] = useState<string[]>([]);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/api/v1/chat/chats/${chat_id}/messages`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      const formattedMessages: Message[] = result.messages.map((msg: any) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.sender_role === "user" ? "me" : "other",
        created_at: msg.created_at,
        is_read: msg.is_read,
      }));

      formattedMessages.sort(
        (a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
      );
      setMessages(formattedMessages);

      const messagesFromExpert = formattedMessages
        .filter((msg) => msg.sender === "other")
        .map((msg) => msg.id);

      setPendingReadReceipts(messagesFromExpert);
        console.log("Unread messages from expert:", messagesFromExpert);
      } catch (error) {
        console.error("Fetch messages error:", error);
      } finally {
        setLoadingMessages(false);
    }
  };

  // Kết nối WebSocket
  const connectWebSocket = useCallback(async () => {
    const token = await AsyncStorage.getItem("access_token");
    if (!token || !chat_id || !WS_BASE) return;

    const wsUrl = `${WS_BASE}/api/v1/chat/ws/${chat_id}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
      console.log("WS Open - Pending receipts:", pendingReadReceipts);

      if (pendingReadReceipts.length > 0) {
        pendingReadReceipts.forEach((messageId) => {
          ws.send(JSON.stringify({
            event: "message.read",
            payload: { message_id: messageId }
          }));
          console.log("Sent pending read receipt:", messageId);
        });
        setPendingReadReceipts([]);
      }

      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(() => {
        ws.send(JSON.stringify({ event: "ping" }));
      }, 25000);
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === "message.new") {
          const payload = data.payload;
          const newMsg: Message = {
            id: payload.id,
            text: payload.content,
            sender: payload.sender_role === "user" ? "me" : "other",
            created_at: payload.created_at,
            is_read: payload.is_read ?? false,
          };
          setMessages((prev) => [...prev, newMsg]);

          if (newMsg.sender === "other") {
            ws.send(JSON.stringify({
              event: "message.read",
              payload: { message_id: newMsg.id }
            }));
            console.log("Sent read receipt for new message:", newMsg.id);
          }
        } else if (data.event === "presence.join") {
          setOnlineStatus("online");
        } else if (data.event === "presence.leave") {
          setOnlineStatus("offline");
          if (data.payload?.last_seen_at) {
            setLastSeenAt(data.payload.last_seen_at);
          }
        } else if (data.event === "pong") {
          console.log("Pong received");
        }
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    ws.onclose = (e) => {
      console.log("WebSocket closed:", e.code, e.reason);
      setOnlineStatus("offline");
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };

    wsRef.current = ws;
  }, [chat_id, pendingReadReceipts]);

  const formatLastSeen = (utc?: string | null) => {
    if (!utc) return "offline";
    const d = new Date(utc);
    return `last seen ${d.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    })}`;
  };

  // Gửi tin nhắn
  const handleSend = () => {
    if (!text.trim() || !wsRef.current) return;

    const payload = {
      event: "message.send",
      payload: {
        message_type: "text",
        content: text.trim(),
      },
    };

    wsRef.current.send(JSON.stringify(payload));

    const optimisticMsg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "me",
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setText("");
  };

  useEffect(() => {
    if (chat_id) {
      fetchMessages();
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    };
  }, [chat_id]);

  // Auto scroll
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Auto scroll khi keyboard mở
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <View className={`flex-row mb-2 ${item.sender === "me" ? "justify-end" : "justify-start"}`}>
      <View
        className={`px-4 py-3 rounded-2xl max-w-[80%] ${
          item.sender === "me"
            ? "bg-[#7F56D9] rounded-tr-none"
            : "bg-gray-200 rounded-tl-none"
        }`}
      >
        <Text
          className={
            item.sender === "me"
              ? "font-[Poppins-Regular] text-white"
              : "font-[Poppins-Regular] text-black"
          }
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 mt-8 border-b border-gray-200 bg-white">
          <View className="flex-1 flex-row ml-8">
            <Image
              source={{
                uri:
                  typeof avatar === "string" && avatar.trim() !== ""
                    ? avatar
                    : "https://i.pravatar.cc/100?u=default",
              }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-col">
              <Text className="font-[Poppins-Bold] text-[16px] text-[#111]">
                {name}
              </Text>
              <Text
                className={`text-sm font-[Poppins-Medium] ${
                  onlineStatus === "online" ? "text-[#10B981]" : "text-[#9CA3AF]"
                }`}
              >
                {onlineStatus === "online"
                  ? "online"
                  : formatLastSeen(lastSeenAt)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home/consult/chat")}
            className="w-10 h-10 bg-[#E0D7F9] rounded-full items-center justify-center mr-3"
          >
            <ChevronLeft size={24} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View className="border-t border-gray-200 bg-white flex-row items-end px-3 py-3 pb-5">
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type your message"
            multiline
            className="flex-1 bg-gray-100 rounded-3xl px-4 py-3 text-base font-[Poppins-Regular]"
            style={{ maxHeight: 120 }}
            onFocus={() =>
              setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 150)
            }
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={() => {
              handleSend();
              Keyboard.dismiss();
            }}
            className="ml-2 bg-[#7F56D9] rounded-full p-3"
            style={{ opacity: text.trim() ? 1 : 0.4 }}
            disabled={!text.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}