import CustomSwitch from "@/components/CustomSwitch";
import Heading from "@/components/Heading";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Bell } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("@/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });

  const [once, setOnce] = useState(true);
  const [daily, setDaily] = useState(true);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState<Date>(new Date());

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
  const [showPicker, setShowPicker] = useState(false);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Add new reminder" />

      {/* Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Time display */}
        <View className="items-center mt-6">
          {/* TODO: clock picker */}
          <View className="w-64 h-64 mt-4 rounded-full border border-gray-300 items-center justify-center">
            <View className="items-center mt-6">
              <Text
                className="text-3xl font-bold text-purple-600 mb-4"
                onPress={() => setShowPicker(true)}
              >
                {time.getHours().toString().padStart(2, "0")}:
                {time.getMinutes().toString().padStart(2, "0")}
              </Text>
              {showPicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour={true}
                  display="clock"
                  onChange={(_, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) {
                      setTime(selectedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>
        </View>

        {/* Title */}
        <TextInput
          placeholder="Enter reminder title ..."
          className="bg-white rounded-xl px-4 py-3 mt-6 border border-gray-200"
        />

        {/* Description */}
        <TextInput
          placeholder="Enter reminder description ..."
          className="bg-white rounded-xl px-4 py-3 mt-4 border border-gray-200"
          multiline
          numberOfLines={3}
        />

        {/* Repeat */}
        <View className="bg-white rounded-2xl mt-6 p-4">
          <View className="flex-row items-center mb-4">
            <Bell size={18} color="#7F56D9" />
            <Text className="ml-2 font-semibold text-base">Repeat</Text>
          </View>

          {/* Days */}
          <View className="flex-row justify-between mb-4">
            {days.map((d) => {
              const active = selectedDays.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => toggleDay(d)}
                  className={`w-9 h-9 rounded-full border items-center justify-center ${
                    active
                      ? "bg-[#7F56D9] border-[#7F56D9]"
                      : "border-[#7F56D9]"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      active ? "text-white" : "text-[#7F56D9]"
                    }`}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Once / Daily */}
          <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
            <Text className="text-base">Once</Text>
            <CustomSwitch value={once} onValueChange={setOnce} />
          </View>
          <View className="flex-row items-center justify-between border-t border-gray-200 py-3">
            <Text className="text-base">Daily</Text>
            <CustomSwitch value={daily} onValueChange={setDaily} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
