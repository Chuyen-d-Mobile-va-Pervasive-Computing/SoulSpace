import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { AudioLines, Mic } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emotionList } from "@/components/EmotionPicker";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

const iconMap: { [key: string]: React.FC<{ width: number; height: number }> } = 
  Object.fromEntries(
    emotionList.map((e) => [e.name, e.icon])
  );

export default function DiaryNextScreen() {
  const params = useLocalSearchParams();
  const emotionLabel = (params.emotion as string) || "Neutral";
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<{ tag_id: string; tag_name: string }[]>([]);
  const [thoughts, setThoughts] = useState<string>("");

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const getToken = async () => {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (err) {
      console.error('Failed to get token', err);
      return null;
    }
  };

  // Pulse animation
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [recording]);

  const pulseStyle = {
    transform: [
      {
        scale: pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
    opacity: pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Microphone access is needed");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setAudioUri(uri ?? null);
    setRecording(null);

    // reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  };

  const playRecording = async () => {
    if (!audioUri) return;

    const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
    setSound(sound);
    await sound.playAsync();
  };

  // clear khi unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    if (!thoughts) {
      Alert.alert("Error", "Please fill in required fields");
      setSaving(false);
      return;
    }

    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "Invalid token. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("text_content", thoughts);
    formData.append("tags", JSON.stringify(tags));
    formData.append("emotion_label", emotionLabel);

    if (audioUri) {
      formData.append("audio", {
        uri: audioUri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/journal/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        Alert.alert("Success", "Diary saved!");
        console.log("Response data:", data);
        router.push("/(tabs)/home/diary");
      } else {
        const errorData = await res.json();
        const errorMessage = errorData.error || `Error ${res.status}`;
        Alert.alert("Error", errorMessage);
        if (res.status === 400) {
          console.log("Validation error:", errorData);
        } else if (res.status === 401) {
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Alert.alert("Error", "Failed to save diary. Check network or server.");
    }
  };

  const IconComponent = iconMap[emotionLabel];

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      <Heading title="Diary" />

      <ScrollView
        className="flex-1 mt-8 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="gap-6 items-center">
          <Text className="text-black text-3xl text-center font-[Poppins-Bold]">
            How are you feeling?
          </Text>
          {IconComponent && <IconComponent width={100} height={100} />}

          {/* Thoughts */}
          <TextInput
            value={thoughts}
            onChangeText={setThoughts}
            className="p-4 text-black text-base font-[Poppins-Italic] text-center"
            placeholder="What are you thinking..."
            placeholderTextColor="#AEA8A5"
            multiline
            numberOfLines={9}
            textAlignVertical="top"
          />

          {/* Tags */}
          <View className="space-y-2">
            <View className="flex-row flex-wrap gap-2 mt-2">
              <TagSelector
                options={[
                  { id: "1", name: "Family" },
                  { id: "2", name: "Work" },
                  { id: "3", name: "Study" },
                ]}
                multiSelect={true}
                onChange={(id, selected) => {
                  const arr = Array.isArray(selected)
                    ? selected
                    : selected
                    ? [selected]
                    : [];
                  setTags(
                    arr.map((s) => ({ tag_id: String(s.id), tag_name: s.name }))
                  );
                }}
              />
            </View>
          </View>

          {/* Recorder */}
          <View className="items-center">
            <View className="w-[120px] h-[120px] items-center justify-center">
              {recording && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      backgroundColor: "#7F56D9",
                    },
                    pulseStyle,
                  ]}
                />
              )}

              <TouchableOpacity
                className="w-[80px] h-[80px] rounded-full items-center justify-center"
                onPress={recording ? stopRecording : startRecording}
              >
                <Mic
                  width={40}
                  height={40}
                  color={recording ? "#7F56D9" : "#A894C1"}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-black font-[Poppins-SemiBold] text-sm tracking-wide mt-2">
              {recording ? "Stop Recording" : "Start Recording"}
            </Text>

            {audioUri && !recording && (
              <TouchableOpacity
                className="h-[60px] px-6 rounded-lg flex-row items-center justify-center gap-2 mt-3"
                onPress={playRecording}
              >
                <AudioLines width={30} height={30} color="#4ADE80" />
                <Text className="text-black font-[Poppins-SemiBold] text-sm tracking-wide">
                  Play Recording
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Save button */}
          <TouchableOpacity
            disabled={!thoughts || saving}
            className={`
              w-full h-16 rounded-xl items-center justify-center
              ${(!thoughts || saving) ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"}
            `}
            onPress={handleSave}
          >
            <Text
              className={`
                font-[Poppins-Bold] text-lg tracking-wide
                ${(!thoughts || saving) ? "text-gray-300" : "text-white"}
              `}
            >
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}