import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";

interface Props {
  onCapture: () => Promise<void>;
}

export const ShareButton = ({ onCapture }: Props) => {
  return (
    <TouchableOpacity style={styles.shareButton} onPress={onCapture}>
      <Text style={styles.shareText}>Compartir</Text>
      <IonIcon name="share-social" color={colors.cardBg} size={20} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  shareButton: {
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 5,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareText: { color: "#ffffff", fontWeight: "bold" },
});
