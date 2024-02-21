import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../theme/appTheme";
import MIcon from "react-native-vector-icons/MaterialIcons";
import SwipeButton from "rn-swipe-button";

interface Props {
  onTurnConfirm: () => void;
}

const CompleteThumb = () => {
  return (
    <View style={styles.thumbContainer}>
      <MIcon
        name="chevron-right"
        style={styles.chevronFirst}
        //   color={colors.cardBg}
        size={30}
      />
      <MIcon
        name="chevron-right"
        style={styles.chevronSecond}
        size={30}
        //   color={colors.appBg}
      />
    </View>
  );
};

export const ConfirmTurnButton = ({ onTurnConfirm }: Props) => {
  return (
    <SwipeButton
      height={42}
      width={"100%"}
      title={"Desliza para confirmar"}
      //     container styling
      containerStyles={styles.swipeButtonContainer}
      //     rail styling
      railBackgroundColor={colors.dangerLight}
      railBorderColor={"transparent"}
      railStyles={styles.swipeRail}
      railFillBackgroundColor={`${colors.primaryTwo}99`}
      railFillBorderColor={"transparent"}
      //     thumb styling
      thumbIconBackgroundColor={"transparent"}
      thumbIconBorderColor={"transparent"}
      thumbIconStyles={styles.swipeThumbIcon}
      // eslint-disable-next-line react/no-unstable-nested-components
      thumbIconComponent={CompleteThumb}
      thumbIconWidth={50}
      //     font styling
      titleStyles={styles.swipeTitle}
      //     functionallity
      // onSwipeStart={toggleScroll}
      onSwipeSuccess={onTurnConfirm}
      // onSwipeFail={toggleScroll}
      shouldResetAfterSuccess={true}
      resetAfterSuccessAnimDelay={500}
    />
  );
};

const styles = StyleSheet.create({
  thumbContainer: {
    width: 60,
    height: "100%",
    borderRadius: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.primaryOne,
  },
  chevronFirst: { marginRight: -20, opacity: 0.5 },
  chevronSecond: { margin: 0 },
  swipeButtonContainer: { borderRadius: 5, paddingLeft: 4 },
  swipeRail: { borderRadius: 5 },
  swipeThumbIcon: { borderRadius: 5 },
  swipeTitle: { fontSize: 14, fontWeight: "bold" },
});
