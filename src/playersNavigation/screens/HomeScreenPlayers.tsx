import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { StackScreenProps } from "@react-navigation/stack";
import MapView from "react-native-maps";
import { TextComponent } from "../../components/TextComponent";
import { selectAuth } from "../../redux/slices/authSlice";

interface Props extends StackScreenProps<any, any> {}

export const HomeScreenPlayers = ({ navigation }: Props) => {
  const user = useAppSelector(selectAuth);
  return (
    <SafeAreaView style={{ padding: 16, flex: 1 }}>
      <TextComponent type="title">Bienvenido {user.name}!</TextComponent>
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
