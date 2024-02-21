import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { GenericButton } from "../../components/GenericButton";
import { colors } from "../../theme/appTheme";

interface Props {
  onInputChange: (distance: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}
export const DistanceModalContent = ({
  onInputChange,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <View style={styles.modalContainer}>
      <TextComponent
        type="subtitle"
        children={"Ingresa la distancia en kilómetros"}
      />
      <TextInput
        inputMode="numeric"
        placeholder="5"
        style={styles.kmInput}
        onChangeText={(distance) => {
          onInputChange(parseInt(distance, 10));
        }}
      />

      <View style={styles.modalButtonsContainer}>
        <GenericButton
          buttonText="Cancelar"
          buttonType="secondary"
          onButtonPress={onCancel}
          customButtonStyle={{ flex: 1 }}
        />
        <GenericButton
          buttonText="Aceptar"
          buttonType="primary"
          onButtonPress={onConfirm}
          customButtonStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: { justifyContent: "center", gap: 8 },
  kmInput: {
    borderRadius: 5,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 0,
  },
  modalButtonsContainer: { flexDirection: "row", width: "100%", gap: 12 },
});
