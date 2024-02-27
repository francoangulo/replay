import React from "react";
import { FadeModal } from "../../../ownersNavigation/components/FadeModal";
import { DistanceModalContent } from "../DistanceModalContent";
import { FadeModalState } from "../../../interfaces/FadeModal";
import { StyleSheet } from "react-native";

interface Props {
  distanceModalState: FadeModalState;
  setDistanceModalState: React.Dispatch<React.SetStateAction<FadeModalState>>;
  onInputChange: (distance: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DistanceModal = ({
  distanceModalState,
  setDistanceModalState,
  onInputChange,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <FadeModal
      modalState={distanceModalState}
      setModalState={setDistanceModalState}
      modalContent={() =>
        DistanceModalContent({
          onInputChange,
          onCancel,
          onConfirm,
        })
      }
      customFadeContainerStyle={styles.fadeContainer}
    />
  );
};

const styles = StyleSheet.create({
  fadeContainer: { padding: 20 },
});
