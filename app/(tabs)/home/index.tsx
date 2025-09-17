import Angry from "@/assets/images/angry.svg";
import Confused from "@/assets/images/confused.svg";
import Decor from "@/assets/images/decor.svg";
import Excited from "@/assets/images/excited.svg";
import Happy from "@/assets/images/happy.svg";
import Logo from "@/assets/images/logo.svg";
import Worried from "@/assets/images/worried.svg";
import { Bell, Settings } from "lucide-react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const totalSteps = 10;
  const currentStep = 7.5; // mock progress
  const progressPercent = (currentStep / totalSteps) * 100;

  const icons = [Angry, Worried, Confused, Happy, Excited];
  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Heading */}
      <View className="w-full flex-row items-center justify-between py-4 px-4 border-b border-gray-200 bg-[#FAF9FF] mt-8">
        <View className="flex-row items-center">
          <Logo width={80} height={30} />
          <Text className="font-[Poppins-Bold] text-2xl text-[#7F56D9] ml-2">
            SOULSPACE
          </Text>
        </View>
        <View className="flex-row items-center gap-4">
          <Bell strokeWidth={1.5} />
          <Settings strokeWidth={1.5} />
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        {/* Greeting Card */}
        <View className="flex-row justify-between items-center bg-[#7F56D9] rounded-2xl">
          {/* Left side*/}
          <View className="flex-1 pl-4 pt-4 pb-4">
            <Text className="text-white font-[Poppins-Bold] text-2xl">
              Hello, SE405
            </Text>
            <Text className="text-white mt-2 font-[Poppins-Regular] text-sm">
              Hope you are enjoying your day. If not then we are here for you as
              always.
            </Text>
            <TouchableOpacity className="mt-4 bg-white rounded-full px-4 py-2 self-start">
              <Text className="text-[#7F56D9] font-[Poppins-SemiBold]">
                Explore more
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right side */}
          <Decor width={100} height={170} />
        </View>

        {/* Progress */}
        <Text className="text-black font-[Poppins-Bold] text-2xl mt-6">
          How your day felt overall
        </Text>
        <View className="w-full items-center mt-6">
          <View className="w-full h-6 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Thanh progress */}
            <View
              style={{ width: `${progressPercent}%` }}
              className="absolute left-0 top-0 h-6 bg-[#7F56D9] rounded-full"
            />
          </View>

          {/* Icon cảm xúc */}
          <View className="flex-row justify-between w-full mt-[-25] px-2">
            {icons.map((Icon, index) => (
              <View
                key={index}
                className="w-10 h-10 rounded-full bg-yellow-100 items-center justify-center shadow"
              >
                <Icon width={20} height={20} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
