import Heading from "@/components/Heading";
import { router, useLocalSearchParams } from "expo-router";
import { CheckCheck, Clock, Grip } from "lucide-react-native";
import CircularProgress from "../components/CircularProgress";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TestInfoScreen() {
  const percentage = 25;
  const { test } = useLocalSearchParams<{ test: string }>();
  const parsedTest = test ? JSON.parse(test) : null;

  if (!parsedTest) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">No test data found</Text>
      </View>
    );
  }

  const {
    test_code,
    test_name,
    description,
    num_questions,
    image_url,
  } = parsedTest;

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title={test_code} />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="flex-1 gap-4">
          {/* Ảnh minh họa */}
          <View className="w-full items-center mt-2">
            <Image
              source={{ uri: image_url }}
              style={{ width: 200, height: 200, borderRadius: 16 }}
              resizeMode="cover"
            />
          </View>
          {/* Nội dung */}
          <View className="w-full flex-row self-stretch inline-flex justify-between items-center">
            <View>
              <Text className="text-[#605D67] text-xl font-[Poppins-Bold]">
                {test_name}
              </Text>
            </View>
            <CircularProgress percentage={percentage} />
          </View>
          <Text className="text-[#605D67] font-[Poppins-Regular] text-base">
           {description}
          </Text>

          {/* Estimate time */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#7F56D9] p-2">
                <Clock color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Poppins-Regular]">
                Estimated time:
              </Text>
            </View>
            <Text className="text-[#FF4267] text-base font-[Poppins-Regular]">
              10 minutes
            </Text>
          </View>

          {/* Number of questions */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#FF4267] p-2">
                <Grip color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Poppins-Regular]">
                Number of Questions:
              </Text>
            </View>
            <Text className="text-[#FF4267] text-base font-[Poppins-Regular]">
              {num_questions}
            </Text>
          </View>

          {/* Purpose */}
          <View className="w-full flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="rounded-[10px] bg-[#67C6E3] p-2">
                <CheckCheck color={"#ffffff"} />
              </View>
              <Text className="text-black text-base font-[Poppins-Regular]">
                Purpose:
              </Text>
            </View>
            <Text className="text-[#918D8D] text-base font-[Poppins-Regular] max-w-[70%] text-right">
              Explore mood and depressive symptoms.
            </Text>
          </View>
          {/* Button */}
          <View className="flex-row justify-center mt-4">
            <TouchableOpacity
              className="bg-[#7F56D9] h-16 rounded-xl items-center justify-center w-1/2"
              onPress={() => 
                router.push({
                  pathname: "/(tabs)/explore/test/doing",
                  params: { test_code: parsedTest.test_code },
                })
              }
            >
              <Text className="text-white font-[Poppins-Bold] text-base">
                Start Test Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}