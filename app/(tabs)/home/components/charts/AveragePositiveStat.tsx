import { Text } from "react-native";
import StatCard from "./StatCard";

export default function AveragePositiveStat({ period, value, percent, trend }: {
  period: string; // "week" | "month" | "year"
  value: string;
  percent: string;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Average Positive Emotion"
      value={value}
      percent={percent}
      change={trend}
      icon={<Text>📊</Text>}
      bg="bg-[rgba(139,92,246,0.08)]"
      border="border-[rgba(139,92,246,0.5)]"
      compareText={`compare to last ${period}`}
    />
  );
}