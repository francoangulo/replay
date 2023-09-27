import React, { useEffect } from "react";
import { Modal, Text, View } from "react-native";
import { colors } from "../../theme/appTheme";

interface Props {
  modalState: {
    visible: boolean;
    status: string;
  };
  setModalVisible: React.Dispatch<
    React.SetStateAction<{
      visible: boolean;
      status: string;
    }>
  >;
  modalContent: () => React.JSX.Element;
}

export const FadeModal = ({
  modalState,
  setModalVisible,
  modalContent,
}: Props) => {
  useEffect(() => {
    modalState.visible === true &&
      setTimeout(() => {
        setModalVisible({ ...modalState, visible: false });
      }, 3000);
  }, [modalState]);

  return (
    <Modal animationType="fade" transparent={true} visible={modalState.visible}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.appFadeBg,
          padding: 48,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            backgroundColor: colors.appBg,
            padding: 32,
            borderRadius: 5,
            flex: 1,
          }}
        >
          {modalContent()}
        </View>
      </View>
    </Modal>
  );
};
