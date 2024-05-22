import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { textComponentStyles } from "../theme/appTheme";
interface Props {
  children: string | string[] | number;
  type: "title" | "subtitle" | "subtitleLg" | "text";
  customStyles?: StyleProp<TextStyle>;
}
export const TextComponent = ({ children, type, customStyles }: Props) => {
  const combinedStyles: StyleProp<TextStyle>[] = [
    textComponentStyles[type],
    customStyles,
    { fontFamily: "OpenSans" },
    //     { fontFamily: "Roboto" },
  ];
  return <Text style={combinedStyles!}>{children}</Text>;
};
