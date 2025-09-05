import { Stack } from "expo-router";

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="/app/(tabs)/explore/index" options={{ title: "Explore" }} />
      <Stack.Screen name="/app/(tabs)/explore/test/index" options={{ title: "Thông tin bài test" }} />
      <Stack.Screen name="/app/(tabs)/explore/test/doing" options={{ title: "Làm bài test" }} />
      <Stack.Screen name="/app/(tabs)/explore/test/done" options={{ title: "Kết quả bài test" }} />
      <Stack.Screen name="/app/(tabs)/explore/result/index" options={{ title: "Lịch sử loại bài test" }} />
      <Stack.Screen name="/app/(tabs)/explore/result/tests" options={{ title: "Lịch sử các bài test" }} />
      <Stack.Screen name="/app/(tabs)/explore/result/detail" options={{ title: "Chi tiết bài test" }} />
    </Stack>
  );
}