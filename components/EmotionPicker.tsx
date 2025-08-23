import { useState } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

import AngryIcon from "@/assets/images/angry.svg";
import AnnoyIcon from "@/assets/images/annoy.svg";
import CalmIcon from "@/assets/images/calm.svg";
import ChillIcon from "@/assets/images/chill.svg";
import ConfusedIcon from "@/assets/images/confused.svg";
import EmbarrassedIcon from "@/assets/images/embarrassed.svg";
import ExcitedIcon from "@/assets/images/excited.svg";
import HappyIcon from "@/assets/images/happy.svg";
import SadIcon from "@/assets/images/sad.svg";
import WorriedIcon from "@/assets/images/worried.svg";

const emotions = [
  { id: 1, name: "Vui vẻ", icon: HappyIcon },
  { id: 2, name: "Buồn", icon: SadIcon },
  { id: 3, name: "Tức giận", icon: AngryIcon },
  { id: 4, name: "Bực bội", icon: AnnoyIcon },
  { id: 5, name: "Điềm tĩnh", icon: CalmIcon },
  { id: 6, name: "Thư giãn", icon: ChillIcon },
  { id: 7, name: "Bối rối", icon: ConfusedIcon },
  { id: 8, name: "Xấu hổ", icon: EmbarrassedIcon },
  { id: 9, name: "Hào hứng", icon: ExcitedIcon },
  { id: 10, name: "Lo lắng", icon: WorriedIcon }
];

export default function EmotionPicker({ onSelect }: { onSelect: (id: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {emotions.map((emotion) => {
        const Icon = emotion.icon;
        const isActive = selected === emotion.id;
        return (
          <TouchableOpacity
            key={emotion.id}
            className={`w-auto h-auto rounded-xl items-center justify-center mx-1 p-3 ${
              isActive ? "bg-purple-300" : "bg-gray-100"
            }`}
            onPress={() => {
              setSelected(emotion.id);
              onSelect(emotion.id);
            }}
          >
            <Icon width={32} height={32} />
            <Text className="text-xs mt-1">{emotion.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}