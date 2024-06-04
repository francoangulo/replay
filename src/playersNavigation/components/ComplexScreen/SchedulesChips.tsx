import React from "react";
import { StyleSheet, View } from "react-native";
import { ComplexSchedule } from "../../../interfaces/ComplexesSchedules";
import { ScheduleChip } from "./ScheduleChip";

interface Props {
  complexSchedules: ComplexSchedule[];
}

export const SchedulesChips = ({ complexSchedules }: Props) => {
  return (
    <View style={styles.schedulesChips}>
      {complexSchedules?.map(({ openingTime, closingTime, weekDays }, idx) => {
        return (
          <ScheduleChip
            closingTime={closingTime}
            openingTime={openingTime}
            weekDays={weekDays}
            key={`complex-schedule-chip-${idx}`}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  schedulesChips: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    gap: 16,
  },
});
