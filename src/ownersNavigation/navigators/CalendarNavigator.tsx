import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import CalendarScreen from "../screens/CalendarScreen";
import CalendarComplexesScreen from "../screens/CalendarComplexesScreen";
import { Complex } from "../../interfaces/complexes";

export type CalendarStackParamList = {
  CalendarComplexesScreen: undefined;
  CalendarScreen: { complex: Complex };
};

const Stack = createStackNavigator<CalendarStackParamList>();

const navOptions = { header: () => <></> };

const screens = [
  {
    name: "CalendarComplexesScreen",
    component: CalendarComplexesScreen,
  },
  {
    name: "CalendarScreen",
    component: CalendarScreen,
  },
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
