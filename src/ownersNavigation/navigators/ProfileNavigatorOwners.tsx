import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ComplexScreen } from "../screens/ComplexScreen";
import { colors } from "../../theme/appTheme";
import { Complex } from "../../interfaces/complexes";
import { ProfileScreenOwners } from "../screens/ProfileScreenOwners";
import { AdminComplexesScreenOwner } from "../screens/AdminComplexesScreenOwner";
import { AddComplexScreenOwners } from "../screens/AddComplexScreenOwners";
import { SelectLocationScreen } from "../screens/SelectLocationScreen";
import { AddFieldsScreen } from "../screens/AddFieldsScreen";
import { PicturesScreen } from "../screens/PicturesScreen";
import { SchedulesScreen } from "../screens/SchedulesScreen";

interface Coordinate {
  latitude: number;
  longitude: number;
}

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  AdminComplexesScreen: undefined;
  AddComplexScreen: {
    complexCoordinate?: Coordinate;
  };
  SelectLocationScreen: {
    complexCoordinate?: Coordinate;
  };
  AddFieldsScreen: { complexId: string };
  ComplexScreen: { complex: Complex };
  PicturesScreen: { complexId: string };
  SchedulesScreen: { complexId: string };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const navOptions = { header: () => <></> };

const screens = [
  {
    name: "ProfileScreen",
    component: ProfileScreenOwners,
  },
  {
    name: "AdminComplexesScreen",
    component: AdminComplexesScreenOwner,
  },
  {
    name: "AddComplexScreen",
    component: AddComplexScreenOwners,
  },
  {
    name: "SelectLocationScreen",
    component: SelectLocationScreen,
  },
  {
    name: "AddFieldsScreen",
    component: AddFieldsScreen,
  },
  {
    name: "ComplexScreen",
    component: ComplexScreen,
  },
  {
    name: "PicturesScreen",
    component: PicturesScreen,
  },
  {
    name: "SchedulesScreen",
    component: SchedulesScreen,
  },
];

export const ProfileNavigatorOwners = () => {
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
