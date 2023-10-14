import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { Provider } from "react-redux";
import store from "./src/redux/store";
import { OnboardingNavigator } from "./src/mainNavigation/navigators/OnboardingNavigator";
import { enableLatestRenderer } from "react-native-maps";

enableLatestRenderer();
const config = {
  screens: {
    LoginScreen: {
      path: "login/:email/:turnId",
      screens: {
        OwnersHomeScreen: "home",
      },
    },
  },
};
const linking = {
  prefixes: ["replay://"],
  /* configuration for matching screens with paths */
  config,
};

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <OnboardingNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
