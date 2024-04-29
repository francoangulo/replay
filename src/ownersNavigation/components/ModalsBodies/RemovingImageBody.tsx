import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";
import { colors } from "../../../theme/appTheme";

export const RemovingImageBody = () => {
  return (
    <View style={styles.feedbackModalContainer}>
      <TextComponent children={"Eliminando imágenes"} type="subtitle" />
      <ActivityIndicator color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackModalContainer: { gap: 16, alignItems: "center" },
});
