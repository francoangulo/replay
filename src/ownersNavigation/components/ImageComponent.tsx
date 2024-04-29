import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "../../theme/appTheme";

interface ImageComponentProps {
  containerStyle: StyleProp<ViewStyle>;
  imageStyle: StyleProp<ImageStyle>;
  removingState: boolean;
  selectedImagesForRemove: string[];
  uriData: {
    imageURL: string;
    imageKey: string;
  };
  onSelectedForRemove: (imageKey: string) => void;
  onImagePress: (imageUri: string) => void;
}

export const ImageComponent = ({
  containerStyle,
  imageStyle,
  removingState,
  selectedImagesForRemove,
  uriData,
  onSelectedForRemove,
  onImagePress,
}: ImageComponentProps) => {
  const [loading, setLoading] = useState(true);
  const selectedForRemove = selectedImagesForRemove.includes(uriData.imageKey);
  return (
    <TouchableOpacity
      style={[styles.imageContainer, containerStyle]}
      onPress={() => {
        if (removingState) {
          onSelectedForRemove(uriData.imageKey);
        } else {
          onImagePress(uriData.imageURL);
        }
      }}
      activeOpacity={0.8}
    >
      {removingState ? (
        <View
          style={[
            styles.removingSelector,
            {
              backgroundColor: selectedForRemove
                ? colors.primary
                : colors.appBg,
            },
          ]}
        />
      ) : null}

      {selectedForRemove ? (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: `${colors.appBg}88`,
            position: "absolute",
            zIndex: 1,
          }}
        />
      ) : null}
      <Image
        source={{ uri: uriData.imageURL }}
        style={[imageStyle]}
        onLoad={() => setLoading(false)}
      />
      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: { justifyContent: "center", alignItems: "center" },
  loader: {
    position: "absolute",
  },
  removingSelector: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: colors.appBg,
    position: "absolute",
    width: 18,
    height: 18,
    zIndex: 2,
    top: 10,
    right: 10,
  },
});
