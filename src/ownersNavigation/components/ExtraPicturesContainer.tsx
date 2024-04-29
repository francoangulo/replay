import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";
import { ImageComponent } from "./ImageComponent";
import { AddImagePlaceholder } from "./AddImagePlaceholder";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Complex } from "../../interfaces/complexes";
import { TextComponent } from "../../components/TextComponent";
import { TOP_HEADER_HEIGHT } from "../../utils/constants";

interface Props {
  complex: Complex;
  selectedImagesForRemove: string[];
  onSelectedForRemove: (imageKey: string) => void;
  openImagesPicker: () => Promise<void>;
  removeSelectedImages: () => void;
  onImagePress: (imageUri: string) => void;
}

export const ExtraPicturesContainer = ({
  complex,
  selectedImagesForRemove,
  onSelectedForRemove,
  openImagesPicker,
  removeSelectedImages,
  onImagePress,
}: Props) => {
  const [removingState, setRemovingState] = useState(false);
  const { top: safeTop } = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  // following value is calculated subtracting
  // the padding of the container and the gap between the cards
  const imageCardWidth = (screenWidth - 32 - 16) / 3;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.picturesHeader,
          {
            paddingTop: safeTop,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setRemovingState(!removingState)}>
          <TextComponent
            children={removingState ? "Cancelar" : "Seleccionar"}
            type="subtitle"
            customStyles={{ color: colors.primary }}
          />
        </TouchableOpacity>
        {removingState && selectedImagesForRemove?.length ? (
          <TouchableOpacity onPress={removeSelectedImages}>
            <IonIcon name="trash-outline" color={colors.danger} size={24} />
          </TouchableOpacity>
        ) : null}
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1, paddingTop: safeTop }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.imagesContainer, { paddingTop: safeTop }]}>
          {complex?.extraPicturesURLs?.map((uriData) => (
            <ImageComponent
              key={`complex-extra-picture-${Math.random()}`}
              uriData={uriData}
              containerStyle={[styles.imageCard, { width: imageCardWidth }]}
              imageStyle={[styles.image]}
              removingState={removingState}
              onSelectedForRemove={onSelectedForRemove}
              selectedImagesForRemove={selectedImagesForRemove}
              onImagePress={onImagePress}
            />
          ))}
          <AddImagePlaceholder
            containerStyle={[
              styles.addImageContainerStyle,
              {
                width: imageCardWidth,
                height: imageCardWidth / 5,
              },
            ]}
            onPress={openImagesPicker}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  picturesHeader: {
    height: TOP_HEADER_HEIGHT,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 16,
    position: "absolute",
    top: 0,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 0.5,
    elevation: 2,
    backgroundColor: `${colors.appBg}aa`,
    paddingBottom: 12,
    zIndex: 1,
  },
  imagesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 8,
  },
  imageCard: {
    aspectRatio: 4 / 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 9,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },

  addImageContainerStyle: {
    aspectRatio: 4 / 5,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    borderColor: colors.primary,
  },
});
