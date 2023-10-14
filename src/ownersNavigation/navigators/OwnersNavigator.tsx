import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../redux/slices/authSlice";
import { ActivityIndicator } from "react-native";
import {
  getOwnerComplexes,
  selectOwnerComplexes,
} from "../../redux/slices/ownerComplexesSlice";
import { getOwnerTurns, selectTurns } from "../../redux/slices/turnsSlice";
import { OwnersHomeScreen } from "../screens/OwnersHomeScreen";
import { ProfileNavigatorOwners } from "./ProfileNavigatorOwners";
import ADIcon from "react-native-vector-icons/AntDesign";

const Tab = createBottomTabNavigator();

const screens = [
  {
    name: "Home",
    component: OwnersHomeScreen,
    icon: (focused: boolean) => (
      <IonIcon
        name={"home-outline"}
        size={24}
        {...(focused && { color: colors.primary })}
      />
    ),
    initialParams: (turnIdParam: string) => {
      console.log("returning: ", turnIdParam);
      return { turnIdParam };
    },
  },
  {
    name: "Settings",
    component: ProfileNavigatorOwners,
    icon: (focused: boolean) => (
      <ADIcon
        name={"user"}
        size={24}
        {...(focused && { color: colors.primary })}
      />
    ),
  },
];

export const OwnersTabNavigator = ({ route }) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  console.log("franco turn Id", JSON.stringify(turnIdParam, null, 4));
  const { _id: ownerId } = useAppSelector(selectAuth);
  const { loadingOwnerTurns: loadingTurns } = useAppSelector(selectTurns);
  const { loading } = useAppSelector(selectOwnerComplexes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loading && ownerId.length && dispatch(getOwnerComplexes(ownerId));
    ownerId && loadingTurns && dispatch(getOwnerTurns(ownerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  if (loading) return <ActivityIndicator size={20} />;

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.appBg }}
      screenOptions={{
        header: () => <></>,
        tabBarLabel: () => <></>,
      }}
    >
      {screens.map(({ name, component, icon, initialParams }, index) => {
        const params = initialParams && initialParams(turnIdParam);
        return (
          <Tab.Screen
            key={`owner-tab-${index}`}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ focused }) => icon(focused),
            }}
            initialParams={params}
            //     {...(initialParams && initialParams(turnIdParam))}
          />
        );
      })}
    </Tab.Navigator>
  );
};
