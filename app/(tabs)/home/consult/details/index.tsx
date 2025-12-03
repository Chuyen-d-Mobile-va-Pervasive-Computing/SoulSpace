import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl">Expert ID: {id}</Text>
    </View>
  );
}
