import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface Props {
  orientation: "vertical" | "horizontal";
}

export const DashedBorder = ({ orientation }: Props) => {
  const styles: StyleProp<ViewStyle> = {
    ...(orientation === "vertical"
      ? { marginLeft: -1, marginRight: -1 }
      : { marginTop: -1 }),
    ...(orientation === "vertical" ? { height: "100%" } : { width: "100%" }),
  };
  return (
    <View
      style={{
        ...styles,
        borderWidth: 1,
        borderColor: "#898989",
        borderStyle: "dashed",
      }}
    />
  );
};
