import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/appTheme";

interface Props {
  buttonType: "primary" | "secondary";
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
  const buttonBaseStyle =
    buttonType === "primary" ? styles.primaryButton : styles.secondaryButton;

  const buttonFinalStyle = [buttonBaseStyle, customButtonStyle];
  const buttonTextBaseStyle =
    buttonType === "primary"
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <TouchableOpacity
      style={[styles.genericButton, ...buttonFinalStyle]}
      onPress={onButtonPress}
    >
      <Text style={{ ...styles.genericButtonText, ...buttonTextBaseStyle }}>
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
    borderRadius: 5,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  genericButtonText: { fontWeight: "bold" },
  primaryButtonText: { color: "#ffffff" },
  secondaryButtonText: {
    color: colors.primary,
    borderWidth: 0,
    borderColor: "transparent",
  },
});
