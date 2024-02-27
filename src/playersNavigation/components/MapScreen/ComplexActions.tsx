import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GenericButton } from "../../../components/GenericButton";
import { cardStyle, colors } from "../../../theme/appTheme";
import { Complex } from "../../../interfaces/complexes";

interface Props {
  selectedComplex: Complex;
  onClose: () => void;
  onViewTurns: () => void;
  onViewLocation: (selectedComplex: Complex) => void;
}

export const ComplexActions = ({
  selectedComplex,
  onClose,
  onViewTurns,
  onViewLocation,
}: Props) => {
  return (
    <View style={[cardStyle, styles.cardContainer]}>
      <View style={[styles.headerRow]}>
        <TextComponent children={selectedComplex.name} type="title" />
        <IonIcon
          name="close"
          color={colors.danger}
          size={24}
          onPress={onClose}
        />
      </View>
      <View style={styles.buttonsRow}>
        <GenericButton
          buttonText="Ver turnos"
          buttonType="primary"
          onButtonPress={onViewTurns}
          customButtonStyle={styles.button}
        />

        <GenericButton
          buttonText={
            Platform.OS === "android" ? "Ver en Maps" : "Ver en Mapas"
          }
          buttonType="secondary"
          onButtonPress={() => onViewLocation(selectedComplex)}
          customButtonStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: { borderRadius: 0, gap: 12 },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  buttonsRow: { flexDirection: "row", gap: 16, paddingHorizontal: 12 },
  button: { flex: 1, marginTop: 0 },
});
