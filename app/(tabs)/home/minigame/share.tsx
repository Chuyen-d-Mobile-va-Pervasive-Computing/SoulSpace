import Heading from "@/components/Heading";
import { router } from "expo-router";
import { Flame, Heart, MessageCircle, MessageCircleHeart, Sun } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ShareScreen() {
  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Spreading Smile" showBack={true} onBackPress={() => router.back()} />
      
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-4 pt-2"
      >
        {/* Badges */}
        <View className="w-full p-2 overflow-hidden">
          <View className="flex-1 rounded-lg bg-white/30 border border-white p-2 justify-center items-center overflow-hidden">
            <View className="py-2 gap-2 items-center w-full">
              <View className="rounded-full bg-[#E6A117]/30 border border-[#E6A117] p-2">
                <Sun width={36} height={36} className="rounded-full overflow-hidden" color="#E6A117" />
              </View>
              <Text className="text-lg font-bold text-[#E6A117] text-center">
                Spreading Smile
              </Text>
              <View className="mt-6">
                <View className="flex-col">
                  <View className="flex-row px-8 gap-8">
                    {/* Badge 1 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#E6A117]/30 border border-[#E6A117] p-2">
                        <MessageCircleHeart width={24} height={24} className="rounded-full overflow-hidden" color="white" />
                      </View>
                      <Text className="text-white text-[13px] text-base font-bold">Teller</Text>
                    </View>
                    {/* Badge 2 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <Flame width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-bold">Beacon</Text>
                    </View>
                    {/* Badge 3 */}
                    <View className="flex-col items-center gap-2">
                      <View className="rounded-full bg-[#CCCCCC]/30 border border-[#CCCCCC] p-2">
                        <Sun width={24} height={24} className="rounded-full overflow-hidden" color="#CCCCCC" />
                      </View>
                      <Text className="text-[#CCCCCC] text-[13px] text-base font-bold">SpreadingSmile</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Post */}
        <View className="w-full mt-4 p-2 overflow-hidden gap-2">
          <View className="mt-4 p-4 rounded-2xl bg-white/30 border border-white shadow-lg">
            {/* Header */}
            <View>
              <Text className="text-white font-semibold text-sm">
                user01234567
              </Text>
              <Text className="text-gray-300 text-xs mt-1">
                12:20:20 26/4/2025
              </Text>
            </View>
            {/* Content */}
            <Text className="text-white text-base mt-3">Tôi vui lắm</Text>
            {/* Interaction */}
            <View className="flex-row mt-3 gap-6">
              <View className="flex-row items-center gap-1">
                <Heart width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <MessageCircle width={18} height={18} color="white" />
                <Text className="text-white text-sm">10</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}