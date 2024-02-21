import React from "react";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MIcon from "react-native-vector-icons/MaterialIcons";
import { Turn } from "../../interfaces/Turns";
import { Complex } from "../../interfaces/complexes";
import { colors } from "../../theme/appTheme";
import { onViewLocation } from "../../utils/utils";

interface Props {
  turn: Turn;
  complex: Complex;
}

export const ViewLocationButton = ({ turn, complex }: Props) => {
  return (
    <TouchableOpacity
      style={{
        ...styles.button,
        backgroundColor: turn.confirmed ? colors.primaryThree : `#FAEEEF`,
      }}
      onPress={() => onViewLocation(complex)}
    >
      <View style={styles.buttonTextContainer}>
        <Text>Ver ubicación </Text>
        <Text style={styles.mapsText}>(Mapas)</Text>
      </View>
      <MIcon name="share-location" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  buttonTextContainer: { flexDirection: "row" },
  mapsText: { opacity: 0.3 },
});
