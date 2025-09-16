import { Text } from "react-native";
import StatCard from "./StatCard";

export default function TotalDiaryStat({ period, value, percent, trend }: {
  period: string; // "week" | "month" | "year"
  value: string;
  percent: string;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Total Diary Entries"
      value={value}
      percent={percent}
      change={trend}
      icon={<Text>📓</Text>}
      bg="bg-[rgba(59,130,246,0.08)]"
      border="border-[rgba(59,130,246,0.5)]"
      compareText={`compare to last ${period}`}
    />
  );
}