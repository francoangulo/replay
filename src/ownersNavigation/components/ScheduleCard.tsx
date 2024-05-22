import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors, cardStyle } from "../../theme/appTheme";
import { EditingState, ScheduleState } from "../../hooks/useAddFields";
import IonIcon from "react-native-vector-icons/Ionicons";
import CheckBox from "@react-native-community/checkbox";
import { StyleSheet } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { TimePickerLabel } from "./TimePickerLabel";

interface Props {
  scheduleIdx: number;
  setPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onEditing: (editing: EditingState) => void;
  onDeleteSchedule?: (scheduleIdx: number) => void;
  onDeleteExistingSchedule?: (scheduleIdx: number, _id: string) => void;
  schedule: ScheduleState;
  schedulesLength: number;
  scheduleError: {
    scheduleIdx: number[];
    scheduleType: string;
    error: string;
  };
  onWeekDaysChange: (
    scheduleIdx: number,
    dayIdx: number,
    dayValue: boolean
  ) => void;
}

export const ScheduleCard = ({
  scheduleIdx,
  setPickerVisible,
  schedule,
  onEditing,
  onDeleteSchedule = () => {},
  onDeleteExistingSchedule = () => {},
  schedulesLength,
  scheduleError,
  onWeekDaysChange,
}: Props) => {
  const { openingHour, openingMinute, closingHour, closingMinute, _id } =
    schedule;

  const closingError =
    scheduleError.scheduleIdx.includes(scheduleIdx) &&
    (scheduleError.scheduleType === "closing" ||
      scheduleError.scheduleType === "both");

  const openingError =
    scheduleError.scheduleIdx.includes(scheduleIdx) &&
    (scheduleError.scheduleType === "opening" ||
      scheduleError.scheduleType === "both");

  const weekDays = [
    { index: 0, label: "Lunes" },
    { index: 1, label: "Martes" },
    { index: 2, label: "Miércoles" },
    { index: 3, label: "Jueves" },
    { index: 4, label: "Viernes" },
    { index: 5, label: "Sábado" },
    { index: 6, label: "Domingo" },
  ];

  return (
    <View key={`schedule-${scheduleIdx}`} style={styles.cardContainer}>
      <View style={[cardStyle, styles.card]}>
        <View style={styles.pickersRow}>
          <View style={styles.pickerContainer}>
            <TextComponent
              type="text"
              children={"Apertura"}
              customStyles={{
                color: openingError ? colors.danger : colors.textDark,
              }}
            />
            <TimePickerLabel
              error={openingError}
              hour={openingHour}
              minute={openingMinute}
              onPickerPress={() => {
                onEditing({ scheduleIdx, editingSchedule: "opening" });
                setPickerVisible(true);
              }}
            />
          </View>
          <View style={styles.pickerContainer}>
            <TextComponent
              type="text"
              children={"Cierre"}
              customStyles={{
                color: closingError ? colors.danger : colors.textDark,
              }}
            />
            <TimePickerLabel
              error={closingError}
              hour={closingHour}
              minute={closingMinute}
              onPickerPress={() => {
                onEditing({ scheduleIdx, editingSchedule: "closing" });
                setPickerVisible(true);
              }}
            />
          </View>
        </View>
        {/* weekdays array below */}
        <View style={styles.weekdaysContainer}>
          {weekDays.map(({ index: dayIndex, label }, idx) => {
            return (
              <View style={styles.weekdayColumn} key={`day-check-${idx}`}>
                <CheckBox
                  disabled={false}
                  value={schedule.weekDays.includes(dayIndex)}
                  onValueChange={(newValue) => {
                    onWeekDaysChange(scheduleIdx, dayIndex, newValue);
                  }}
                  style={styles.weekdayCheckbox}
                  onCheckColor={colors.primary}
                  onTintColor={colors.primary}
                />
                <Text>{label.slice(0, 3)}</Text>
              </View>
            );
          })}
        </View>
        {schedulesLength > 1 ? (
          <TouchableOpacity
            style={styles.removeScheduleButton}
            onPress={() => {
              _id
                ? onDeleteExistingSchedule(scheduleIdx, _id)
                : onDeleteSchedule(scheduleIdx);
            }}
          >
            <IonIcon name="trash-outline" color={colors.danger} size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
      {closingError && (
        <TextComponent
          type="text"
          children={scheduleError.error}
          customStyles={{ color: colors.danger }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: { flex: 1, width: "100%" },
  card: {
    gap: 8,
    flex: 1,
    width: "100%",
  },
  pickersRow: { gap: 16, flexDirection: "row" },
  pickerContainer: {
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 16,
    marginTop: 16,
  },
  weekdayColumn: { alignItems: "center", gap: 4 },
  weekdayCheckbox: { width: 20, height: 20 },
  removeScheduleButton: {
    borderColor: colors.danger,
    justifyContent: "center",
    flex: 1,
    borderWidth: 1,
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    borderStyle: "dashed",
  },
});
