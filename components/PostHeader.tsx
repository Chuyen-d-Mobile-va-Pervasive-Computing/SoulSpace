import { View, Text } from "react-native";

interface PostHeaderProps {
  username?: string;
  createdAt: string;
  isAnonymous: boolean;
  size?: "lg" | "sm";
}

export default function PostHeader({
  username,
  createdAt,
  isAnonymous,
  size = "lg",
}: PostHeaderProps) {
  const avatarLetter = isAnonymous
    ? "?"
    : username?.charAt(0)?.toUpperCase() || "U";

  const avatarSize = size === "lg" ? "w-10 h-10" : "w-8 h-8";

  return (
    <View className="flex-row items-center">
      <View
        className={`${avatarSize} bg-gray-300 rounded-full items-center justify-center mr-3`}
      >
        <Text className="text-white font-[Poppins-Bold]">{avatarLetter}</Text>
      </View>

      <View>
        <Text className="font-[Poppins-SemiBold] text-base">
          {isAnonymous ? "Anonymous" : username}
        </Text>
        <Text className="text-[#7B7B7B] text-sm">{createdAt}</Text>
      </View>
    </View>
  );
}