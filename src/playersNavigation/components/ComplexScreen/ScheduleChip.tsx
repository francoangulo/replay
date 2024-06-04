import React from "react";
import { View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";
import { colors } from "../../../theme/appTheme";
import { StyleSheet } from "react-native";
import { DateTime } from "luxon";

const weekdaysReference = ["L", "M", "M", "J", "V", "S", "D"];

interface ChipProps {
  weekDays: number[];
  openingTime: string;
  closingTime: string;
}

export const ScheduleChip = ({
  weekDays,
  openingTime,
  closingTime,
}: ChipProps) => {
  return (
    <View
      style={[
        { backgroundColor: colors.primaryThree },
        styles.scheduleChipContainer,
      ]}
    >
      <View style={styles.chipsHeaders}>
        {weekDays?.map((day, weekDayIndex) => (
          <TextComponent
            key={`weekday-${weekDayIndex}`}
            children={weekdaysReference[day]}
            type="text"
          />
        ))}
      </View>
      <TextComponent type="text">
        {DateTime.fromFormat(openingTime, "HH:mm:ss").toFormat("HH:mm")} -{" "}
        {DateTime.fromFormat(closingTime, "HH:mm:ss").toFormat("HH:mm")}
      </TextComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleChipContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  chipsHeaders: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
