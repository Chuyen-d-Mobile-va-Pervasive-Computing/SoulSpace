import SadIcon from "@/assets/images/sad.svg";
import StatCard from "./StatCard";

export default function NegativeEmotionStat({ period, value, percent, trend }: {
  period: string; // "week" | "month" | "year"
  value: string;
  percent: string;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Negative"
      value={value}
      percent={percent}
      change={trend}
      icon={<SadIcon width={28} height={28} />}
      bg="bg-[rgba(239,68,68,0.08)]"
      border="border-[rgba(239,68,68,0.5)]"
      compareText={`compare to last ${period}`}
    />
  );
}