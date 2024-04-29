import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { colors } from "../../theme/appTheme";

export const LoadingExtraPicturesComponent = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.loadingMessageContainer}>
        <TextComponent children={"Cargando fotos..."} type="title" />
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loadingMessageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});
