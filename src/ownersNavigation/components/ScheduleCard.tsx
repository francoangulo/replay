import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { colors, cardStyle } from "../../theme/appTheme";
import { EditingState } from "../../hooks/useAddFields";
import IonIcon from "react-native-vector-icons/Ionicons";
import CheckBox from "@react-native-community/checkbox";

export interface ScheduleState {
  openingHour: string;
  openingMinute: string;
  closingHour: string;
  closingMinute: string;
  weekDays: number[];
}

interface Props {
  scheduleIdx: number;
  setPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onEditing: (editing: EditingState) => void;
  onDeleteSchedule: (scheduleIdx: number) => void;
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
  onDeleteSchedule,
  schedulesLength,
  scheduleError,
  onWeekDaysChange,
}: Props) => {
  const { openingHour, openingMinute, closingHour, closingMinute } = schedule;

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
    <View key={`schedule-${scheduleIdx}`} style={{ flex: 1, width: "100%" }}>
      <View
        style={{
          gap: 8,
          flex: 1,
          width: "100%",
          ...(cardStyle as Object),
        }}
      >
        <View style={{ gap: 16, flexDirection: "row" }}>
          <View
            style={{
              alignItems: "center",
              gap: 8,
              flex: 1,
            }}
          >
            <Text style={{ ...(openingError && { color: colors.danger }) }}>
              Apertura
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 4,
                backgroundColor: colors.inputBg,
                padding: 4,
                borderRadius: 8,
              }}
              onPress={() => {
                onEditing({ scheduleIdx, editingSchedule: "opening" });
                setPickerVisible(true);
              }}
            >
              <Text
                style={{
                  backgroundColor: `${colors.appBg}`,
                  padding: 2,
                  ...(openingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {openingHour[0]}
              </Text>
              <Text
                style={{
                  backgroundColor: `${colors.appBg}`,
                  padding: 2,
                  ...(openingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {openingHour[1]}
              </Text>
              <Text style={{ ...(openingError && { color: colors.danger }) }}>
                :
              </Text>
              <Text
                style={{
                  backgroundColor: `${colors.appBg}`,
                  padding: 2,
                  ...(openingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {openingMinute[0]}
              </Text>
              <Text
                style={{
                  backgroundColor: `${colors.appBg}`,
                  padding: 2,
                  ...(openingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {openingMinute[1]}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: "center", gap: 8, flex: 1 }}>
            <Text style={{ ...(closingError && { color: colors.danger }) }}>
              Cierre
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                gap: 4,
                backgroundColor: "#e9e9e9",
                padding: 4,
                borderRadius: 8,
              }}
              onPress={() => {
                onEditing({ scheduleIdx, editingSchedule: "closing" });
                setPickerVisible(true);
              }}
            >
              <Text
                style={{
                  backgroundColor: colors.appBg,
                  padding: 2,
                  ...(closingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {closingHour[0]}
              </Text>
              <Text
                style={{
                  backgroundColor: colors.appBg,
                  padding: 2,
                  ...(closingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {closingHour[1]}
              </Text>
              <Text style={{ ...(closingError && { color: colors.danger }) }}>
                :
              </Text>
              <Text
                style={{
                  backgroundColor: colors.appBg,
                  padding: 2,
                  ...(closingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {closingMinute[0]}
              </Text>
              <Text
                style={{
                  backgroundColor: colors.appBg,
                  padding: 2,
                  ...(closingError && { color: colors.danger }),
                  fontSize: 20,
                  borderRadius: 4,
                }}
              >
                {closingMinute[1]}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* weekdays array below */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: 16,
            marginTop: 16,
          }}
        >
          {weekDays.map(({ index: dayIndex, label }, idx) => {
            return (
              <View
                style={{ alignItems: "center", gap: 4 }}
                key={`day-check-${idx}`}
              >
                <View style={{ width: 20, height: 20 }}>
                  <CheckBox
                    disabled={false}
                    value={schedule.weekDays.includes(dayIndex)}
                    onValueChange={(newValue) => {
                      onWeekDaysChange(scheduleIdx, dayIndex, newValue);
                    }}
                    style={{ width: 20, height: 20 }}
                    onCheckColor={colors.primary}
                    onTintColor={colors.primary}
                  />
                </View>
                <Text>{label.slice(0, 3)}</Text>
              </View>
            );
          })}
        </View>
        {schedulesLength > 1 ? (
          <TouchableOpacity
            style={{
              justifyContent: "center",
              flex: 1,
              borderWidth: 1,
              borderColor: colors.danger,
              alignItems: "center",
              padding: 8,
              borderRadius: 5,
              borderStyle: "dashed",
            }}
            onPress={() => onDeleteSchedule(scheduleIdx)}
          >
            <IonIcon name="trash-outline" color={colors.danger} size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
      {closingError && (
        <Text style={{ fontSize: 12, color: colors.danger }}>
          {scheduleError.error}
        </Text>
      )}
    </View>
  );
};
