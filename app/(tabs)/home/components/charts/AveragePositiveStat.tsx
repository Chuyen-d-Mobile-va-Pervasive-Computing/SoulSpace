import StatCard from "./StatCard";

export default function AveragePositiveStat({
  period,
  percentage = 0,
  trend,
}: {
  period: "week" | "month" | "year";
  percentage?: number;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Average Positive Emotion"
      value={percentage.toFixed(0)}
      suffix="%"
      change={trend}
      bg="bg-[#ffffff]"
      compareText={`compare to last ${period}`}
    />
  );
}
