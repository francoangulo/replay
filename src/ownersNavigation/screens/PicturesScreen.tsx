import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { BuiltImage, buildImageObjectToUpload } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

import {
  deleteComplexExtraPicturesKeys,
  getComplexExtraPictures,
  uploadComplexExtraPicture,
} from "../../redux/actions/complexes";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";

import { NoExtraPicturesComponent } from "../components/NoExtraPicturesComponent";
import { LoadingExtraPicturesComponent } from "../components/LoadingExtraPicturesComponent";
import { ExtraPicturesContainer } from "../components/ExtraPicturesContainer";
import { FadeModal } from "../components/FadeModal";
import usePrevious from "../../hooks/usePrevious";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { FullscreenImageBody } from "../components/ModalsBodies/FullscreenImageBody";
import { RemovingImageBody } from "../components/ModalsBodies/RemovingImageBody";
import { AddingImageBody } from "../components/ModalsBodies/AddingImageBody";

type ScreenProps = StackScreenProps<ProfileStackParamList, "PicturesScreen">;
export const PicturesScreen = ({ route }: ScreenProps) => {
  const [selectedImagesForRemove, setSelectedImagesForRemove] = useState<
    string[]
  >([]);
  const [fullscreenImage, setFullscreenImage] = useState<string>("");
  const [removingImages, setRemovingImages] = useState<boolean>(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { complexId } = route.params;

  const { complexes } = useAppSelector(selectComplexes);
  const complex = complexes.find(
    (ownerComplex) => ownerComplex._id === complexId
  );
  const prevComplex = usePrevious(complex);

  const dispatch = useAppDispatch();

  const openImagesPicker = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 0,
    });

    const builtImages: BuiltImage[] = [];

    result?.assets?.forEach((image: Asset) => {
      const builtImage = buildImageObjectToUpload(image);
      builtImage && builtImages.push(builtImage);
    });
    if (!builtImages.length) {
      return;
    }

    setUploadingImages(true);

    dispatch(
      uploadComplexExtraPicture({
        body: { complexExtraPictures: builtImages, complexId },
        callback: () => {
          setUploadingImages(false);
        },
      })
    );
  };

  useEffect(() => {
    if (
      complex &&
      (!complex?.extraPicturesURLs?.length ||
        (prevComplex &&
          complex?.extraPicturesKeys?.length !==
            prevComplex?.extraPicturesKeys?.length)) &&
      complex?.extraPicturesKeys?.length
    ) {
      let differentKeys: string[] = [];
      if (
        prevComplex?.extraPicturesKeys &&
        complex.extraPicturesKeys.length >
          prevComplex?.extraPicturesKeys?.length
      ) {
        differentKeys = complex.extraPicturesKeys.filter(
          (pictureKey) => !prevComplex?.extraPicturesKeys.includes(pictureKey)
        );
        dispatch(
          getComplexExtraPictures({
            complexId: complex._id,
            extraPicturesKeys: differentKeys,
          })
        );
        // Si el anterior tiene más que el actual, es decir, si ahora tenemos menos que antes
        // esto quiere decir que se efectuó una acción de remoción
      } else if (
        prevComplex?.extraPicturesKeys &&
        complex.extraPicturesKeys.length <
          prevComplex?.extraPicturesKeys?.length
      ) {
        differentKeys = prevComplex.extraPicturesKeys.filter(
          (pictureKey) => !complex?.extraPicturesKeys.includes(pictureKey)
        );
        dispatch(
          deleteComplexExtraPicturesKeys({
            body: {
              complexExtraPicturesKeys: differentKeys,
              complexId: complex._id,
            },
            callback: () => {},
          })
        );
      } else {
        differentKeys = complex.extraPicturesKeys;
        dispatch(
          getComplexExtraPictures({
            complexId: complex._id,
            extraPicturesKeys: differentKeys,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complex]);

  const onImageSelectedForRemove = (imageKey: string) => {
    if (selectedImagesForRemove.includes(imageKey)) {
      setSelectedImagesForRemove(
        selectedImagesForRemove.filter((key) => imageKey !== key)
      );
    } else {
      complex?.extraPicturesKeys &&
        setSelectedImagesForRemove([...selectedImagesForRemove, imageKey]);
    }
  };

  const alertRemoveImages = () => {
    Alert.alert(
      "¿Eliminar imágenes seleccionadas?",
      "¿Estás seguro de que deseas eliminar las imágenes seleccionadas?",
      [
        {
          text: "Confirmar",
          onPress: removeSelectedImages,
          style: "destructive",
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  const removeSelectedImages = () => {
    setRemovingImages(true);
    dispatch(
      deleteComplexExtraPicturesKeys({
        body: {
          complexExtraPicturesKeys: selectedImagesForRemove,
          complexId: complexId,
        },
        callback: () => {
          setRemovingImages(false);
        },
      })
    );
  };

  const onImagePress = (imageUri: string) => {
    setFullscreenImage(imageUri);
  };

  const onImageClose = () => {
    setFullscreenImage("");
  };

  const renderContent = () => {
    if (!complex?.extraPicturesKeys?.length) {
      return <NoExtraPicturesComponent openImagesPicker={openImagesPicker} />;
    } else if (complex?.extraPicturesURLs?.length) {
      return (
        <ExtraPicturesContainer
          complex={complex}
          openImagesPicker={openImagesPicker}
          onSelectedForRemove={onImageSelectedForRemove}
          selectedImagesForRemove={selectedImagesForRemove}
          removeSelectedImages={alertRemoveImages}
          onImagePress={onImagePress}
        />
      );
    } else {
      return <LoadingExtraPicturesComponent />;
    }
  };

  return (
    <>
      {renderContent()}
      <FadeModal
        modalState={{ visible: removingImages, autoDismiss: false }}
        modalContent={RemovingImageBody}
      />
      <FadeModal
        modalState={{ visible: uploadingImages, autoDismiss: false }}
        modalContent={AddingImageBody}
      />
      <FadeModal
        modalState={{ visible: !!fullscreenImage.length, autoDismiss: false }}
        modalContent={() => (
          <FullscreenImageBody
            imageUri={fullscreenImage}
            onImageClose={onImageClose}
          />
        )}
        customFadeContainerStyle={styles.fullscreenImageFadeContainer}
        customCardContainerStyle={styles.fullscreenImageCardContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fullscreenImageFadeContainer: {
    paddingHorizontal: 0,
  },
  fullscreenImageCardContainer: {
    backgroundColor: "transparent",
  },
});
