import { Picker } from "@react-native-picker/picker";
import { CalendarDays } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  mode: "week" | "month" | "year";
  onChange: (range: { start: Date; end: Date }) => void;
};

export default function WeekMonthYearSelector({ mode, onChange }: Props) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  // Hàm sinh N tuần gần nhất
  const generateLastNWeeks = (n: number = 12) => {
    const weeks: { label: string; start: Date; end: Date }[] = [];
    const today = new Date();

    // Lấy Chủ nhật gần nhất (kết thúc tuần hiện tại)
    const end = new Date(today);
    end.setDate(end.getDate() - end.getDay());

    for (let i = 0; i < n; i++) {
      const start = new Date(end);
      const weekEnd = new Date(end);
      weekEnd.setDate(start.getDate() + 6);

      weeks.unshift({
        label: `${start.getDate()}/${start.getMonth() + 1} - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`,
        start,
        end: weekEnd,
      });

      // lùi lại 1 tuần
      end.setDate(end.getDate() - 7);
    }

    return weeks;
  };

  const weeks = generateLastNWeeks(12);

  // khi chọn tuần
  const handleSelectWeek = (index: number) => {
    setSelectedWeekIndex(index);
    const { start, end } = weeks[index];
    onChange({ start, end });
  };

  // khi chọn tháng
  const handleSelectMonth = (month: number) => {
    setSelectedMonth(month);
    const start = new Date(selectedYear, month, 1);
    const end = new Date(selectedYear, month + 1, 0);
    onChange({ start, end });
  };

  // khi chọn năm
  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    onChange({ start, end });
  };

  return (
    <View className="w-full items-center mb-4">
      {mode === "week" && (
        <View className="w-[210px] h-[48px] flex-row items-center bg-[#5204BF]/30 rounded-lg px-2">
          <CalendarDays size={18} color="white" style={{ marginRight: 6 }} />
          {/* Picker */}
          <Picker
            selectedValue={selectedWeekIndex}
            onValueChange={handleSelectWeek}
            dropdownIconColor="white"
            style={styles.picker}
          >
            {weeks.map((w, i) => (
              <Picker.Item key={i} label={w.label} value={i} />
            ))}
          </Picker>
        </View>
      )}

      {mode === "month" && (
        <View className="w-[200px] h-[48px] flex-row items-center bg-[#5204BF]/30 rounded-lg px-2">
          <CalendarDays size={18} color="white" style={{ marginRight: 6 }} />
          {/* Picker */}
          <Picker
            selectedValue={selectedMonth}
            onValueChange={handleSelectMonth}
            dropdownIconColor="white"
            style={styles.picker}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, i) => (
              <Picker.Item key={i} label={month} value={i} />
            ))}
          </Picker>
        </View>
      )}

      {mode === "year" && (
        <View className="w-[150px] h-[48px] flex-row items-center bg-[#5204BF]/30 rounded-lg px-2">
          <CalendarDays size={18} color="white" style={{ marginRight: 6 }} />
          {/* Picker */}
          <Picker
            selectedValue={selectedYear}
            onValueChange={handleSelectYear}
            dropdownIconColor="white"
            style={styles.picker}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return <Picker.Item key={year} label={year.toString()} value={year} />;
            })}
          </Picker>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    flex: 1,
    color: "white",
    textAlign: "center", // căn giữa text (Android)
    paddingVertical: 0,
    marginVertical: -6, // giảm chiều cao mặc định
  },
});