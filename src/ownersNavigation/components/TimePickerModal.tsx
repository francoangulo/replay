import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { colors } from "../../theme/appTheme";
import { EditingState } from "../../hooks/useAddFields";

interface Props {
  modalVisible: boolean;
  editing: EditingState;
  currentPickingDate: Date;
  setCurrentPickingDate: React.Dispatch<React.SetStateAction<Date>>;
  currentPickingError: string;
  setCurrentPickingError: React.Dispatch<React.SetStateAction<string>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onScheduleChange: (date: Date) => void;
}

export const TimePickerModal = ({
  modalVisible,
  editing,
  currentPickingDate,
  setCurrentPickingDate,
  currentPickingError,
  setCurrentPickingError,
  setModalVisible,
  onScheduleChange,
}: Props) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View
        style={{
          backgroundColor: colors.appFadeBg,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <View
          style={{
            backgroundColor: colors.appBg,
            borderRadius: 4,
            padding: 16,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
            Selecciona el horario de{" "}
            {editing.editingSchedule === "opening" ? "apertura" : "cierre"}
          </Text>
          <DatePicker
            mode="time"
            date={currentPickingDate}
            minuteInterval={30}
            locale="es_AR"
            title={"Selecciona la hora de Apertura"}
            onDateChange={(date) => {
              setCurrentPickingDate(date);
            }}
          />
          <View
            style={{
              alignItems: "center",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            {currentPickingError && (
              <Text
                style={{
                  color: colors.danger,
                  flexWrap: "wrap",
                  flex: 1,
                  fontSize: 12,
                }}
              >
                {currentPickingError} *
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => {
                setCurrentPickingError("");
                setModalVisible(false);
              }}
            >
              <Text style={{ color: colors.danger, fontWeight: "bold" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => {
                onScheduleChange(currentPickingDate);
              }}
            >
              <Text style={{ color: colors.appBg, fontWeight: "bold" }}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: colors.danger,
    flex: 0.75,
    alignItems: "center",
  },
  modalConfirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 4,
    flex: 1.25,
    alignItems: "center",
  },
});
