import React from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";
import IonIcon from "react-native-vector-icons/Ionicons";

export const NoExtraPicturesComponent = ({
  openImagesPicker,
}: {
  openImagesPicker: () => Promise<void>;
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[cardStyle, styles.buttonCard]}
          onPress={openImagesPicker}
        >
          <View style={styles.noPicturesTitleContainer}>
            <TextComponent children={"Sin fotos aún"} type="title" />
          </View>
          <View style={styles.noPicturesSubtitleContainer}>
            <TextComponent
              children={"Toca para agregar fotos"}
              type="subtitle"
            />
            <IonIcon
              name="add-circle-outline"
              color={colors.primary}
              size={42}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonCard: {
    width: "80%",
    height: "80%",
    alignItems: "center",
    gap: 16,
    padding: 32,
  },
  noPicturesTitleContainer: { flex: 0.9 },
  noPicturesSubtitleContainer: { flex: 1.1, alignItems: "center", gap: 16 },
});
