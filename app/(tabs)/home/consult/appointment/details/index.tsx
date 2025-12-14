import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react-native";
import React, { useState, useEffect } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function AppointDetailScreen() {
  const { appointment_id, tab } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fromTab = Number(tab ?? 0);

  const [selectedOption, setSelectedOption] = useState<"clinic" | "online">(
    "clinic"
  );

  const isLocked = selectedOption !== null;
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!appointment_id) return;
  
    const fetchAppointment = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/v1/appointments/${appointment_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching appointment:", data);
          return;
        }
        setAppointment(data);
      } catch (err) {
        console.error("Fetch appointment error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointment();
  }, [appointment_id]);

  const cancelAppointment = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const res = await fetch(
        `${API_BASE}/api/v1/appointments/${appointment_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cancel_reason: "User cancelled",
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) {
        console.error("Cancel failed:", json);
        return;
      }
      router.replace({
        pathname: "/(tabs)/home/consult/appointment",
        params: { tab: 3 },
      });
    } catch (err) {
      console.error("Cancel appointment error:", err);
    }
  };

  if (loading || !appointment) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const canCancel = appointment.status !== "cancelled";

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 border-b border-gray-200 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.replace({
            pathname: "/(tabs)/home/consult/appointment",
            params: { tab: fromTab },
          })}
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
            source={{ uri: appointment.expert.avatar_url }}
            className="w-full h-56 rounded-[10px]"
            resizeMode="contain"
          />

          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-lg font-[Poppins-SemiBold] text-black">
              {appointment.expert.full_name}
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
              {dayjs(appointment.date).format("ddd, DD MMM")}
            </Text>
          </View>
          <View className="flex-row gap-4 items-center mt-4 ml-1">
            <Clock color="#71717A" size={20} strokeWidth={2} />
            <Text className="text-[#71717A] font-[Poppins-Regular] leading-none text-[16px]">
              {appointment.start_time} - {appointment.end_time}
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
            {appointment.expert.clinic_name} - {appointment.clinic_address}
          </Text>
        </View>

        {/* FEES BREAKDOWN */}
        <Text className="text-xl font-[Poppins-SemiBold] text-[#333333] mt-8">
          Bill Details
        </Text>
        <View className="bg-white rounded-[10px] p-4 mt-4 shadow">
          {/* Price */}
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-[16px] font-[Poppins-Regular] text-[#333]">Price</Text>
            <Text className="text-[16px] font-[Poppins-SemiBold] text-[#333]">
              110
            </Text>
          </View>
          {/* VAT */}
          <View className="flex-row justify-between items-center py-2">
            <Text className="text-[16px] font-[Poppins-Regular] text-[#333]">VAT</Text>
            <Text className="text-[16px] font-[Poppins-SemiBold] text-[#333]">
              10
            </Text>
          </View>
          {/* Separator */}
          <View className="h-[1px] bg-[#E5E5E5] my-3" />

          {/* Total */}
          <View className="flex-row justify-between items-center">
            <Text className="text-[18px] font-[Poppins-SemiBold] text-[#000]">Total payable</Text>
            <Text className="text-[18px] font-[Poppins-Bold] text-[#007BFF]">
              ${appointment.total_amount}
            </Text>
          </View>
        </View>
        {/* Discount */}
        {/* <View className="bg-[#34C75926] p-4 mt-8 rounded-lg">
          <Text className="text-[#34C759] font-[Poppins-Regular]">
            You have saved Rs 69 on this appoinment.
          </Text>
        </View> */}

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
              disabled={isLocked} // ❗ khóa toàn bộ radio sau khi đã chọn 1 cái
              onPress={() => setSelectedOption(opt.key as "clinic" | "online")}
              className={`flex-row items-center mb-3 ${
                isLocked ? "opacity-40" : ""
              }`}
            >
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
        {canCancel && (
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            className="bg-[#FF383C] rounded-xl py-3 mt-4 items-center"
          >
            <Text className="text-white text-lg font-[Poppins-Medium]">
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Modal
        transparent
        visible={showConfirm}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="w-full bg-white p-6 rounded-2xl">
            <Text className="text-xl font-[Poppins-SemiBold] text-black text-center">
              Cancel Appointment?
            </Text>

            <Text className="text-base text-gray-600 font-[Poppins-Regular] text-center mt-3">
              Are you sure you want to cancel and go back?
            </Text>

            {/* BUTTONS */}
            <View className="flex-row justify-between mt-6">
              {/* Close button */}
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-300 mr-3"
              >
                <Text className="text-center text-gray-700 font-[Poppins-Medium]">
                  No
                </Text>
              </TouchableOpacity>

              {/* Confirm button */}
              <TouchableOpacity
                onPress={() => {
                  setShowConfirm(false);
                  cancelAppointment();
                }}
                className="flex-1 py-3 rounded-xl bg-[#FF383C] ml-3"
              >
                <Text className="text-center text-white font-[Poppins-Medium]">
                  Yes, Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
