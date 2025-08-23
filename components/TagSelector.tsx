import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const tags = [
  { id: 1, name: "Gia đình" },
  { id: 2, name: "Công việc" },
  { id: 3, name: "Học tập" },
];

export default function TagSelector({ onChange }: { onChange: (ids: number[]) => void }) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleTag = (id: number) => {
    const newSelected = selected.includes(id)
      ? selected.filter((t) => t !== id)
      : [...selected, id];
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          className={`px-4 py-2 rounded-full ${
            selected.includes(tag.id) ? "bg-purple-500" : "bg-gray-300"
          }`}
          onPress={() => toggleTag(tag.id)}
        >
          <Text className="text-white">{tag.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}