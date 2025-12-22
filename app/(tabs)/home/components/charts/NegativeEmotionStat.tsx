import StatCard from "./StatCard";

export default function NegativeEmotionStat({
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
      title="Negative"
      value={percentage.toFixed(0)}
      suffix="%"
      change={trend}
      bg="bg-[#ffffff]"
      compareText={`compare to last ${period}`}
    />
  );
}
