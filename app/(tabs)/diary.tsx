import EmotionPicker from "@/components/EmotionPicker";
import Heading from "@/components/Heading";
import TagSelector from "@/components/TagSelector";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AudioLines, Mic } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function DiaryScreen() {
  const [emotion, setEmotion] = useState<{
    label: string;
    emoji: string;
  } | null>(null);

  const [tags, setTags] = useState<{ tag_id: string; tag_name: string }[]>([]);
  const [thoughts, setThoughts] = useState<string>("");

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

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
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handleSave = async () => {
    if (!emotion || !thoughts) {
      Alert.alert("Error", "Please fill in required fields");
      return;
    }

    const formData = new FormData();
    formData.append("emotion_label", emotion.label);
    formData.append("emotion_emoji", emotion.emoji);
    formData.append("text_content", thoughts);
    formData.append("tags", JSON.stringify(tags));

    if (audioUri) {
      formData.append("audio", {
        uri: audioUri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);
    }

    try {
      const res = await fetch("https://your-api-url.com/diary", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save diary");
      Alert.alert("Success", "Diary saved!");
      router.push("/(tabs)/home");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save diary");
    }
  };

  return (
    <View className="flex-1 bg-[#020659]">
      <Heading title="Diary" />

      <ScrollView
        className="flex-1 mt-4 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-col gap-y-6">
          {/* Emotion */}
          <View>
            <Text className="text-white text-base font-medium">
              How are you today?
            </Text>
            <EmotionPicker onSelect={(em) => setEmotion({ label: em.name, emoji: em.icon })} />
          </View>

          {/* Thoughts */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium mb-2">
              Write down your thought
            </Text>
            <TextInput
              value={thoughts}
              onChangeText={setThoughts}
              className="bg-white/30 border border-white p-4 rounded-xl text-white text-base min-h-[120px]"
              placeholder="What are you thinking..."
              placeholderTextColor="#BBBBBB"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium">Tags (Optional)</Text>
            <View className="flex-row flex-wrap gap-2 mt-2">
              <TagSelector
                options={[
                  { id: "1", name: "Family" },
                  { id: "2", name: "Work" },
                  { id: "3", name: "Study" },
                ]}
                multiSelect={true}
                onChange={(id, selected) => {
                  const arr = Array.isArray(selected) ? selected : selected ? [selected] : [];
                  setTags(arr.map((s) => ({ tag_id: String(s.id), tag_name: s.name }))); // ép về string
                }}
              />
            </View>
          </View>

          {/* Recorder */}
          <View className="space-y-2">
            <Text className="text-white text-base font-medium mb-2">
              Speak your mind (Optional)
            </Text>
            <TouchableOpacity
              className="bg-white/20 border border-white/40 h-[120px] p-3 rounded-lg flex-col items-center justify-center gap-2"
              onPress={recording ? stopRecording : startRecording}
            >
              <Mic width={40} height={40} color={recording ? "#D946EF" : "#A894C1"} />
              <Text className="text-white font-semibold text-sm tracking-wide">
                {recording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>

            {audioUri && !recording && (
              <TouchableOpacity
                className="bg-white/20 border border-white/40 h-[60px] p-3 rounded-lg flex-row items-center justify-center gap-2 mt-3"
                onPress={playRecording}
              >
                <AudioLines width={40} height={40} color="#4ADE80" />
                <Text className="text-white font-semibold text-sm tracking-wide">
                  Play Recording
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            disabled={!thoughts || !emotion}
            className={`${!thoughts || !emotion ? "opacity-40" : ""}`}
            onPress={handleSave}
          >
            <LinearGradient
              colors={["#8736D9", "#5204BF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-3 items-center w-full rounded-2xl overflow-hidden"
            >
              <Text className="text-white font-bold text-lg tracking-wide">SAVE</Text>
            </LinearGradient>          
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}