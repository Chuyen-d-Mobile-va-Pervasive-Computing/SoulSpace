"use client";
import { useRouter } from "expo-router";
import { ChevronLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";

const API_BASE = process.env.EXPO_PUBLIC_API_PATH;

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null); // local uri
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // url từ server
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    avatarUrl: "",
  });

  const validateFields = (field: string, value: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (field === "email") {
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!value.includes("@")) {
          newErrors.email = "Invalid email format";
        } else {
          newErrors.email = "";
        }
      }

      if (field === "password") {
        if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(value)) {
          newErrors.password = "Password must contain at least 1 uppercase letter";
        } else if (!/[0-9]/.test(value)) {
          newErrors.password = "Password must contain at least 1 number";
        } else {
          newErrors.password = "";
        }
      }

      if (field === "confirmPassword") {
        if (value !== password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = "";
        }
      }

      if (field === "phone") {
        if (value.trim() === "") {
          newErrors.phone = "";
        } else if (!/^\d{10}$/.test(value.trim())) {
          newErrors.phone = "Phone must be exactly 10 digits";
        } else {
          newErrors.phone = "";
        }
      }

      return newErrors;
    });
  };

  const pickAndUploadAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setSelectedAvatar(uri);
    setUploadingAvatar(true);
    setErrors((prev) => ({ ...prev, avatarUrl: "" }));

    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(`${API_BASE}/api/v1/upload/public/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }
      const data = await res.json();
      setAvatarUrl(data.url);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Upload error", err.message || "Failed to upload avatar");
      setSelectedAvatar(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRegister = async () => {
    validateFields("email", email);
    validateFields("password", password);
    validateFields("confirmPassword", confirmPassword);
    validateFields("phone", phone);

    if (!avatarUrl) {
      setErrors((prev) => ({ ...prev, avatarUrl: "Please select and upload an avatar" }));
      return;
    }

    if (errors.email || errors.password || errors.confirmPassword || errors.phone) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: "user",
          phone: phone.trim() || null,
          avatar_url: avatarUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Registration failed. Please try again.";

        if (typeof data?.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
          errorMessage = data.detail[0].msg;
        }

        Alert.alert("Error", errorMessage);
        setLoading(false);
        return;
      }
      Alert.alert(
        "Success",
        `Welcome ${data.username || email}! Your account has been created.`,
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Network error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: "#FAF9FF" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      extraScrollHeight={80}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
    >
      <View className="flex-1 bg-[#FAF9FF] pt-12">
        <View className="mt-8 ml-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-12 h-12 bg-white rounded-[10px] items-center justify-center"
          >
            <ChevronLeft size={30} color="#000000" />
          </TouchableOpacity>
        </View>
        <View className="px-6 mt-4">
          <Text className="text-black text-3xl font-[Poppins-Bold]">
            Welcome back! Glad
          </Text>
          <Text className="text-black text-3xl font-[Poppins-Bold] leading-[50px]">
            to see you, Again!
          </Text>
        </View>
        {/* Avatar */}
        <View className="px-6">
          <View className="mb-6 items-center">
            <TouchableOpacity
              onPress={pickAndUploadAvatar}
              disabled={uploadingAvatar}
              className="w-28 h-28 bg-gray-100 rounded-full items-center justify-center border border-dashed border-[#DADADA]"
            >
              {uploadingAvatar ? (
                <ActivityIndicator size="large" color="#7F56D9" />
              ) : selectedAvatar ? (
                <Image source={{ uri: selectedAvatar }} className="w-full h-full rounded-full" resizeMode="cover" />
              ) : (
                <Text className="text-center text-gray-500 font-[Poppins-Regular]">Tap to choose avatar</Text>
              )}
            </TouchableOpacity>
            {errors.avatarUrl ? (
              <Text className="text-red-500 text-xs mt-1 font-[Poppins-Regular]">{errors.avatarUrl}</Text>
            ) : null}
          </View>
          {/* Email */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateFields("email", text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`w-full h-16 bg-transparent rounded-[10px] px-4 border 
                ${errors.email ? "border-red-500" : "border-[#DADADA]"}
                font-[Poppins-Regular]`}
            />
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1 font-[Poppins-Regular]">{errors.email}</Text>
            ) : null}
          </View>             
          {/* Password */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
              Password
            </Text>
            <View
              className={`w-full h-16 bg-transparent px-4 flex-row items-center rounded-[10px] 
                border ${errors.password ? "border-red-500" : "border-[#DADADA]"}`}
            >
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  validateFields("password", text);
                }}
                className="flex-1 font-[Poppins-Regular]"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <Eye size={22} color="#B5A2E9" />
                ) : (
                  <EyeOff size={22} color="#B5A2E9" />
                )}
              </Pressable>
            </View>
            {errors.password ? (
              <Text className="text-red-500 text-xs mt-1 font-[Poppins-Regular]">{errors.password}</Text>
            ) : null}
          </View>
          {/* Confirm Password */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
              Confirm Password
            </Text>
            <View
              className={`w-full h-16 bg-transparent px-4 flex-row items-center rounded-[10px]
                border ${errors.confirmPassword ? "border-red-500" : "border-[#DADADA]"}`}
            >
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  validateFields("confirmPassword", text);
                }}
                className="flex-1 font-[Poppins-Regular]"
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <Eye size={22} color="#B5A2E9" />
                ) : (
                  <EyeOff size={22} color="#B5A2E9" />
                )}
              </Pressable>
            </View>
            {errors.confirmPassword ? (
              <Text className="text-red-500 text-xs mt-1 font-[Poppins-Regular]">{errors.confirmPassword}</Text>
            ) : null}
          </View>
          {/* Phone */}
          <View className="mb-4">
            <Text className="text-gray-500 text-sm mb-1 font-[Poppins-Regular]">
              Phone Number
            </Text>
            <TextInput
              placeholder="Enter 10-digit phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                validateFields("phone", text);
              }}
              keyboardType="numeric"
              maxLength={10}
              className={`w-full h-16 bg-transparent rounded-[10px] px-4 border 
                ${errors.phone ? "border-red-500" : "border-[#DADADA]"}
                font-[Poppins-Regular]`}
            />
            {errors.phone ? (
              <Text className="text-red-500 text-xs mt-1 font-[Poppins-Regular]">{errors.phone}</Text>
            ) : null}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className={`w-full h-16 rounded-lg items-center justify-center mb-4 ${
              loading ? "bg-[#BCA8F4]" : "bg-[#7F56D9]"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-[Poppins-Bold] text-base">
                Register
              </Text>
            )}
          </TouchableOpacity>
          {/* Or Login */}
          <View className="flex-row justify-center">
            <Text className="text-black font-[Poppins-Regular]">Or </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
              <Text className="text-[#7F56D9] font-[Poppins-Medium]">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}