import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { HomeScreenPlayers } from "../screens/HomeScreenPlayers";
import { Complex } from "../../interfaces/complexes";

export type HomeStackParamList = {
  ComplexScreen: { complex: Complex };
};

const Stack = createStackNavigator<HomeStackParamList>();

const screens = [
  {
    name: "Home",
    component: HomeScreenPlayers,
  },
];

export const HomeNavigatorPlayers = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <></>,
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
