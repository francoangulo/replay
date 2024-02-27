import React, { useEffect } from "react";
import { Modal, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../theme/appTheme";
import { FadeModalState, SetModalState } from "../../interfaces/FadeModal";

interface Props {
  modalState: FadeModalState;
  setModalState: SetModalState;
  modalContent: () => React.JSX.Element;
  customFadeContainerStyle?: StyleProp<ViewStyle>;
}

export const FadeModal = ({
  modalState,
  setModalState,
  modalContent,
  customFadeContainerStyle = {},
}: Props) => {
  useEffect(() => {
    modalState.visible === true &&
      modalState.autoDismiss &&
      setTimeout(() => {
        setModalState({ ...modalState, visible: false });
      }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  const fadeContainerStyle = [styles.fadeContainer, customFadeContainerStyle];

  return (
    <Modal animationType="fade" transparent={true} visible={modalState.visible}>
      <View style={fadeContainerStyle}>
        <View style={styles.cardContainer}>{modalContent()}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fadeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.appFadeBg,
    padding: 48,
    flexDirection: "row",
  },
  cardContainer: {
    backgroundColor: colors.appBg,
    padding: 32,
    borderRadius: 5,
    flex: 1,
  },
});
