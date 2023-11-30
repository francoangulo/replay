import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { HomeStackParamList } from "../navigators/HomeNavigator";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Turn } from "../../interfaces/Turns";
import { TextComponent } from "../../components/TextComponent";
import { DateTime } from "luxon";
import { colors } from "../../theme/appTheme";

type Props = StackScreenProps<HomeStackParamList, "TurnScreen">;

export const TurnScreen = ({ navigation, route }: Props) => {
  const turn: Turn = route?.params?.turn ?? false;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <TextComponent type="title">
          {turn.confirmed ? "Turno reservado" : "Por favor, confirma el turno"}
        </TextComponent>
        <Text>{DateTime.fromISO(turn.startDate).toFormat("dd-MM-yyyy")}</Text>
        <Text>Desde: {DateTime.fromISO(turn.startDate).toFormat("HH:mm")}</Text>
        <Text>Hasta: {DateTime.fromISO(turn.endDate).toFormat("HH:mm")}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            padding: 8,
            borderRadius: 5,
            marginTop: 16,
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
            Confirmar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
