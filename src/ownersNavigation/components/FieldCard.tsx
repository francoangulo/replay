import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FieldScheduleState, ScheduleCard } from "./ScheduleCard";
import { cardStyle, colors } from "../../theme/appTheme";
import { EditingState } from "../../hooks/useAddFields";
import { DashedBorder } from "../../components/DashedBorder";
import IonIcon from "react-native-vector-icons/Ionicons";

interface Props {
  fieldIdx: number;
  fieldSchedules: FieldScheduleState[];
  addSchedule: (fieldIdx: number) => void;
  setPickerVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onEditing: (editing: EditingState) => void;
  onDelete: (fieldIdx: number) => void;
  onDeleteSchedule: (fieldIdx: number, scheduleIdx: number) => void;
  fieldsLength: number;
  fieldError: {
    fieldIdx: number;
    scheduleIdx: number;
    error: string;
    scheduleType: string;
  };
}

export const FieldCard = ({
  fieldIdx,
  fieldSchedules,
  addSchedule,
  setPickerVisible,
  onEditing,
  onDelete,
  onDeleteSchedule,
  fieldsLength,
  fieldError,
}: Props) => {
  const fieldNumber = fieldIdx + 1;
  return (
    <View style={styles.fieldCardWrapper}>
      <View style={styles.schedulesWrapper}>
        {fieldSchedules.map((fieldSchedule, scheduleIdx) => {
          return (
            <ScheduleCard
              key={`schedule-card-${scheduleIdx}`}
              fieldIdx={fieldIdx}
              scheduleIdx={scheduleIdx}
              setPickerVisible={setPickerVisible}
              fieldSchedule={fieldSchedule}
              onEditing={onEditing}
              schedulesLength={fieldSchedules.length}
              onDeleteSchedule={onDeleteSchedule}
              fieldError={fieldError}
            />
          );
        })}
        <TouchableOpacity
          style={styles.addScheduleButton}
          onPress={() => addSchedule(fieldIdx)}
        >
          <Text>Agregar otro horario</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fieldNumberWrapper}>
        <DashedBorder orientation={"vertical"} />
        <View>
          <Text style={styles.fieldNumber}>{fieldNumber}</Text>
          {fieldsLength > 1 ? (
            <TouchableOpacity onPress={() => onDelete(fieldIdx)}>
              <IonIcon name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldCardWrapper: {
    ...(cardStyle as Object),
    paddingVertical: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  schedulesWrapper: {
    paddingVertical: 16,
    flex: 1,
    paddingRight: 32,
    justifyContent: "center",
    gap: 12,
  },
  addScheduleButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 4,
    padding: 4,
  },
  fieldNumberWrapper: {
    flexDirection: "row",
    gap: 24,
    overflow: "hidden",
    alignItems: "center",
    width: 60,
  },
  fieldNumber: {
    fontSize: 50,
    color: colors.primary,
  },
});
