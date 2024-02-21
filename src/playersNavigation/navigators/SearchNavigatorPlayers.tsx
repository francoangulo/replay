import React from "react";
import {
  StackScreenProps,
  createStackNavigator,
} from "@react-navigation/stack";
import { colors } from "../../theme/appTheme";
import { Complex } from "../../interfaces/complexes";
import { SearchScreenPlayers } from "../screens/SearchScreenPlayers";
import { ComplexScreen } from "../screens/ComplexScreen";
import { AvailableTurn } from "../../hooks/useAvailableTurns";
import { DateTime } from "luxon";
import { Turn } from "../../interfaces/Turns";
import { BookedTurnScreen } from "../screens/BookedTurnScreen";

export type SearchStackParamList = {
  Search: undefined;
  ComplexScreen: {
    complex: Complex;
    availableTurns: AvailableTurn[];
    getAvailableTurns: (
      selectedDate: DateTime,
      toState: boolean
    ) => AvailableTurn[];
    playersAmountsSelectors: number[];
    getPlayersAmountsSelectors: (
      turns: AvailableTurn[],
      toState?: boolean
    ) => number[];
  };
  BookedTurnScreen: { turn: Turn };
};

const Stack = createStackNavigator<SearchStackParamList>();
const generalOptions = {
  header: () => <></>,
};

interface ScreenProps extends StackScreenProps<any, any> {}
interface Screen {
  name: "Search" | "ComplexScreen" | "BookedTurnScreen";
  component: ({ route, navigation }: ScreenProps) => React.JSX.Element;
  options: { header: () => React.JSX.Element };
}

const screens: Screen[] = [
  {
    name: "Search",
    component: SearchScreenPlayers,
    options: { ...generalOptions },
  },
  {
    name: "ComplexScreen",
    component: ComplexScreen,
    options: { ...generalOptions },
  },
  {
    name: "BookedTurnScreen",
    component: BookedTurnScreen,
    options: { ...generalOptions },
  },
];

export const SearchNavigatorPlayers = () => {
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
