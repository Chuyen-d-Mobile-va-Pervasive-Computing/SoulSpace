import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  // Calendar states
  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

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

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 border-b border-gray-200 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
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
            source={{ uri: "https://i.pravatar.cc/200?img=11" }}
            className="w-full h-56 rounded-[10px]"
            resizeMode="cover"
          />

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-[Poppins-SemiBold] text-black">
              Dr. John Smith
            </Text>

            <Text className="text-lg text-gray-600 font-[Poppins-Regular]">
              +1 234 567 890
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
              10+ years
            </Text>
          </View>

          <View className="bg-white rounded-[10px] p-4 w-1/3 items-center">
            <Text className="text-[#333333] font-[Poppins-Medium] text-lg">
              Patients
            </Text>
            <Text className="text-[#007BFF] font-[Poppins-SemiBold] text-lg">
              900+
            </Text>
          </View>
        </View>

        {/* BIO */}
        <View className="mt-8">
          <Text className="text-xl font-[Poppins-SemiBold] text-[#333333]">
            Bio
          </Text>
          <Text className="text-[14px] font-[Poppins-Regular] text-[#878787] mt-2">
            Dr. Riya Singhal is the top most physician with the experience of
            more than 10 years. She has received several awards for her
            wonderful contribution in the field of Gas lightning Dr. Riya
            Singhal is the top most physician with the experience of more than
            10 years. She has received several awards for her wonderful
            contribution in the field of Gas lightningDr. Riya Singhal is the
            top most physician with the experience of more than 10 years. She
            has received several awards for her wonderful contribution in the
            field of Gas lightning
          </Text>
        </View>

        {/* ADDRESS */}
        <View className="mt-8">
          <Text className="text-xl font-[Poppins-SemiBold] text-[#333333]">
            Clinic Address
          </Text>
          <Text className="text-[14px] font-[Poppins-Regular] text-[#878787] mt-2">
            Healthy Life Wellness Clinic - 456, Sunshine Avenue, Raja Park,
            Tilak Nagar - Jaipur, Rajasthan, 302004
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
              const isSelected = d === selectedDate;
              const dateObj = dayjs()
                .year(selectedYear)
                .month(selectedMonth)
                .date(d);

              return (
                <TouchableOpacity
                  key={d}
                  onPress={() => setSelectedDate(d)}
                  className={`w-16 h-20 mr-3 rounded-xl items-center justify-center ${
                    isSelected ? "bg-[#7F56D9]" : "bg-white"
                  } shadow`}
                >
                  <Text
                    className={`text-sm font-[Poppins-Regular] ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {dateObj.format("ddd")}
                  </Text>

                  <Text
                    className={`text-xl font-[Poppins-Bold] ${
                      isSelected ? "text-white" : "text-black"
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
            {timeSlots.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  className={`px-4 py-2 rounded-xl mr-3 mb-3 font-[Poppins-Regular] shadow ${
                    isSelected ? "bg-[#7F56D9]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-base font-[Poppins-Regular] ${
                      isSelected ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
              onPress={() => router.push("/(tabs)/home/consult/confirm/index")}
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
