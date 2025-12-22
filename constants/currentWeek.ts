import dayjs from "dayjs";

export function getPreviousWeekRange() {
  const start = dayjs()
    .subtract(1, "week")
    .startOf("week"); // Chủ nhật

  const end = dayjs()
    .subtract(1, "week")
    .endOf("week"); // Thứ 7

  return {
    startDate: start.format("YYYY-MM-DD"),
    endDate: end.format("YYYY-MM-DD"),
  };
}