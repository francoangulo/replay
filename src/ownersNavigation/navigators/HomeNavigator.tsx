import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { OwnersHomeScreen } from "../screens/OwnersHomeScreen";
import { TurnScreen } from "../screens/TurnScreen";
import { Turn } from "../../interfaces/Turns";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { TabsParamsList } from "./OwnersNavigator";

export type HomeStackParamList = {
  OwnersHomeScreen: { turnIdParam?: string };
  TurnScreen: { turn: Turn };
};

const Stack = createStackNavigator<HomeStackParamList>();

const navOptions = { header: () => <></> };

const screens = [
  {
    name: "OwnersHomeScreen",
    component: OwnersHomeScreen,
    initialParams: (turnIdParam: string) => {
      return { turnIdParam };
    },
  },
  {
    name: "TurnScreen",
    component: TurnScreen,
  },
];

type Props = BottomTabScreenProps<TabsParamsList, "HomeNavigator">;

export const HomeNavigator = ({ route }: Props) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  return (
    <Stack.Navigator
      screenOptions={{
        ...navOptions,
        cardStyle: { backgroundColor: colors.appBg },
      }}
    >
      {screens.map(({ name, component, initialParams }, index) => {
        const params =
          (initialParams && initialParams(turnIdParam)) || undefined;
        return (
          <Stack.Screen
            key={`owner-home-screen-${index}`}
            name={name}
            component={component}
            initialParams={params}
          />
        );
      })}
    </Stack.Navigator>
  );
};
