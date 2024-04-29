import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../../theme/appTheme";

interface FullscreenImageBodyProps {
  imageUri: string;
  onImageClose: () => void;
}

export const FullscreenImageBody = ({
  imageUri,
  onImageClose,
}: FullscreenImageBodyProps) => {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <View style={styles.fullscreenModalContainer}>
      <TouchableOpacity
        style={styles.closeImageModalRow}
        onPress={onImageClose}
      >
        <IonIcon name="close" color={colors.danger} size={32} />
      </TouchableOpacity>

      <Image
        source={{ uri: imageUri }}
        style={styles.fullscreenImage}
        onLoad={() => setLoadingImage(false)}
      />
      {loadingImage ? (
        <ActivityIndicator style={styles.imageLoader} color={colors.primary} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenModalContainer: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: colors.appBg,
    padding: 0,
  },
  closeImageModalRow: {
    alignItems: "flex-end",
    position: "absolute",
    right: 0,
    zIndex: 1,
    padding: 8,
    backgroundColor: colors.appFadeBg,
    borderRadius: 24,
    borderBottomEndRadius: 0,
    borderTopStartRadius: 0,
  },
  fullscreenImage: {
    width: "100%",
    aspectRatio: 9 / 16,
    borderRadius: 24,
    zIndex: -1,
  },

  imageLoader: {
    position: "absolute",
    zIndex: 2,
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
