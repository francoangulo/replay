import { StyleProp, TextStyle, ViewStyle } from "react-native";

export const colors = {
  appBg: "#fafafa",
  appBgTransparent: "#fafafadd",
  appFadeBg: "#00000099",
  cardBg: "#ffffff",
  primary: "#4BB543",
  danger: "#FA4557",
  gray: "#808080",
};

export const paddings = {
  globalPadding: 16,
  globalRadius: 16,
};

export const cardShadow: StyleProp<ViewStyle> = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 1,
  elevation: 1,
};

export const cardStyle: StyleProp<ViewStyle> = {
  backgroundColor: colors.cardBg,
  padding: paddings.globalPadding,
  borderRadius: paddings.globalRadius,
  ...cardShadow,
};

export const titleStyle: StyleProp<TextStyle> = {
  fontWeight: "bold",
  fontSize: 20,
};

export const subTitleStyle: StyleProp<TextStyle> = {
  fontWeight: "500",
  fontSize: 14,
};
export const descriptionStyle: StyleProp<TextStyle> = {
  fontWeight: "400",
  fontSize: 14,
  color: "gray",
};
export const cardTitleStyle: StyleProp<TextStyle> = {
  textTransform: "capitalize",
  fontWeight: "700",
};
