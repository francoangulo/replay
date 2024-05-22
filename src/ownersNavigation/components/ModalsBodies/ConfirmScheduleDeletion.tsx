import React from "react";
import { StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";
import { GenericButton } from "../../../components/GenericButton";

interface ModalProps {
  onCancel: () => void;
  onDelete: () => void;
}

export const ConfirmScheduleDeletion = ({ onCancel, onDelete }: ModalProps) => {
  return (
    <View style={styles.contentContainer}>
      <TextComponent
        type="subtitle"
        children={"¿Estás seguro de que deseas eliminar este horario?"}
      />
      <TextComponent
        type="text"
        children={"Esta acción no se puede deshacer"}
      />
      <View style={styles.buttonsContainer}>
        <GenericButton
          buttonText="Cancelar"
          buttonType="secondary"
          onButtonPress={onCancel}
          customButtonStyle={styles.buttons}
        />
        <GenericButton
          buttonText="Confirmar"
          buttonType="dangerNoBg"
          onButtonPress={onDelete}
          customButtonStyle={styles.buttons}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  buttons: { flex: 1 },
});
