import StatCard from "./StatCard";

export default function TotalDiaryStat({
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
      title="Total Diary Entries"
      value={percentage.toFixed(0)}
      suffix="entries"
      change={trend}
      bg="bg-[#ffffff]"
      compareText={`compare to last ${period}`}
    />
  );
}
