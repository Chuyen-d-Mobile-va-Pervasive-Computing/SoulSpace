import { router, usePathname } from "expo-router";
import { CalendarCheck, MessageSquare, Users } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ConsultFooter() {
  const pathname = usePathname();

  const activeColor = "#7F56D9";
  const inactiveColor = "#E1E3E5";

  const isExpert =
    pathname.startsWith("/home/consult") &&
    !pathname.includes("appointment") &&
    !pathname.includes("chat");
  const isAppointment = pathname.startsWith("/home/consult/appointment");
  const isChat = pathname.startsWith("/home/consult/chat");

  return (
    <View className="w-full bg-white border-t border-gray-200 px-8 py-4 mb-14">
      <View className="flex-row justify-between items-center">
        {/* EXPERT */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.replace("/home/consult")}
        >
          <Users color={isExpert ? activeColor : inactiveColor} size={24} />
          <Text
            className="text-xs mt-1"
            style={{ color: isExpert ? activeColor : inactiveColor }}
          >
            Expert
          </Text>
        </TouchableOpacity>

        {/* APPOINTMENT */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.replace("/home/consult/appointment")}
        >
          <CalendarCheck
            color={isAppointment ? activeColor : inactiveColor}
            size={24}
          />
          <Text
            className="text-xs mt-1"
            style={{ color: isAppointment ? activeColor : inactiveColor }}
          >
            Appointment
          </Text>
        </TouchableOpacity>

        {/* CHAT */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.replace("/home/consult/chat")}
        >
          <MessageSquare
            color={isChat ? activeColor : inactiveColor}
            size={24}
          />
          <Text
            className="text-xs mt-1"
            style={{ color: isChat ? activeColor : inactiveColor }}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
