import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { descriptionStyle, subTitleStyle, titleStyle } from "../theme/appTheme";
interface Props {
  children: string | string[];
  type: "title" | "subtitle" | "text";
  customStyles?: StyleProp<TextStyle>;
}
export const TextComponent = ({ children, type, customStyles }: Props) => {
  const style =
    type === "title"
      ? titleStyle
      : type === "subtitle"
      ? subTitleStyle
      : descriptionStyle;

  const combinedStyles = [style, customStyles];
  return <Text style={combinedStyles!}>{children}</Text>;
};
