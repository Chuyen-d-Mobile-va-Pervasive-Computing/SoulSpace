import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    InterExtraBold: Inter_800ExtraBold,
    InterMedium: Inter_500Medium,
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* 👇 Thêm screenOptions ở đây */}
      <Stack
        initialRouteName="(auth)/welcome"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          animationDuration: 300,
          presentation: "card",
        }}
      >
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen
          name="(auth)/introduce"
          options={{
            animation: "fade",
          }}
        />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
