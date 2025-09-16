import HappyIcon from "@/assets/images/happy.svg";
import StatCard from "./StatCard";

export default function PositiveEmotionStat({ period, value, percent, trend }: {
  period: string; // "week" | "month" | "year"
  value: string;
  percent: string;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Positive"
      value={value}
      percent={percent}
      change={trend}
      icon={<HappyIcon width={28} height={28}/>}
      bg="bg-[rgba(34,197,94,0.08)]"
      border="border-[rgba(34,197,94,0.5)]"
      compareText={`compare to last ${period}`}
    />
  );
}