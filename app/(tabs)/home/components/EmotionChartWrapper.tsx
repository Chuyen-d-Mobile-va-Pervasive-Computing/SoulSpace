import React from "react";
import EmotionLineChart from "./charts/EmotionLineChart";
import EmotionMonthChart from "./charts/EmotionMonthChart";
import EmotionYearChart from "./charts/EmotionYearChart";
import { ChartItem } from "@/constants/types";

export default function EmotionChartWrapper({
  type,
  data,
}: {
  type: "week" | "month" | "year";
  data: ChartItem[];
}) {
  if (type === "week") return <EmotionLineChart data={data} />;
  if (type === "month") return <EmotionMonthChart data={data} />;
  return <EmotionYearChart data={data} />;
}