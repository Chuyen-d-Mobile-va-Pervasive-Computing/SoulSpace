import { router } from "expo-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
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
    image: "https://i.pravatar.cc/40?img=26",
    online: true,
  },
  {
    id: 2,
    name: "Dr. Peter Smith",
    experience: "3 years",
    rating: 4.9,
    price: 500,
    image: "https://i.pravatar.cc/40?img=25",
    online: false,
  },
  {
    id: 3,
    name: "Dr. Taylor Swift",
    experience: "10 years",
    rating: 5.0,
    price: 500,
    image: "https://i.pravatar.cc/40?img=10",
    online: true,
  },
];

export default function ExpertScreen() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(mockExperts);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFiltered(
      mockExperts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  // FILTER HANDLER
  const applyFilter = (type: string | null) => {
    setSelectedFilter(type);
    setFilterOpen(false);

    switch (type) {
      case "online":
        return setFiltered(mockExperts.filter((item) => item.online));

      case "rating":
        return setFiltered(
          [...mockExperts].sort((a, b) => b.rating - a.rating)
        );

      case "experience":
        return setFiltered(
          [...mockExperts].sort(
            (a, b) => parseInt(b.experience) - parseInt(a.experience) // sort số năm kinh nghiệm
          )
        );

      case "price":
        return setFiltered([...mockExperts].sort((a, b) => a.price - b.price));

      default:
        return setFiltered(mockExperts);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF9FF]">
      {/* Header */}
      <View className="flex-row items-center justify-between py-4 px-4 border-b border-gray-200 mt-8">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
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

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setFilterOpen(true)}
          className="bg-white p-3 rounded-2xl shadow"
        >
          <SlidersHorizontal size={24} color="#7F56D9" />
        </TouchableOpacity>
      </View>
      {filtered.length === 0 && (
        <Text className="text-center text-gray-500 mt-4">No expert found.</Text>
      )}
      {/* List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {filtered.map((item) => (
          <View key={item.id} className="bg-white rounded-2xl p-4 mb-4 shadow">
            {/* TOP SECTION */}
            <View className="flex-row">
              {/* Avatar */}
              <View>
                <Image
                  source={{ uri: item.image }}
                  className="w-16 h-16 rounded-xl"
                />
                {item.online && (
                  <View className="w-3 h-3 bg-green-500 rounded-full absolute right-0 top-0" />
                )}
              </View>

              {/* Info */}
              <View className="flex-1 ml-4">
                <Text className="text-lg font-[Poppins-Bold]">{item.name}</Text>

                <View className="flex-row gap-4 items-center w-full mt-1">
                  <View className="flex-row gap-2 items-center">
                    <BriefcaseBusiness
                      color="#71717A"
                      size={16}
                      strokeWidth={2}
                    />
                    <Text className="text-[#71717A] font-[Poppins-Regular]">
                      {item.experience}
                    </Text>
                  </View>

                  <View className="flex-row gap-2 items-center">
                    <Star color="#71717A" size={16} strokeWidth={2} />
                    <Text className="text-[#71717A]">{item.rating}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* SEPARATOR */}
            <View className="w-full h-[1px] bg-gray-200 my-3" />

            {/* BOTTOM SECTION */}
            <View className="flex-row items-center justify-between w-full">
              <Text className="text-xl font-bold">
                ৳ {item.price.toFixed(2)}
              </Text>

              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => router.push("/(tabs)/home/consult/chat")} 
                  className="mr-3 px-4 py-2 bg-transparent rounded-xl"
                >
                  <Text className="text-[#7F56D9] font-[Poppins-Medium]">
                    Chat
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/consult/details",
                      params: { id: item.id },
                    })
                  }
                  className="px-4 py-2 bg-[#7F56D9] rounded-xl"
                >
                  <Text className="text-white font-[Poppins-Medium]">Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FILTER MODAL */}
      <Modal visible={filterOpen} transparent animationType="slide">
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setFilterOpen(false)}
        >
          <Pressable
            onPress={() => {}}
            className="bg-white p-6 rounded-t-3xl shadow-lg"
          >
            <Text className="text-xl font-[Poppins-Bold] mb-4">
              Filter Options
            </Text>

            {[
              { key: "online", label: "Online Experts" },
              { key: "rating", label: "Highest Rating" },
              { key: "experience", label: "Most Experience" },
              { key: "price", label: "Lowest Price" },
              { key: null, label: "Reset Filters" },
            ].map((opt) => (
              <TouchableOpacity
                key={String(opt.key)}
                onPress={() => applyFilter(opt.key)}
                className="flex-row justify-between items-center py-3"
              >
                <Text className="text-lg font-[Poppins-Regular]">
                  {opt.label}
                </Text>

                {selectedFilter === opt.key && (
                  <Check size={20} color="#7F56D9" />
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setFilterOpen(false)}
              className="mt-4 p-3 bg-gray-200 rounded-xl"
            >
              <Text className="text-center font-[Poppins-Medium]">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
