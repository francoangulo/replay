import React from "react";
import { Modal, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../theme/appTheme";

interface Props {
  visible: boolean;
  ModalContent: React.ReactNode;
  customFadeContainerStyle?: StyleProp<ViewStyle>;
  customCardContainerStyle?: StyleProp<ViewStyle>;
}

export const GenericFadeModal = ({
  visible,
  ModalContent,
  customFadeContainerStyle,
  customCardContainerStyle,
}: Props) => {
  const fadeContainerStyle = [styles.fadeContainer, customFadeContainerStyle];
  const cardContainerStyle = [styles.cardContainer, customCardContainerStyle];

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={fadeContainerStyle}>
        <View style={cardContainerStyle}>{ModalContent}</View>
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
    borderRadius: 24,
    flex: 1,
  },
});
