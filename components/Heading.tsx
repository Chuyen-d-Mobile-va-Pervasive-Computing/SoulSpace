import { useFonts } from "expo-font";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HeadingProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

const Heading: React.FC<HeadingProps> = ({ title, showBack = true, onBackPress }) => {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("@/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("@/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("@/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("@/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Light": require("@/assets/fonts/Poppins-Light.ttf"),
    "Poppins-ExtraBold": require("@/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Thin": require("@/assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("@/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Italic": require("@/assets/fonts/Poppins-Italic.ttf"),
  });
                  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
                  
  if (!fontsLoaded) return null;
  
  return (
    <View className="w-full flex-row items-center p-4 bg-[#020659] mt-4">
      {showBack && (
        <TouchableOpacity className="mr-4" onPress={onBackPress}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      )}
      <Text className="text-white text-lg font-[Poppins-Bold]">{title}</Text>
    </View>
  );
};

export default Heading;