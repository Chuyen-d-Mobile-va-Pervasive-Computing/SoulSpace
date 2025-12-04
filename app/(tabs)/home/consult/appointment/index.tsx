import { router } from "expo-router";
import { ArrowLeft, Calendar, Clock, MoreVertical } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";

export default function AppointmentScreen() {
  const [page, setPage] = useState(0);

  const upcoming = [
    {
      id: 1,
      date: "Wed, 14 Oct",
      time: "12:30 PM",
      doctor: "Dr. Riya Singhal",
      clinic: "Healthy Life Wellness Clinic - 490/1B LVS",
      image: "https://i.pravatar.cc/40?img=26",
    },
  ];

  const pending = [
    {
      id: 3,
      date: "Fri, 18 Oct",
      time: "01:00 PM",
      doctor: "Dr. Manoj Kumar",
      clinic: "Central Hospital - 88/4 VRT",
      image: "https://i.pravatar.cc/40?img=27",
    },
  ];

  const past = [
    {
      id: 2,
      date: "Mon, 02 Sep",
      time: "09:00 AM",
      doctor: "Dr. Amit Verma",
      clinic: "City Healthcare Center - 12/4 UPT",
      image: "https://i.pravatar.cc/40?img=26",
    },
  ];

  const tabs = ["Pending", "Upcoming", "Past"];
  const lists = [upcoming, pending, past];
  const pagerRef = useRef<React.ElementRef<typeof PagerView> | null>(null);
  const colors = ["#7F56D9", "#34C759", "#FF4D4F"];

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home")}
          className="absolute left-4 bg-white p-1 rounded-lg"
        >
          <ArrowLeft width={32} height={32} color="#000000" />
        </TouchableOpacity>
        <Text className="text-2xl text-black font-[Poppins-Bold]">
          Appointments
        </Text>
      </View>

      {/* SLIDE TABS */}
      <View className="flex-row px-4 mt-3 mb-2 justify-between">
        {tabs.map((t, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setPage(index);
              pagerRef.current?.setPage(index);
            }}
            className="flex-1 items-center"
          >
            <Text
              className={`text-base font-[Poppins-SemiBold] ${
                page === index ? "text-black" : "text-gray-400"
              }`}
            >
              {t}
            </Text>

            {page === index && (
              <View className="w-10 h-[3px] bg-black rounded-full mt-1" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* SWIPE VIEW */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1, borderLeftWidth: 4, borderLeftColor: colors[page] }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {lists.map((data, idx) => (
          <View key={idx} className="px-4 pb-10">
            <ScrollView>
              {data.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={{
                    borderLeftWidth: 4,
                    borderLeftColor: colors[page],
                  }}
                  className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-[#EAEAEA]"
                  onPress={() =>
                    router.push("/(tabs)/home/consult/appointment/details")
                  }
                >
                  {/* HEADER ROW */}
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-500 font-[Poppins-Medium]">
                      Appointment Details
                    </Text>
                    <MoreVertical size={20} color="#6B6B6B" />
                  </View>

                  <View className="flex-row items-center mt-3">
                    <Calendar size={20} color="#000" />
                    <Text className="ml-2 text-base font-[Poppins-Medium]">
                      {item.date}
                    </Text>

                    <Clock size={20} color="#000" style={{ marginLeft: 20 }} />
                    <Text className="ml-2 text-base font-[Poppins-Medium]">
                      {item.time}
                    </Text>
                  </View>

                  <View className="w-full h-[1px] bg-gray-200 my-4" />

                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: item.image }}
                      className="w-14 h-14 rounded-full mr-4"
                    />
                    <View>
                      <Text className="text-lg font-[Poppins-SemiBold]">
                        {item.doctor}
                      </Text>
                      <Text className="text-gray-600 text-sm font-[Poppins-Regular]">
                        {item.clinic}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}
      </PagerView>
    </View>
  );
}
