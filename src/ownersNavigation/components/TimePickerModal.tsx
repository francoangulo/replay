import React from "react";
import { Modal, StyleSheet, View } from "react-native";
import DatePicker from "react-native-date-picker";
import { colors } from "../../theme/appTheme";
import { EditingState, useAddFields } from "../../hooks/useAddFields";
import { TextComponent } from "../../components/TextComponent";
import { GenericButton } from "../../components/GenericButton";

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
  const {} = useAddFields();

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View
        style={[
          { backgroundColor: colors.appFadeBg },
          styles.modalScreenContainer,
        ]}
      >
        <View
          style={[{ backgroundColor: colors.appBg }, styles.modalCardContainer]}
        >
          <TextComponent
            children={`Selecciona el horario de ${
              editing.editingSchedule === "opening" ? "apertura" : "cierre"
            }`}
            type="subtitle"
          />

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
          <View style={styles.errorContainer}>
            {currentPickingError && (
              <TextComponent
                children={`${currentPickingError} *`}
                type="text"
                customStyles={styles.errorText}
              />
            )}
          </View>
          <View style={styles.modalFooter}>
            <GenericButton
              buttonText="Cancelar"
              onButtonPress={() => {
                setCurrentPickingError("");
                setModalVisible(false);
              }}
              buttonType="dangerNoBg"
              customButtonStyle={styles.footerButtons}
            />
            <GenericButton
              buttonText="Confirmar"
              buttonType="primary"
              onButtonPress={() => onScheduleChange(currentPickingDate)}
              customButtonStyle={styles.footerButtons}
            />
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
  modalScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalCardContainer: {
    borderRadius: 16,
    padding: 16,
  },
  errorContainer: {
    alignItems: "center",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  errorText: { color: colors.danger },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  footerButtons: {
    flex: 1,
  },
});
