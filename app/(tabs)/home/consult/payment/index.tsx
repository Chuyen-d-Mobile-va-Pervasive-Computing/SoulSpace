import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] = useState("card");

  const today = dayjs();
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedDate, setSelectedDate] = useState(today.date());
  const [selectedTime, setSelectedTime] = useState(null);

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

  return (
    <View className="flex-1 bg-[#7F56D9]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="absolute left-4 bg-white p-1 rounded-lg"
        >
          <ArrowLeft width={32} height={32} color="#000000" />
        </TouchableOpacity>
        <Text className="text-2xl text-white font-[Poppins-Bold]">Payment</Text>
      </View>

      {/* TOP PRICE */}
      <View className="px-4 mt-16 w-full items-center justify-center">
        <Text className="text-white text-6xl font-[Poppins-Bold]">$120.00</Text>
      </View>

      {/* WHITE CONTAINER */}
      <View className="flex-1 mt-16 bg-white rounded-t-3xl p-5">
        {/* PAYMENT METHOD SWITCH */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl mr-2 ${selectedMethod === "card" ? "bg-[#7F56D9]" : "bg-gray-200"}`}
            onPress={() => setSelectedMethod("card")}
          >
            <Text
              className={`text-center font-[Poppins-SemiBold] ${selectedMethod === "card" ? "text-white" : "text-black"}`}
            >
              Card Payment
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-3 rounded-xl ml-2 ${selectedMethod === "cash" ? "bg-[#7F56D9]" : "bg-gray-200"}`}
            onPress={() => setSelectedMethod("cash")}
          >
            <Text
              className={`text-center font-[Poppins-SemiBold] ${selectedMethod === "cash" ? "text-white" : "text-black"}`}
            >
              Cash Payment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Card Payment Form */}
        {selectedMethod === "card" && (
          <View>
            <View className="mb-4">
              <Text className="mb-1 text-gray-600 font-[Poppins-Medium]">
                Card Number
              </Text>
              <TextInput
                placeholder="Card Number"
                className="p-3 rounded-xl border border-[#80A8A8A8] font-[Poppins-Regular]"
                keyboardType="number-pad"
              />
            </View>

            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="mb-1 text-gray-600 font-[Poppins-Medium]">
                  Expiry Date
                </Text>
                <TextInput
                  placeholder="MM/YY"
                  className="p-3 rounded-xl border border-[#80A8A8A8]"
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="mb-1 text-gray-600 font-[Poppins-Medium]">
                  CVV
                </Text>
                <TextInput
                  placeholder="CVV"
                  className="p-3 rounded-xl border border-[#80A8A8A8] font-[Poppins-Regular]"
                  keyboardType="number-pad"
                />
              </View>
            </View>
            <View className="mb-8">
              <Text className="mb-1 text-gray-600 font-[Poppins-Medium]">
                Name on Card
              </Text>
              <TextInput
                placeholder="Name on Card"
                className="p-3 rounded-xl border border-[#80A8A8A8] font-[Poppins-Regular]"
              />
            </View>
          </View>
        )}

        {/* CASH PAYMENT SECTION */}
        {selectedMethod === "cash" && (
          <View className="items-center mb-6">
            <Image
              source={{
                uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MockPayment",
              }}
              style={{ width: 200, height: 200 }}
            />
            <Text className="mt-4 text-lg font-[Poppins-SemiBold]">
              Bank: Techcombank
            </Text>
            <Text className="text-base font-[Poppins-Regular]">
              Account holder: John Doe
            </Text>
          </View>
        )}

        {/* Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home/consult/success")}
          className="bg-[#7F56D9] py-4 rounded-xl mt-4"
        >
          <Text className="text-center text-white text-lg font-[Poppins-SemiBold]">
            Payment Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
