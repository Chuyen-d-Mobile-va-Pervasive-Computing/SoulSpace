import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HeadingProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

const Heading: React.FC<HeadingProps> = ({ title, showBack = true, onBackPress }) => {
  return (
    <View className="w-full flex-row items-center p-4 border-b border-[#6f04d9] bg-[#6f04d9]/30">
      {showBack && (
        <TouchableOpacity className="mr-4" onPress={onBackPress}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      )}
      <Text className="text-white text-lg font-bold">{title}</Text>
    </View>
  );
};

export default Heading;