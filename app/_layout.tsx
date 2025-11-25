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
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import "../global.css";
import * as Notifications from "expo-notifications";
import { setupNotificationChannel } from '@/services/notification';
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    InterBold: Inter_700Bold,
    InterExtraBold: Inter_800ExtraBold,
    InterMedium: Inter_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    setupNotificationChannel();

    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Bạn cần cấp quyền thông báo để nhận nhắc hẹn!');
      }
    })();
  }, []);

  // === XỬ LÝ KHI NGƯỜI DÙNG BẤM VÀO THÔNG BÁO ===
  useEffect(() => {
    // Khi người dùng nhấn vào thông báo (app đang foreground/background/killed)
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const reminder = data?.reminder;

        if (reminder) {
          router.push({
            pathname: "/(tabs)/home/remind/update",
            params: { reminder: JSON.stringify(reminder) },
          });
        } else {
          router.replace("/(tabs)/home/remind");
        }
      }
    );

    // Kiểm tra nếu app được mở từ thông báo (killed state)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        const reminder = data?.reminder;
        if (reminder) {
          router.replace({
            pathname: "/(tabs)/home/remind/update",
            params: { reminder: JSON.stringify(reminder) },
          });
        }
      }
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  async function addUnreadReminder(reminder: any) {
    const raw = await AsyncStorage.getItem("UNREAD_REMINDERS");
    const list = raw ? JSON.parse(raw) : [];
    list.push(reminder);
    await AsyncStorage.setItem("UNREAD_REMINDERS", JSON.stringify(list));
  }

  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const reminder = response.notification.request.content.data?.reminder;
        if (reminder) {
          await addUnreadReminder(reminder);
          router.push({
            pathname: "/(tabs)/home/remind/update",
            params: { reminder: JSON.stringify(reminder) },
          });
        }
      }
    );
    return () => responseListener.remove();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)/welcome" />
        <Stack.Screen name="(auth)/introduce" options={{ animation: "fade" }} />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/forgot-pw/index" />
        <Stack.Screen name="(auth)/forgot-pw/confirm-otp" />
        <Stack.Screen name="(auth)/forgot-pw/new-pw" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}