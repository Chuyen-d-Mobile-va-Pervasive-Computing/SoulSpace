import { View, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

interface PostHeaderProps {
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  isAnonymous: boolean;
  size?: "lg" | "sm";
}

export default function PostHeader({
  username,
  avatarUrl,
  createdAt,
  isAnonymous,
  size = "lg",
}: PostHeaderProps) {
  const avatarSize = size === "lg" ? 40 : 32;

  return (
    <View className="flex-row items-center">
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/home/wall")}
        className="mr-3"
      >
        {isAnonymous || !avatarUrl ? (
          <View
            style={{ width: avatarSize, height: avatarSize }}
            className="bg-gray-300 rounded-full items-center justify-center"
          >
            <Text className="text-white font-[Poppins-Bold]">
              {isAnonymous ? "?" : username?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: avatarUrl }}
            style={{ width: avatarSize, height: avatarSize }}
            className="rounded-full"
          />
        )}
      </TouchableOpacity>

      <View>
        <Text className="font-[Poppins-SemiBold] text-base">
          {isAnonymous ? "Anonymous" : username ?? "Unknown"}
        </Text>
        <Text className="text-[#7B7B7B] text-sm font-[Poppins-Regular]">
          {createdAt}
        </Text>
      </View>
    </View>
  );
}