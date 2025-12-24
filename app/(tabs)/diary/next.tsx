import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { Audio } from "expo-av";
import { router, useLocalSearchParams } from "expo-router";
import { AudioLines, Mic } from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, Animated, Easing, Modal, TouchableWithoutFeedback } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { emotionList } from "@/components/EmotionPicker";
import MentalTreePlant from "@/components/MentalTreePlant";
import CustomSwitch from "@/components/CustomSwitch";
import dayjs from "dayjs";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

const iconMap: { [key: string]: React.FC<{ width: number; height: number }> } = 
  Object.fromEntries(
    emotionList.map((e) => [e.name, e.icon])
  );

export default function DiaryNextScreen() {
  const params = useLocalSearchParams();
  const date = params.date as string;
  const emotionLabel = (params.emotion as string) || "Neutral";
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<{ tag_id: string; tag_name: string }[]>([]);
  const [thoughts, setThoughts] = useState<string>("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [latestJournalId, setLatestJournalId] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [includeExcerpt, setIncludeExcerpt] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [level, setLevel] = useState(1);
  const today = dayjs().format("YYYY-MM-DD");
  const isToday = !date || date === today;

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

    if (!thoughts.trim()) {
      Alert.alert("Error", "Please write something about your thoughts");
      setSaving(false);
      return;
    }

    const token = await getToken();
    if (!token) {
      Alert.alert("Error", "Invalid token. Please login again.");
      setSaving(false);
      return;
    }

    const formData = new FormData();    
    formData.append("text_content", thoughts.trim());
    formData.append("emotion_label", emotionLabel);
    formData.append("tags", JSON.stringify(tags));
    if (date && !isToday) {
      formData.append("journal_date", date);
    }

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
        const result = await res.json();
        console.log("Journal response:", result.tree_watering_result);

        let message = "Diary saved successfully!";

        if (isToday && result.tree_watering_result) {
          if (result.tree_watering_result.current_level) {
            setLevel(result.tree_watering_result.current_level);
          }

          if (result.tree_watering_result.watered) {
            setLatestJournalId(result.id);
          }

          if (result.share_suggestion) {
            setShareModalVisible(true);
            return; 
          }

          if (!result.tree_watering_result.watered) {
            const reason = result.tree_watering_result.reason || "";
            if (reason === "ALREADY_WATERED_TODAY") {
              message = "Diary saved! Your tree was already watered today";
            } else if (reason.includes("NEGATIVE") || reason.includes("TOXIC")) {
              message = "Diary saved. Keep writing to feel better";
            } else if (reason === "NO_TEXT_CONTENT") {
              message = "Diary saved!";
            }
          }
        } else if (!isToday) {
          message = "Diary saved for past date! (No tree watering) 📅";
        }
        Toast.show({
          type: "success",
          text1: message,
        });
        router.push("/(tabs)/home/diary");
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.error || `Error ${res.status}`;
        Alert.alert("Save failed", errorMessage);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      Alert.alert("Error", "Cannot connect to server. Check your internet connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleShareTree = async () => {
    if (sharing) return;
    setSharing(true);
    setShareModalVisible(false);
    router.push("/(tabs)/home/diary");
    Toast.show({
      type: "info",
      text1: "Sharing your tree...",
    });

    try {
      const token = await getToken();
      if (!token) return;

      const body: any = {
        include_journal_excerpt: includeExcerpt,
        is_anonymous: isAnonymous,
        custom_message: shareMessage.trim(),
        hashtags: ["mentalTree", "growth"],
      };

      if (includeExcerpt && latestJournalId) {
        body.journal_id = latestJournalId;
      }

      const res = await fetch(`${API_BASE}/api/v1/tree/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        Toast.show({
          type: "success",
          text1: "Tree shared successfully",
        });
      } else {
        const error = await res.json();
        Toast.show({
          type: "error",
          text1: "Share failed",
          text2: error.detail || "Please try again later",
        });
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Network error while sharing",
      });
    } finally {
      setSharing(false);
    }
  };

  const closeShareModalAndNavigate = () => {
    setShareModalVisible(false);
    Toast.show({
      type: "info",
      text1: "Diary saved!",
      text2: "You can share your tree progress later from the tree page.",
      visibilityTime: 3000,
    });  
    router.push("/(tabs)/home/diary");
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

        <Modal transparent visible ={shareModalVisible} animationType="slide">
          <TouchableWithoutFeedback onPress={() => !sharing && closeShareModalAndNavigate()}>
            <View className="flex-1 bg-black/50 justify-center items-center">
              <View className="bg-white rounded-2xl p-6 w-11/12 max-w-sm">
                <Text className="text-xl font-[Poppins-Bold] text-center mb-4">
                  Share your tree 🌱
                </Text>
                <View className="items-center">
                  <MentalTreePlant level={level} width={180} height={220} />
                </View> 
                <TextInput
                  placeholder="Add message (optional)..."
                  value={shareMessage}
                  onChangeText={setShareMessage}
                  multiline
                  className="border border-gray-300 rounded-xl p-4 mt-4 min-h-[100px] font-[Poppins-Regular]"
                />
                <View className="mt-4 space-y-5 gap-2">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-[Poppins-Medium] text-gray-700">Excerpt from diary</Text>
                    <CustomSwitch
                      value={includeExcerpt}
                      onValueChange={setIncludeExcerpt}
                    />
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-[Poppins-Medium] text-gray-700">Anonymous</Text>
                    <CustomSwitch
                      value={isAnonymous}
                      onValueChange={setIsAnonymous}
                    />
                  </View>
                </View>
                <View className="flex-row mt-6 gap-3">
                  <TouchableOpacity
                    disabled={sharing}
                    onPress={closeShareModalAndNavigate}
                    className="flex-1 py-4 bg-gray-300 rounded-xl"
                  >
                    <Text className="text-center font-[Poppins-SemiBold]">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={sharing}
                    onPress={handleShareTree}
                    className={`flex-1 py-4 rounded-xl ${(sharing) ? "opacity-40 bg-[#7F56D9]" : "bg-[#7F56D9]"}`}
                  >
                    <Text className={`text-center font-[Poppins-SemiBold] ${(sharing) ? "text-gray-300" : "text-white"}`}>
                      {sharing ? "Sharing..." : "Share"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </View>
  );
}