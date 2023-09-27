import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { cardStyle } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import MapView from "react-native-maps";

interface Props extends StackScreenProps<any, any> {}

export const HomeScreenPlayers = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={{ padding: 16, flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={{ flex: 1, width: "100%", height: "100%" }}
      />
    </SafeAreaView>
  );
};
