import React from "react";
import { Text } from "react-native";
import { descriptionStyle, subTitleStyle, titleStyle } from "../theme/appTheme";
interface Props {
  children: string | string[];
  type: "title" | "subtitle" | "text";
}
export const TextComponent = ({ children, type }: Props) => {
  const style =
    type === "title"
      ? titleStyle
      : type === "subtitle"
      ? subTitleStyle
      : descriptionStyle;
  return <Text style={style}>{children}</Text>;
};
