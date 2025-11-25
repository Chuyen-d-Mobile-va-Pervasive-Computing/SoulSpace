import CircularTimeSelector from "@/components/CircularTimeSelector";
import CustomSwitch from "@/components/CustomSwitch";
import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import { Bell } from "lucide-react-native";
import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { scheduleReminder, cancelReminder } from '@/services/notification';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function UpdateScreen() {
  const { reminder } = useLocalSearchParams<{ reminder: string }>();
  const parsedReminder = useMemo(() => (reminder ? JSON.parse(reminder) : null), [reminder]);

  const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(new Date());
  const [once, setOnce] = useState(false);
  const [daily, setDaily] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!parsedReminder) return;

    setTitle(parsedReminder.title || "");
    setDescription(parsedReminder.message || "");

    const [h, m] = parsedReminder.time_of_day.split(":");
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    setTime(date);

    setOnce(parsedReminder.repeat_type === "once");
    setDaily(parsedReminder.repeat_type === "daily");

    if (parsedReminder.repeat_days) {
      setSelectedDays(parsedReminder.repeat_days.map((d: number) => days[d]));
    }
  }, [parsedReminder]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (!parsedReminder) return;

    setErrors({});
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        ToastAndroid.show("No access token", ToastAndroid.SHORT);
        return;
      }

      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      const time_of_day = `${hours}:${minutes}`;

      const repeat_type = once ? "once" : daily ? "daily" : "custom";
      const repeat_days = repeat_type === "custom" ? selectedDays.map(d => days.indexOf(d)) : undefined;

      const payload: any = {
        title,
        message: description || undefined,
        time_of_day,
        repeat_type,
        is_active: parsedReminder.active,
      };

      if (repeat_days && repeat_days.length > 0) {
        payload.repeat_days = repeat_days;
      }

      const response = await fetch(`${API_BASE}/api/v1/reminders/${parsedReminder._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const newErrors: { [key: string]: string } = {};
        if (Array.isArray(data.detail)) {
          data.detail.forEach((err: any) => {
            const field = err.loc?.[err.loc.length - 1] || "form";
            newErrors[field] = err.msg;
          });
        } else {
          newErrors.form = data.detail || "Update failed";
        }
        setErrors(newErrors);
        return;
      }

      if (parsedReminder.active) {
        await cancelReminder(parsedReminder._id);

        const updatedReminder = {
          _id: parsedReminder._id,
          title,
          message: description || undefined,
          time_of_day,
          repeat_type: repeat_type as "once" | "daily" | "custom",
          repeat_days: repeat_days?.length ? repeat_days : undefined,
        };

        await scheduleReminder(updatedReminder);
      }

      ToastAndroid.show("Reminder updated successfully!", ToastAndroid.SHORT);
      router.replace("/(tabs)/home/remind");
    } catch (error: any) {
      console.error("Update error:", error);
      ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    }
  };

  const handleDelete = async () => {
    if (!parsedReminder) return;

    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelReminder(parsedReminder._id);
              const token = await AsyncStorage.getItem("access_token");
              if (!token) {
                ToastAndroid.show("No access token", ToastAndroid.SHORT);
                return;
              }

              const response = await fetch(`${API_BASE}/api/v1/reminders/${parsedReminder._id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const err = await response.json();
                ToastAndroid.show(err?.detail || "Delete failed", ToastAndroid.SHORT);
                return;
              }

              ToastAndroid.show("Reminder deleted!", ToastAndroid.SHORT);
              router.replace("/(tabs)/home/remind");
            } catch (error) {
              console.error(error);
              ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  };

  if (!parsedReminder) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FAF9FF]">
        <Text className="text-lg">Reminder not found</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#FAF9FF" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 bg-[#FAF9FF]">
          <Heading title="Update Reminder" />

          <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
            <TouchableOpacity onPress={handleSave}>
              <Text className="text-[#7F56D9] font-[Poppins-Bold] text-lg text-right">
                Save
              </Text>
            </TouchableOpacity>

            <View className="items-center mt-4">
              <CircularTimeSelector time={time} setTime={setTime} />
            </View>

            {/* Title */}
            <View className="mt-8">
              <Text className="text-lg font-[Poppins-SemiBold] text-gray-700 mb-2">
                Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter reminder title ..."
                className="bg-white rounded-xl px-4 py-3 border border-gray-200 text-base font-[Poppins-Regular]"
              />
              {errors.title && <Text className="text-red-500 mt-1 text-sm">{errors.title}</Text>}
            </View>

            {/* Description */}
            <View className="mt-4">
              <Text className="text-lg font-[Poppins-SemiBold] text-gray-700 mb-2">
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter reminder description ..."
                className="bg-white rounded-xl px-4 py-3 border border-gray-200 text-base font-[Poppins-Regular]"
                multiline
                numberOfLines={4}
                style={{ minHeight: 100, textAlignVertical: "top" }}
              />
              {errors.message && <Text className="text-red-500 mt-1 text-sm">{errors.message}</Text>}
            </View>

            {/* Repeat */}
            <View className="bg-white rounded-2xl mt-6 p-4">
              <View className="flex-row items-center mb-4">
                <Bell size={18} color="#7F56D9" />
                <Text className="ml-2 font-[Poppins-SemiBold] text-base">Repeat</Text>
              </View>

              <View className="flex-row justify-between mb-4">
                {days.map(d => {
                  const active = selectedDays.includes(d);
                  return (
                    <TouchableOpacity
                      key={d}
                      onPress={() => toggleDay(d)}
                      className={`w-9 h-9 rounded-full border items-center justify-center ${
                        active ? "bg-[#7F56D9] border-[#7F56D9]" : "border-[#7F56D9]"
                      }`}
                    >
                      <Text className={`text-sm font-[Poppins-Regular] ${active ? "text-white" : "text-[#7F56D9]"}`}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.repeat_days && <Text className="text-red-500 mt-1 text-sm">{errors.repeat_days}</Text>}

              <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
                <Text className="text-base font-[Poppins-Regular]">Once</Text>
                <CustomSwitch value={once} onValueChange={setOnce} />
              </View>
              <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
                <Text className="text-base font-[Poppins-Regular]">Daily</Text>
                <CustomSwitch value={daily} onValueChange={setDaily} />
              </View>
            </View>

            {errors.form && <Text className="text-red-500 mt-4 text-center">{errors.form}</Text>}

            {/* Delete Button */}
            <View className="px-3 mt-10">
              <TouchableOpacity
                onPress={handleDelete}
                className="bg-[#FF6B6B] h-12 rounded-xl items-center justify-center"
              >
                <Text className="text-white text-base font-[Poppins-Bold]">Delete Reminder</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}