import React from "react";
import { Turn } from "../../interfaces/Turns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/appTheme";
import { DateTime } from "luxon";
import { StackNavigationProp } from "@react-navigation/stack";
import { CalendarStackParamList } from "../navigators/CalendarNavigator";

interface Props {
  turn: Turn;
  navigation: StackNavigationProp<
    CalendarStackParamList,
    "CalendarScreen",
    undefined
  >;
}

export const AgendaTurn = ({ turn, navigation }: Props) => {
  const { confirmed, startDate, endDate, fieldNumber, playersAmount } = turn;
  return (
    <TouchableOpacity
      style={{
        ...styles.agendaItem,
        backgroundColor: confirmed ? colors.primaryTwo : colors.dangerMedium,
      }}
      onPress={() => navigation.navigate("TurnScreen", { turn })}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text>{DateTime.fromISO(startDate).toFormat("HH:mm")}</Text>
        <Text>{DateTime.fromISO(endDate).toFormat("HH:mm")}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ opacity: 0.4 }}>Cancha {fieldNumber}</Text>
        <Text style={{ opacity: 0.4 }}> - </Text>
        <Text style={{ opacity: 0.4 }}>F{playersAmount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  agendaItem: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
