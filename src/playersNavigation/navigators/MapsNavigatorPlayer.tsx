import React from "react";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { SearchScreenPlayers } from "../screens/SearchScreenPlayers";
import { MapScreenPlayers } from "../screens/MapScreenPlayers";

export type MapsStackParamList = {
  MapScreen: undefined;
  //   ComplexScreen: {
  //     complex: Complex;
  //     availableTurns: AvailableTurn[];
  //     getAvailableTurns: (
  //       selectedDate: DateTime,
  //       toState: boolean
  //     ) => AvailableTurn[];
  //     playersAmountsSelectors: number[];
  //     getPlayersAmountsSelectors: (
  //       turns: AvailableTurn[],
  //       toState?: boolean
  //     ) => number[];
  //   };
  //   BookedTurnScreen: { turn: Turn };
};

const Stack = createStackNavigator<MapsStackParamList>();
const generalOptions = {
  header: () => <></>,
};

interface ScreenProps extends StackScreenProps<any, any> {}
interface Screen {
  name: "MapScreen";
  //   | "ComplexScreen" | "BookedTurnScreen";
  component: ({ route, navigation }: ScreenProps) => React.JSX.Element;
  options: { header: () => React.JSX.Element };
}

const screens: Screen[] = [
  {
    name: "MapScreen",
    component: MapScreenPlayers,
    options: { ...generalOptions },
  },
];

export const MapsNavigatorPlayers = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <></>,
        cardStyle: { backgroundColor: colors.appBg },
      }}
    >
      {screens.map(({ name, component, options }, index) => (
        <Stack.Screen
          key={`owner-tab-${index}`}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
};
