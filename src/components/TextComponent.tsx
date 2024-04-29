import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import {
  descriptionStyle,
  subTitleLgStyle,
  subTitleStyle,
  titleStyle,
} from "../theme/appTheme";
interface Props {
  children: string | string[];
  type: "title" | "subtitle" | "subtitleLg" | "text";
  customStyles?: StyleProp<TextStyle>;
}
export const TextComponent = ({ children, type, customStyles }: Props) => {
  const style =
    type === "title"
      ? titleStyle
      : type === "subtitle"
      ? subTitleStyle
      : type === "subtitleLg"
      ? subTitleLgStyle
      : descriptionStyle;

  const combinedStyles: StyleProp<TextStyle>[] = [
    style,
    customStyles,
    { fontFamily: "OpenSans" },
    { fontFamily: "Roboto" },
  ];
  return <Text style={combinedStyles!}>{children}</Text>;
};
