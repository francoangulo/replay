import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { OwnersTabNavigator } from "../../ownersNavigation/navigators/OwnersNavigator";
import { PlayersTabNavigator } from "../../playersNavigation/navigators/PlayersNavigator";
import { LoginScreen } from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const screens = [
  {
    name: "LoginScreen",
    component: LoginScreen,
  },
  {
    name: "SignupScreen",
    component: SignupScreen,
  },
  { name: "OwnersNavigator", component: OwnersTabNavigator },
  { name: "PlayersNavigator", component: PlayersTabNavigator },
];

const Stack = createStackNavigator();

export const OnboardingNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <></>,
        cardStyle: { backgroundColor: colors.appBg },
      }}
    >
      {screens.map(({ name, component }, idx) => (
        <Stack.Screen
          key={`onboarding-${idx}`}
          name={name}
          component={component}
        />
      ))}
    </Stack.Navigator>
  );
};
