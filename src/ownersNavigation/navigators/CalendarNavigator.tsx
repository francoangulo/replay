import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import CalendarScreen from "../screens/CalendarScreen";
import CalendarComplexesScreen from "../screens/CalendarComplexesScreen";
import { Complex } from "../../interfaces/complexes";
import { TurnScreen } from "../../sharedNavigation/screens/TurnScreen";
import { Turn } from "../../interfaces/Turns";

export type CalendarStackParamList = {
  CalendarComplexesScreen: undefined;
  CalendarScreen: { complex: Complex };
  TurnScreen: { turn: Turn };
};

const Stack = createStackNavigator<CalendarStackParamList>();

const navOptions = { header: () => <></> };

interface Screen {
  name: keyof CalendarStackParamList;
  component: ({}: any) => JSX.Element;
}

const screens: Screen[] = [
  {
    name: "CalendarComplexesScreen",
    component: CalendarComplexesScreen,
  },
  {
    name: "CalendarScreen",
    component: CalendarScreen,
  },
  { name: "TurnScreen", component: TurnScreen },
];

export const CalendarNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...navOptions,
        cardStyle: { backgroundColor: colors.appBg },
      }}
    >
      {screens.map(({ name, component }, index) => (
        <Stack.Screen
          key={`owner-tab-${index}`}
          name={name}
          component={component}
        />
      ))}
    </Stack.Navigator>
  );
};
