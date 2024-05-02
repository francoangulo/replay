import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
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
  rightIcon?: () => React.ReactNode;
  customButtonStyle?: StyleProp<ViewStyle>;
}

export const GenericButton = ({
  buttonType,
  onButtonPress,
  buttonText,
  rightIcon,
  customButtonStyle,
}: Props) => {
  const buttonFinalStyle = [genericButtonStyles[buttonType], customButtonStyle];

  return (
    <TouchableOpacity
      style={[styles.genericButton, ...buttonFinalStyle]}
      onPress={onButtonPress}
    >
      <Text
        style={[styles.genericButtonText, genericButtonTextStyles[buttonType]]}
      >
        {buttonText}
      </Text>
      {rightIcon && rightIcon()}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  genericButton: {
    width: "100%",
    padding: 8,
    borderRadius: 12,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genericButtonText: { fontWeight: "bold" },
});
