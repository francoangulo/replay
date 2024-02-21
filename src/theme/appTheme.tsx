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
  fontWeight: "bold",
  fontSize: 22,
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
