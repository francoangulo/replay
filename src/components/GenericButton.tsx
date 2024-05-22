import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  GenericButtonStyles,
  genericButtonStyles,
  genericButtonTextStyles,
} from "../theme/appTheme";

interface Props {
  buttonType: keyof GenericButtonStyles;
  onButtonPress: () => void;
  buttonText: string;
  rightIcon?: React.ReactNode;
  customButtonStyle?: StyleProp<ViewStyle>;
  customTextStyle?: StyleProp<TextStyle>;
}

export const GenericButton = ({
  buttonType,
  onButtonPress,
  buttonText,
  rightIcon,
  customButtonStyle,
  customTextStyle,
}: Props) => {
  const buttonFinalStyle = [genericButtonStyles[buttonType], customButtonStyle];
  const textFinalStyle = [
    styles.genericButtonText,
    genericButtonTextStyles[buttonType],
    customTextStyle,
  ];

  return (
    <TouchableOpacity
      style={[styles.genericButton, ...buttonFinalStyle]}
      onPress={onButtonPress}
    >
      <Text style={textFinalStyle}>{buttonText}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  genericButton: {
    width: "100%",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genericButtonText: { fontWeight: "bold" },
});
