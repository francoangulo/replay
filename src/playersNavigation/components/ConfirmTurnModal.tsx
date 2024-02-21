import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors, paddings, titleStyle } from "../../theme/appTheme";
import { SelectedTurnState } from "../screens/ComplexScreen";

interface ConfirmTurnModalProps {
  modalVisible: boolean;
  setModalVisible: (value: React.SetStateAction<boolean>) => void;
  selectedTurn: SelectedTurnState;
  submitTurn: () => void;
}

export const ConfirmTurnModal = ({
  modalVisible,
  setModalVisible,
  selectedTurn,
  submitTurn,
}: ConfirmTurnModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContentContainer}>
            <Text style={titleStyle}>Reservar turno</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <IonIcon name="close-outline" size={24} color={"red"} />
            </TouchableOpacity>
          </View>
          <Text style={{}}>
            ¿Quieres reservar el turno de las{" "}
            {selectedTurn?.turnTime?.toFormat("HH:mm")}?
          </Text>
          <View style={styles.footerButtonsRow}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submitTurn}>
              <Text>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  footerButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000044",
  },
  modalBackground: {
    backgroundColor: colors.cardBg,
    padding: 16,
    borderRadius: paddings.globalRadius,
    gap: 16,
  },
  modalContentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
