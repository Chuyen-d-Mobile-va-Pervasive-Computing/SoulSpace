import StatCard from "./StatCard";

export default function PositiveEmotionStat({
  period,
  percentage,
  trend,
}: {
  period: "week" | "month" | "year";
  percentage: number;
  trend: "up" | "down" | "equal";
}) {
  return (
    <StatCard
      title="Positive emotion"
      value={percentage.toFixed(0)}
      suffix="%"
      change={trend}
      bg="bg-white"
      compareText={`Compared to last ${period}`}
    />
  );
}