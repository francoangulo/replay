import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ActivityIndicator } from "react-native";
import {
  getComplexes,
  selectComplexes,
} from "../../redux/slices/complexesSlice";
import { SettingsScreenPlayers } from "../screens/SettingsScreenPlayers";
import { HomeNavigatorPlayers } from "./HomeNavigatorPlayers";
import { getAllTurns, selectTurns } from "../../redux/slices/turnsSlice";
import { SearchNavigatorPlayers } from "./SearchNavigatorPlayers";

const Tab = createBottomTabNavigator();

const screens = [
  {
    name: "HomeNavigator",
    component: HomeNavigatorPlayers,
    iconName: "home-outline",
  },
  {
    name: "SearchNavigator",
    component: SearchNavigatorPlayers,
    iconName: "search-outline",
  },
  {
    name: "Settings",
    component: SettingsScreenPlayers,
    iconName: "settings-outline",
  },
];

export const PlayersTabNavigator = () => {
  const { loading } = useAppSelector(selectComplexes);
  const { loadingAllTurns } = useAppSelector(selectTurns);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loading && dispatch(getComplexes());
    loadingAllTurns && dispatch(getAllTurns());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <ActivityIndicator size={20} />;

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.appBg }}
      screenOptions={{
        header: () => <></>,
        tabBarLabel: () => <></>,
      }}
    >
      {screens.map(({ name, component, iconName }, index) => (
        <Tab.Screen
          key={`player-tab-${index}`}
          name={name}
          component={component}
          options={{
            tabBarIcon: ({ focused }) => (
              <IonIcon
                {...(focused && { color: colors.primary })}
                size={24}
                name={iconName}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
