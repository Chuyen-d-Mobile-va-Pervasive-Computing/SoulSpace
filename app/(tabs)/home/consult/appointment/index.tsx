import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";
import { ArrowLeft, Calendar, Clock, MoreVertical } from "lucide-react-native";
import React, { useRef, useState, useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;
const STATUS_MAP = ["pending", "upcoming", "past", "cancelled"];
const EMPTY_TEXT: Record<string, string> = {
  pending: "You have no pending appointments.",
  upcoming: "You have no upcoming appointments.",
  past: "You have no past appointments.",
  cancelled: "You have no cancelled appointmetns",
};

export default function AppointmentScreen() {
  const [page, setPage] = useState(0);
  const {tab} = useLocalSearchParams();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const lists = [0, 1, 2, 3];
  const tabs = ["Pending", "Upcoming", "Past", "Cancelled"];
  const pagerRef = useRef<React.ElementRef<typeof PagerView> | null>(null);
  const colors = ["#7F56D9", "#34C759", "#FF4D4F", "#CCCCCC"];

  const fetchAppointments = async (tabIndex: number) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const status = STATUS_MAP[tabIndex];
      const res = await fetch(
        `${API_BASE}/api/v1/appointments/?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
        }
      );

      const json = await res.json();
      if (!res.ok) {
        console.error("Fetch appointments failed:", json);
        return;
      }
      setAppointments(json.data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(0); // Pending
  }, []);

  useEffect(() => {
    const initialTab = Number(tab ?? 0);
    setPage(initialTab);
    pagerRef.current?.setPage(initialTab);
    fetchAppointments(initialTab);
  }, [tab]);

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* HEADER */}
      <View className="w-full py-4 px-4 mt-9 relative justify-center items-center">
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home/consult")}
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
              fetchAppointments(index);
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
        onPageSelected={(e) => {
          const index = e.nativeEvent.position;
          setPage(index);
          fetchAppointments(index);
        }}
      > 
        {lists.map((data, idx) => (
          <View key={idx} className="px-4 pb-10">
           <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: appointments.length === 0 ? "center" : "flex-start",
              }}
            >
              {loading ? (
                <Text className="text-center text-gray-400 mt-10">
                  Loading appointments...
                </Text>
              ) : appointments.length === 0 ? (
                <View className="items-center px-6">
                  <Text className="text-lg font-[Poppins-SemiBold] text-gray-600 mb-2">
                    No appointments
                  </Text>
                  <Text className="text-center text-gray-400">
                    {EMPTY_TEXT[STATUS_MAP[page]]}
                  </Text>
                </View>
              ) : (
                appointments.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={{
                      borderLeftWidth: 4,
                      borderLeftColor: colors[page],
                    }}
                    className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-[#EAEAEA]"
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/home/consult/appointment/details",
                        params: { appointment_id: item._id, tab: page },
                      })
                    }
                  >
                    {/* HEADER */}
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500 font-[Poppins-Medium]">
                        Appointment Details
                      </Text>
                      <MoreVertical size={20} color="#6B6B6B" />
                    </View>

                    <View className="flex-row items-center mt-3">
                      <Calendar size={20} color="#000" />
                      <Text className="ml-2 text-base font-[Poppins-Medium]">
                        {dayjs(item.date).format("ddd, DD MMM")}
                      </Text>

                      <Clock size={20} color="#000" style={{ marginLeft: 20 }} />
                      <Text className="ml-2 text-base font-[Poppins-Medium]">
                        {item.start_time}
                      </Text>
                    </View>

                    <View className="w-full h-[1px] bg-gray-200 my-4" />

                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: item.expert.avatar_url }}
                        className="w-14 h-14 rounded-full mr-4"
                      />
                      <View>
                        <Text className="text-lg font-[Poppins-SemiBold]">
                          {item.expert.full_name}
                        </Text>
                        <Text className="text-gray-600 text-sm font-[Poppins-Regular]">
                          {item.expert.clinic_name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        ))}
      </PagerView>
    </View>
  );
}