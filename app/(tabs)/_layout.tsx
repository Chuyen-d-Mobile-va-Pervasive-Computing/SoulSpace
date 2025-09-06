import { Tabs } from 'expo-router';
import { Compass, Home, PencilLine, Settings, Users } from "lucide-react-native";
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

export default function TabLayout() {
  const theme = Colors.dark; // vì chỉ định nghĩa dark mode

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: theme.textActive,     // màu text + icon active
        tabBarInactiveTintColor: theme.textInactive, // màu text + icon inactive
        tabBarStyle: {
          backgroundColor: theme.footer,         // màu nền tabbar
          borderTopColor: theme.accent,              // viền trên
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <Compass size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          tabBarLabel: () => null, // Ẩn chữ Diary
          tabBarIcon: ({ color, size }) => (
            <View style={{ marginTop: 10 }}>
              <LinearGradient
                colors={["#8736D9", "#5204BF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 54,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PencilLine color={color} size={size} />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Forum",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}