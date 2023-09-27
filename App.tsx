import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import { Provider } from "react-redux";
import store from "./src/redux/store";
import { OnboardingNavigator } from "./src/mainNavigation/navigators/OnboardingNavigator";
import { enableLatestRenderer } from "react-native-maps";

enableLatestRenderer();

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
