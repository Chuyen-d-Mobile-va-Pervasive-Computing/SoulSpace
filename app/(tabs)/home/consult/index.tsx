import { ArrowLeft, SlidersHorizontal } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const mockExperts = [
  {
    id: 1,
    name: "Dr. Ahmed Khan",
    experience: "2 years",
    rating: 4.8,
    price: 500,
    image: "https://via.placeholder.com/80",
    online: true,
  },
  {
    id: 2,
    name: "Dr. Ahmed Khan",
    experience: "2 years",
    rating: 4.8,
    price: 500,
    image: "https://via.placeholder.com/80",
    online: false,
  },
  {
    id: 3,
    name: "Dr. Ahmed Khan",
    experience: "2 years",
    rating: 4.8,
    price: 500,
    image: "https://via.placeholder.com/80",
    online: true,
  },
];

export default function ExpertScreen() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(mockExperts);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      mockExperts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const applyFilter = () => {
    setFiltered(mockExperts.filter((item) => item.online));
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <ArrowLeft width={32} height={32} />
          </TouchableOpacity>
          <Text className="ml-3 text-2xl text-[#7F56D9] font-bold">
            Experts
          </Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View className="px-4 mt-3 flex-row items-center justify-between">
        <View className="flex-1 mr-3 bg-white rounded-2xl px-4 py-3 shadow">
          <TextInput
            placeholder="Search expert by name..."
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          onPress={applyFilter}
          className="bg-white p-3 rounded-2xl shadow"
        >
          <SlidersHorizontal size={24} color="#7F56D9" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filtered.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-2xl p-4 mb-4 shadow flex-row"
          >
            <View>
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-xl"
              />
              {item.online && (
                <View className="w-3 h-3 bg-green-500 rounded-full absolute right-0 top-0" />
              )}
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-lg font-semibold">{item.name}</Text>
              <Text className="text-gray-500 mt-1">{item.experience}</Text>
              <Text className="text-gray-500">⭐ {item.rating}</Text>

              <Text className="text-xl font-bold mt-2">
                ৳ {item.price.toFixed(2)}
              </Text>

              <View className="flex-row mt-3 justify-end">
                <TouchableOpacity className="mr-3 px-4 py-2 bg-gray-100 rounded-xl">
                  <Text>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 bg-[#7F56D9] rounded-xl">
                  <Text className="text-white">Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
