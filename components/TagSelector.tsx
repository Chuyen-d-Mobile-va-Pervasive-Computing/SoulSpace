import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Option = {
  id: number | string;
  name: string;
};

type Props = {
  options: Option[];
  multiSelect?: boolean;
  onChange: (selected: (number | string)[] | (number | string | null)) => void;
};

export default function GenericSelector({
  options,
  multiSelect = false,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<
    (number | string)[] | (number | string | null)
  >(multiSelect ? [] : null);

  const toggleSelect = (id: number | string) => {
    if (multiSelect) {
      const current = selected as (number | string)[];
      const newSelected = current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id];
      setSelected(newSelected);
      onChange(newSelected);
    } else {
      const current = selected as number | string | null;
      const newSelected = current === id ? null : id;
      setSelected(newSelected);
      onChange(newSelected);
    }
  };

  const isSelected = (id: number | string) =>
    multiSelect
      ? (selected as (number | string)[]).includes(id)
      : selected === id;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", gap: 8 }}
    >
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          className={`px-4 py-2 rounded-full ${
            isSelected(opt.id) ? "bg-purple-500" : "bg-gray-300"
          }`}
          onPress={() => toggleSelect(opt.id)}
        >
          <Text className="text-white">{opt.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}