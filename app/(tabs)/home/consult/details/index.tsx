import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

interface ExpertDetail {
  full_name: string;
  avatar_url: string;
  phone: string;
  email: string;
  bio: string;
  years_of_experience: number;
  total_patients: number;
  clinic_name: string;
  clinic_address: string;
  consultation_price: number;
}

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [expert, setExpert] = useState<ExpertDetail | null>(null);
  const [availableSlots, setAvailableSlots] = useState<
    { schedule_id: string; start_time: string; end_time: string }[]
  >([]);

  // Calendar states
  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const daysInMonth = dayjs()
    .year(selectedYear)
    .month(selectedMonth)
    .daysInMonth();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(
    (d) => {
      const checkDate = dayjs().year(selectedYear).month(selectedMonth).date(d);
      return checkDate.isAfter(today.subtract(1, "day"));
    }
  );

  const changeMonth = (direction: "prev" | "next") => {
    const newDate =
      direction === "next"
        ? dayjs().year(selectedYear).month(selectedMonth).add(1, "month")
        : dayjs().year(selectedYear).month(selectedMonth).subtract(1, "month");

    setSelectedMonth(newDate.month());
    setSelectedYear(newDate.year());
    setSelectedDate(newDate.date());
  };

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/experts/${id}`, {
          headers: { accept: "application/json" }
        });
        const data = await res.json();
        setExpert(data);
      } catch (err) {
        console.error("Failed to load expert", err);
      } 
    };

    if (id) fetchExpert();
  }, [id]);

  const fetchAvailableTimes = async (date: string) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/experts/${id}/available-times?date=${date}`, {
          headers: { accept: "application/json" }
        });

      const data = await res.json();
      setAvailableSlots(data.slots || []);
    } catch (err) {
      console.error("Failed to load available times:", err);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    const todayFormatted = dayjs().format("YYYY-MM-DD");
    fetchAvailableTimes(todayFormatted);
  }, []);

  const createAppointment = async () => {
  if (!selectedTime) {
    alert("Please select a time slot before booking.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("access_token");
    const res = await fetch(`${API_BASE}/api/v1/appointments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        expert_profile_id: id,
        schedule_id: selectedTime,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Booking failed", data);
      alert("Booking failed");
      return;
    }

    router.push({
      pathname: "/(tabs)/home/consult/confirm",
      params: {
        appointment_id: data._id,
        // expert_phone: expert?.phone,
        // price: data.price,
        // vat: data.vat,
        // total: data.total_amount,
        // start: data.start_time,
        // end: data.end_time,
        // date: data.appointment_date,
      },
    });
  } catch (err) {
    console.error("Booking error:", err);
    alert("An error occurred while booking.");
  }
};

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 border-b border-gray-200 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home/consult")}
          className="absolute left-4"
        >
          <ArrowLeft width={32} height={32} />
        </TouchableOpacity>

        <Text className="text-2xl text-black font-bold">
          Dr. Expert Details
        </Text>
      </View>

      {/* SCROLL CONTENT */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-4"
      >
        {/* DOCTOR CARD */}
        <View className="bg-white rounded-[10px] p-4 mt-6 shadow">
          <Image
            source={{ uri: expert?.avatar_url }}
            className="w-full h-56 rounded-[10px]"
            resizeMode="contain"
          />

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-[Poppins-SemiBold] text-black">
              {expert?.full_name}
            </Text>

            <Text className="text-lg text-gray-600 font-[Poppins-Regular]">
              {expert?.phone}
            </Text>
          </View>
        </View>

        {/* SHORT INFO BOXES */}
        <View className="flex-row w-full gap-4 justify-center items-center mt-8">
          <View className="bg-white rounded-[10px] p-4 w-1/3 items-center">
            <Text className="text-[#333333] font-[Poppins-Medium] text-lg">
              Experience
            </Text>
            <Text className="text-[#007BFF] font-[Poppins-SemiBold] text-lg">
              {expert?.years_of_experience} years
            </Text>
          </View>

          <View className="bg-white rounded-[10px] p-4 w-1/3 items-center">
            <Text className="text-[#333333] font-[Poppins-Medium] text-lg">
              Patients
            </Text>
            <Text className="text-[#007BFF] font-[Poppins-SemiBold] text-lg">
              {expert?.total_patients}
            </Text>
          </View>
        </View>

        {/* BIO */}
        <View className="mt-8">
          <Text className="text-xl font-[Poppins-SemiBold] text-[#333333]">
            Bio
          </Text>
          <Text className="text-[14px] font-[Poppins-Regular] text-[#878787] mt-2">
            {expert?.bio}
          </Text>
        </View>

        {/* ADDRESS */}
        <View className="mt-8">
          <Text className="text-xl font-[Poppins-SemiBold] text-[#333333]">
            Clinic Address
          </Text>
          <Text className="text-[14px] font-[Poppins-Regular] text-[#878787] mt-2">
            {expert?.clinic_name} - {expert?.clinic_address}
          </Text>
        </View>

        {/* CALENDAR */}
        <View className="w-full mt-10">
          {/* Month Picker */}
          <View className="flex-row justify-between items-center px-2">
            <TouchableOpacity
              onPress={() => changeMonth("prev")}
              className="p-2 bg-white rounded-lg shadow"
            >
              <Text>{"<"}</Text>
            </TouchableOpacity>

            <Text className="text-xl font-[Poppins-Bold]">
              {dayjs().month(selectedMonth).format("MMMM")} {selectedYear}
            </Text>

            <TouchableOpacity
              onPress={() => changeMonth("next")}
              className="p-2 bg-white rounded-lg shadow"
            >
              <Text>{">"}</Text>
            </TouchableOpacity>
          </View>

          {/* Days Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4 px-2"
          >
            {days.map((d) => {
              const dateObj = dayjs()
                .year(selectedYear)
                .month(selectedMonth)
                .date(d);
              const isPast = dateObj.isBefore(dayjs(), "day");
              const isSelected = d === selectedDate;

              return (
                <TouchableOpacity
                  key={d}
                  disabled={isPast}
                  onPress={() => {
                    if (isPast) return;
                    setSelectedDate(d);
                    const formatted = dateObj.format("YYYY-MM-DD");
                    fetchAvailableTimes(formatted);
                  }}
                  className={`w-16 h-20 mr-3 rounded-xl items-center justify-center shadow ${
                    isPast
                      ? "bg-gray-200"
                      : isSelected
                      ? "bg-[#7F56D9]"
                      : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-[Poppins-Regular] ${
                      isPast
                        ? "text-gray-400"
                        : isSelected
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {dateObj.format("ddd")}
                  </Text>

                  <Text
                    className={`text-xl font-[Poppins-Bold] ${
                      isPast
                        ? "text-gray-400"
                        : isSelected
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Available Time */}
          <Text className="text-xl font-[Poppins-SemiBold] mt-6 px-2">
            Available Time
          </Text>

          <View className="flex-row flex-wrap mt-3 px-2">
            {availableSlots.length === 0 ? (
              <Text className="text-gray-500 ml-2 mt-2">No available times.</Text>
            ) : (
              availableSlots.map((slot) => {
                const label = `${slot.start_time} - ${slot.end_time}`;
                const isSelected = selectedTime === slot.schedule_id;
                
                return (
                  <TouchableOpacity
                    key={slot.schedule_id}
                    onPress={() => setSelectedTime(slot.schedule_id)}
                    className={`px-4 py-2 rounded-xl mr-3 mb-3 font-[Poppins-Regular] shadow ${
                      isSelected ? "bg-[#7F56D9]" : "bg-white"
                    }`}
                  >
                    <Text
                      className={`text-base font-[Poppins-Regular] ${
                        isSelected ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Button */}
          <View className="w-full flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home/consult/chat")}
              className="bg-[#ffffff] rounded-[10px] border border-[#7F56D9] px-6 py-3 mx-4 mt-4 items-center w-1/3"
            >
              <Text className="text-[#7F56D9] font-[Poppins-SemiBold] text-lg">
                Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={createAppointment}
              className="bg-[#7F56D9] rounded-[10px] px-6 py-3 mx-4 mt-4 items-center w-1/3"
            >
              <Text className="text-white font-[Poppins-SemiBold] text-lg">
                Book
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
