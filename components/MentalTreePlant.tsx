import React from "react";
import { ViewStyle } from "react-native";

import Plant1 from "@/assets/images/plant1.svg";
import Plant2 from "@/assets/images/plant2.svg";
import Plant3 from "@/assets/images/plant3.svg";
import Plant4 from "@/assets/images/plant4.svg";
import Plant5 from "@/assets/images/plant5.svg";
import Plant6 from "@/assets/images/plant6.svg";
import Plant7 from "@/assets/images/plant7.svg";
import Plant8 from "@/assets/images/plant8.svg";

const plantMap = {
  1: Plant1,
  2: Plant2,
  3: Plant3,
  4: Plant4,
  5: Plant5,
  6: Plant6,
  7: Plant7,
  8: Plant8,
} as const;

type PlantLevel = keyof typeof plantMap;

interface MentalTreePlantProps {
  level: number;           
  width?: number;              
  height?: number;              
  style?: ViewStyle;        
}

const MentalTreePlant: React.FC<MentalTreePlantProps> = ({
  level,
  width = 200,
  height = 250,
  style,
}) => {
  const safeLevel = level >= 8 ? 8 : level <= 1 ? 1 : level;
  const PlantComponent = plantMap[safeLevel as PlantLevel];

  return <PlantComponent width={width} height={height} style={style} />;
};

export default MentalTreePlant;