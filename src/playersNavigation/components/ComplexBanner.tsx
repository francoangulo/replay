import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Complex } from "../../interfaces/complexes";
import { colors } from "../../theme/appTheme";
import { useComplexMainPicture } from "../../hooks/useComplexMainPicture";
import { ImageColorsResult } from "react-native-image-colors/lib/typescript/types";
import ImageColors from "react-native-image-colors";

interface BannerProps {
  complex: Complex;
}

export const ComplexBanner = ({ complex }: BannerProps) => {
  const [imageColor, setImageColor] = useState<string>("");

  const { complexMainPicture } = useComplexMainPicture({
    complexId: complex._id,
    mainPictureKey: complex.mainPictureKey,
  });

  const getImagePrimaryColor = async () => {
    const colorsResult: ImageColorsResult = await ImageColors.getColors(
      complexMainPicture,
      {
        fallback: colors.primary,
        cache: true,
        key: complexMainPicture,
      }
    );

    if (colorsResult.platform === "ios") {
      setImageColor(colorsResult.primary);
    } else {
      if (colorsResult.platform === "android") {
        setImageColor(colorsResult.average || colors.primary);
      }
    }
  };

  useEffect(() => {
    if (complexMainPicture?.length) {
      getImagePrimaryColor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexMainPicture]);

  return (
    <View style={styles.pictureContainer}>
      {complexMainPicture?.length ? (
        <View style={[styles.imageShadow, { shadowColor: imageColor }]}>
          <Image
            source={{ uri: complexMainPicture }}
            style={[styles.complexPicture]}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  complexPicture: { aspectRatio: 16 / 7, borderRadius: 24 },
  pictureContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  bannerImage: { width: "100%", aspectRatio: 16 / 7, zIndex: -1 },
  imageShadow: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15.46,

    elevation: 9,
  },
});
