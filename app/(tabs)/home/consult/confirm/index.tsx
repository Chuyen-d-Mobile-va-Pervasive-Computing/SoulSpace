import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ConfirmScreen() {
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

  const fees = [
    { label: "Fixed fee", amount: 20 },
    { label: "VAT", amount: 3 },
    { label: "After-hours examination", amount: 10 },
    { label: "Discount", amount: 10 },
  ];

  const total = fees.reduce((sum, item) => sum + item.amount, 0);

  const changeMonth = (direction: "prev" | "next") => {
    const newDate =
      direction === "next"
        ? dayjs().year(selectedYear).month(selectedMonth).add(1, "month")
        : dayjs().year(selectedYear).month(selectedMonth).subtract(1, "month");

    setSelectedMonth(newDate.month());
    setSelectedYear(newDate.year());
    setSelectedDate(newDate.date());
  };

  const [selectedOption, setSelectedOption] = useState<"clinic" | "online">(
    "clinic"
  );

  const handleConfirm = () => {
    if (selectedOption === "online") {
      router.push("/(tabs)/home/consult/payment/index");
    } else {
      router.push("/(tabs)/home/consult/success/index");
    }
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

        {/* Appointment Details */}
        <View>
          <Text className="text-xl font-[Poppins-SemiBold] mt-8 px-2">
            Appointment Details
          </Text>
          <View className="flex-row gap-4 items-center mt-4 ml-1">
            <Calendar color="#71717A" size={20} strokeWidth={2} />
            <Text className="text-[#71717A] font-[Poppins-Regular] leading-none text-[16px]">
              Wed, 14 Oct
            </Text>
          </View>
          <View className="flex-row gap-4 items-center mt-4 ml-1">
            <Clock color="#71717A" size={20} strokeWidth={2} />
            <Text className="text-[#71717A] font-[Poppins-Regular] leading-none text-[16px]">
              12:30 PM
            </Text>
          </View>
        </View>

        {/* Note */}
        <View className="bg-[#34C75926] p-4 mt-8 rounded-lg">
          <Text className="text-[#34C759] font-[Poppins-Regular]">
            The duration of the consultation is 1 hour.
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

        {/* FEES BREAKDOWN */}
        <Text className="text-xl font-[Poppins-SemiBold] text-[#333333] mt-8">
          Bill Details
        </Text>
        <View className="bg-white rounded-[10px] p-4 mt-4 shadow">
          {fees.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2"
            >
              <Text className="text-[16px] font-[Poppins-Regular] text-[#333]">
                {item.label}
              </Text>

              <Text className="text-[16px] font-[Poppins-SemiBold] text-[#333]">
                ${item.amount}
              </Text>
            </View>
          ))}

          {/* Separator */}
          <View className="h-[1px] bg-[#E5E5E5] my-3" />

          {/* Total */}
          <View className="flex-row justify-between items-center">
            <Text className="text-[18px] font-[Poppins-SemiBold] text-[#000]">
              Total payable
            </Text>

            <Text className="text-[18px] font-[Poppins-Bold] text-[#007BFF]">
              ${total}
            </Text>
          </View>
        </View>
        {/* Discount */}
        <View className="bg-[#34C75926] p-4 mt-8 rounded-lg">
          <Text className="text-[#34C759] font-[Poppins-Regular]">
            You have saved Rs 69 on this appoinment.
          </Text>
        </View>

        {/* PAYMENT OPTIONS */}
        <Text className="text-xl font-[Poppins-SemiBold] text-[#333333] mt-8 mb-4">
          Payment Options
        </Text>
        {/* OPTIONS */}
        {[
          { key: "clinic", label: "Pay at Clinic" },
          { key: "online", label: "Pay Online" },
        ].map((opt) => {
          const selected = selectedOption === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSelectedOption(opt.key as "clinic" | "online")}
              className="flex-row items-center mb-3"
            >
              {/* Radio circle */}
              <View
                className={`w-5 h-5 border-2 rounded-full mr-3 items-center justify-center ${
                  selected ? "border-[#7F56D9]" : "border-gray-400"
                }`}
              >
                {selected && (
                  <View className="w-3 h-3 bg-[#7F56D9] rounded-full" />
                )}
              </View>

              <Text className="text-lg font-[Poppins-Regular] text-[#333]">
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* CONFIRM BUTTON */}
        <TouchableOpacity
          onPress={handleConfirm}
          className="bg-[#7F56D9] rounded-xl py-3 mt-4 items-center"
        >
          <Text className="text-white text-lg font-[Poppins-Medium]">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
