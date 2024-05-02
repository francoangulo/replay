import { StyleProp, TextStyle, ViewStyle } from "react-native";
import { Theme } from "react-native-calendars/src/types";

export const colors = {
  appBg: "#fafafa",
  appBgTransparent: "#fafafadd",
  appFadeBg: "#00000099",
  cardBg: "#ffffff",
  inputBg: "#e9e9e9",
  primary: "#4BB543",
  primaryOne: "#B3EEAD",
  primaryTwo: "#CCF8C7",
  primaryThree: "#EEF8ED",
  danger: "#FA4557",
  dangerMedium: "#F7D1D5",
  dangerLight: "#FAEEEF",
  warning: "#fab028",
  warningLight: "#f7efdc",
  gray: "#808080",
  inputBorder: "#DDDDDD",
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
  // ! TODO: CHECK THIS
  fontWeight: "400",
  fontSize: 22,
};

export const subTitleStyle: StyleProp<TextStyle> = {
  fontWeight: "400",
  fontSize: 16,
};

export const subTitleLgStyle: StyleProp<TextStyle> = {
  fontWeight: "600",
  fontSize: 18,
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

export const expandableCalendarTheme: Theme = {
  monthTextColor: "#000000dd",
  arrowColor: colors.primary,
  textSectionTitleColor: "#000000dd",
  todayBackgroundColor: `${colors.primary}18`,
  todayTextColor: "#00000044",
  dayTextColor: "#00000044",
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: "white",
  stylesheet: {
    expandable: {
      main: {
        knob: {
          width: 40,
          height: 4,
          borderRadius: 3,
          backgroundColor: "green",
        },
        containerShadow: {
          elevation: 0,
          shadowOpacity: 0,
          height: 0,
          shadowOffset: {
            width: 0,
            height: 2,
          },
        },
      },
    },
  },
};

export const calendarProviderTheme: Theme = {
  backgroundColor: "#040404",
  selectedDayBackgroundColor: "#000",
  arrowWidth: 90,
  todayButtonFontSize: 40,
};

export const calendarProviderStyles: StyleProp<any> = { flex: 1 };

export interface GenericButtonStyles {
  primary: StyleProp<ViewStyle>;
  secondary: StyleProp<ViewStyle>;
  danger: StyleProp<ViewStyle>;
  dangerNoBg: StyleProp<ViewStyle>;
}

export const genericButtonStyles: GenericButtonStyles = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: { borderWidth: 1, borderColor: colors.primary },
  danger: {
    backgroundColor: colors.danger,
  },
  dangerNoBg: {},
};

interface GenericButtonTextStyles {
  primary: StyleProp<TextStyle>;
  secondary: StyleProp<TextStyle>;
  danger: StyleProp<TextStyle>;
  dangerNoBg: StyleProp<TextStyle>;
}

export const genericButtonTextStyles: GenericButtonTextStyles = {
  primary: { color: "#ffffff" },
  secondary: {
    color: colors.primary,
    borderWidth: 0,
    borderColor: "transparent",
  },
  danger: {
    color: colors.appBg,
  },
  dangerNoBg: { color: colors.danger },
};

interface TextComponentStyles {
  title: StyleProp<TextStyle>;
  subtitle: StyleProp<TextStyle>;
  subtitleLg: StyleProp<TextStyle>;
  text: StyleProp<TextStyle>;
}

export const textComponentStyles: TextComponentStyles = {
  title: titleStyle,
  subtitle: subTitleStyle,
  subtitleLg: subTitleLgStyle,
  text: descriptionStyle,
};
