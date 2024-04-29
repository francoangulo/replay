import React, { useEffect } from "react";
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../redux/slices/authSlice";
import { ActivityIndicator } from "react-native";
import { getOwnerTurns, selectTurns } from "../../redux/slices/turnsSlice";
import { ProfileNavigatorOwners } from "./ProfileNavigatorOwners";
import ADIcon from "react-native-vector-icons/AntDesign";
import { OnboardingTabsParamsList } from "../../mainNavigation/navigators/OnboardingNavigator";
import { CalendarNavigator } from "./CalendarNavigator";
import { HomeNavigator } from "./HomeNavigator";
import { getComplexes } from "../../redux/actions/complexes";
import { selectComplexes } from "../../redux/slices/complexesSlice";

export type TabsParamsList = {
  HomeNavigator: { turnIdParam?: string };
  CalendarNavigator: undefined;
  SettingsNavigator: undefined;
};

const Tab = createBottomTabNavigator<TabsParamsList>();

const screens = [
  {
    name: "HomeNavigator",
    component: HomeNavigator,
    icon: (focused: boolean) => (
      <IonIcon
        name={"home-outline"}
        size={24}
        {...(focused && { color: colors.primary })}
      />
    ),
    initialParams: (turnIdParam: string) => {
      return { turnIdParam };
    },
  },
  {
    name: "CalendarNavigator",
    component: CalendarNavigator,
    icon: (focused: boolean) => (
      <IonIcon
        name={"calendar-outline"}
        size={24}
        {...(focused && { color: colors.primary })}
      />
    ),
    initialParams: (turnIdParam: string) => {
      return { turnIdParam };
    },
  },
  {
    name: "SettingsNavigator",
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

type Props = BottomTabScreenProps<OnboardingTabsParamsList, "OwnersNavigator">;

export const OwnersTabNavigator = ({ route }: Props) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  const { _id: ownerId } = useAppSelector(selectAuth);
  const { loadingOwnerTurns: loadingTurns } = useAppSelector(selectTurns);
  const { loading } = useAppSelector(selectComplexes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loading && ownerId.length && dispatch(getComplexes(ownerId));
    ownerId && loadingTurns && dispatch(getOwnerTurns(ownerId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerId]);

  if (loading) {
    return <ActivityIndicator size={20} />;
  }

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.appBg }}
      screenOptions={{
        header: () => <></>,
        tabBarLabel: () => <></>,
      }}
    >
      {screens.map(({ name, component, icon, initialParams }, index) => {
        const params =
          (initialParams && initialParams(turnIdParam)) || undefined;
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
