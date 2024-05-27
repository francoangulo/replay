import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { cardStyle, colors } from "../../theme/appTheme";
import { Complex, GetComplexImageResponse } from "../../interfaces/complexes";
import replayAPI from "../../api/api";

interface CardComponentProps {
  onPressCallback: () => void;
  complex: Complex;
}

export const ComplexCard = ({
  onPressCallback,
  complex,
}: CardComponentProps) => {
  const [complexImageURL, setComplexImageURL] = useState<string>();

  const getComplexImageURL = async () => {
    try {
      const response = await replayAPI.get<GetComplexImageResponse>(
        "complexes/image",
        { params: { imageKey: complex.mainPictureKey } }
      );

      setComplexImageURL(response.data.imageURL.imageURL);
    } catch (error) {
      console.error("Error getting complex image URL", error);
    }
  };

  useEffect(() => {
    getComplexImageURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPressCallback}
      style={styles.complexCard}
    >
      <View style={styles.imageContainer}>
        {!complexImageURL ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={20} color={colors.primary} />
          </View>
        ) : (
          <Image style={styles.image} source={{ uri: complexImageURL }} />
        )}
      </View>
      <View style={styles.complexDataContainer}>
        <TextComponent type="subtitle">{complex.name}</TextComponent>
        <TextComponent type="text">{complex.address}</TextComponent>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  complexDataContainer: {
    rowGap: 8,
    padding: 16,
  },
  complexCard: {
    ...(cardStyle as Object),
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 8,
    flex: 1,
  },
  imageContainer: { borderRadius: 12, aspectRatio: 16 / 9, width: "100%" },
  loaderContainer: { flex: 1, justifyContent: "center" },
  image: { flex: 1, borderRadius: 12 },
});
