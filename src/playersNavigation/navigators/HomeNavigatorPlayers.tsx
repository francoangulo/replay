import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { HomeScreenPlayers } from "../screens/HomeScreenPlayers";
import { Complex } from "../../interfaces/complexes";
import { TurnScreen } from "../../sharedNavigation/screens/TurnScreen";
import { Turn } from "../../interfaces/Turns";

export type HomeStackParamList = {
  ComplexScreen: { complex: Complex };
  TurnScreen: { turn: Turn };
};

const Stack = createStackNavigator<HomeStackParamList>();

const screens = [
  {
    name: "Home",
    component: HomeScreenPlayers,
  },
  {
    name: "TurnScreen",
    component: TurnScreen,
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
