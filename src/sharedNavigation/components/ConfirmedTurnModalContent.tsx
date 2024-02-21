import React from "react";
import { Text, View } from "react-native";
import { GenericButton } from "../../components/GenericButton";

interface Props {
  onModalAccept: () => void;
}

export const ConfirmedTurnModalContent = ({ onModalAccept }: Props) => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        rowGap: 8,
      }}
    >
      <Text style={{ fontSize: 40 }}>✅</Text>
      <Text style={{ fontSize: 20 }}>Turno confirmado</Text>
      <GenericButton
        buttonText="Aceptar"
        //   buttonType="primary"
        buttonType="secondary"
        onButtonPress={onModalAccept}
      />
    </View>
  );
};
