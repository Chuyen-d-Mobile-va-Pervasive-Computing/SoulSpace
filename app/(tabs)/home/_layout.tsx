import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="analytic" options={{ title: "Thống kê" }} />
      <Stack.Screen name="remind/index" options={{ title: "Nhắc nhở" }} />
      <Stack.Screen name="remind/add" options={{ title: "Thêm lời nhắc" }} />
      <Stack.Screen name="remind/update" options={{ title: "Chỉnh sửa lời nhắc" }} />
    </Stack>
  );
}