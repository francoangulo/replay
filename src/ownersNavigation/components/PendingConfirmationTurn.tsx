import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { DateTime } from "luxon";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Turn } from "../../interfaces/Turns";
import { TurnCardRow } from "../../sharedNavigation/components/TurnCardRow";

interface Props {
  onPress: () => void;
  turn: Turn;
}

export const PendingConfirmationTurn = ({ onPress, turn }: Props) => {
  const { startDate, endDate } = turn;
  const startDateTime = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[cardStyle, { backgroundColor: colors.dangerLight }]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.timeText}>Cancha {turn.fieldNumber}</Text>
        <IonIcon name="alert" size={24} color={colors.danger} />
      </View>
      <TurnCardRow title="Inicio" value={startDateTime.toFormat("HH:mm")} />
      <TurnCardRow title="Fin" value={endDateTime.toFormat("HH:mm")} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeText: { textTransform: "capitalize", fontWeight: "700" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
});
