import { Picker } from "@react-native-picker/picker";
import { CalendarDays, ChevronDown } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import dayjs from "dayjs";

type Mode = "week" | "month" | "year";
type Props = {
  mode: Mode;
  onChange: (range: { startDate: string; endDate: string }) => void;
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const format = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");

const clampEndDate = (end: dayjs.Dayjs) => {
  const today = dayjs().endOf("day");
  return end.isAfter(today) ? today : end;
};

export default function WeekMonthYearSelector({ mode, onChange }: Props) {
  const today = dayjs();
  const [selectedYear, setSelectedYear] = useState(today.year());
  const [selectedMonth, setSelectedMonth] = useState(today.month());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  const weeks = useMemo(() => {
    const result: {
      label: string;
      start: dayjs.Dayjs;
      end: dayjs.Dayjs;
    }[] = [];

    let end = today.endOf("week");
    for (let i = 0; i < 12; i++) {
      const start = end.startOf("week");

      result.unshift({
        label: `${start.format("DD/MM")} - ${end.format("DD/MM")}`,
        start,
        end: clampEndDate(end),
      });
      end = start.subtract(1, "day").endOf("week");
    }
    return result;
  }, []);

  const handleSelectWeek = (index: number) => {
    setSelectedWeekIndex(index);
    const w = weeks[index];

    onChange({
      startDate: format(w.start),
      endDate: format(w.end),
    });
  };

  const handleSelectMonth = (month: number) => {
    setSelectedMonth(month);

    const start = dayjs()
      .year(selectedYear)
      .month(month)
      .startOf("month");

    const end = clampEndDate(start.endOf("month"));

    onChange({
      startDate: format(start),
      endDate: format(end),
    });
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);

    const start = dayjs().year(year).startOf("year");
    const end = clampEndDate(start.endOf("year"));

    onChange({
      startDate: format(start),
      endDate: format(end),
    });
  };

  const visibleLabel =
    mode === "week"
      ? weeks[selectedWeekIndex]?.label ?? ""
      : mode === "month"
      ? MONTHS[selectedMonth]
      : String(selectedYear);

  const containerWidth =
    mode === "week" ? 220 : mode === "month" ? 190 : 140;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.outerContainer, { width: containerWidth }]}>
        <CalendarDays size={18} color="#7F56D9" style={{ marginLeft: 4 }} />

        <View style={styles.centerDisplay}>
          <Text numberOfLines={1} style={styles.centerLabel}>
            {visibleLabel}
          </Text>
          <ChevronDown size={16} color="#7F56D9" style={{ marginLeft: 8 }} />
        </View>

        {mode === "week" && (
          <Picker
            selectedValue={selectedWeekIndex}
            onValueChange={handleSelectWeek}
            style={styles.invisiblePicker}
          >
            {weeks.map((w, i) => (
              <Picker.Item key={i} label={w.label} value={i} />
            ))}
          </Picker>
        )}

        {mode === "month" && (
          <Picker
            selectedValue={selectedMonth}
            onValueChange={handleSelectMonth}
            style={styles.invisiblePicker}
          >
            {MONTHS.map((m, i) => (
              <Picker.Item key={i} label={m} value={i} />
            ))}
          </Picker>
        )}

        {mode === "year" && (
          <Picker
            selectedValue={selectedYear}
            onValueChange={handleSelectYear}
            style={styles.invisiblePicker}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const y = today.year() - i;
              return <Picker.Item key={y} label={String(y)} value={y} />;
            })}
          </Picker>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  outerContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 3,
  },
  centerDisplay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    color: "#7F56D9",
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    maxWidth: "75%",
  },
  invisiblePicker: {
    position: "absolute",
    inset: 0,
    opacity: 0,
  },
});