import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { OwnersTabNavigator } from "../../ownersNavigation/navigators/OwnersNavigator";
import { PlayersTabNavigator } from "../../playersNavigation/navigators/PlayersNavigator";
import { LoginScreen } from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import SplashScreen from "react-native-splash-screen";
import { getToken, getUserId } from "../../helpers/asyncStorage";
import { useAppDispatch } from "../../hooks/redux";
import { loginUser } from "../../redux/slices/authSlice";
import { StackActions, useNavigation } from "@react-navigation/native";

export type OnboardingTabsParamsList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  OwnersNavigator: { turnIdParam?: string };
  PlayersNavigator: undefined;
};
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

const Stack = createStackNavigator<OnboardingTabsParamsList>();

export const OnboardingNavigator = ({}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const checkAlreadyLoggedIn = async () => {
    const token = await getToken();
    const user = await getUserId();

    if (token && user) {
      dispatch(
        loginUser({
          token,
          userId: user,
          callback: (userType) => {
            const route =
              userType && userType === "player"
                ? "PlayersNavigator"
                : "OwnersNavigator";
            navigation.dispatch(
              StackActions.replace(route, { fromSplash: true })
            );
            setTimeout(() => {
              SplashScreen.hide();
            }, 3000);
          },
        })
      );
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 3000);
    }
  };

  useEffect(() => {
    checkAlreadyLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
