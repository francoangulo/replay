import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { DateTime } from "luxon";
import { Turn } from "../../interfaces/Turns";
import { TurnCardRow } from "../../sharedNavigation/components/TurnCardRow";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";

interface Props {
  onPress: () => void;
  turn: Turn;
  forPlayer?: boolean;
}

export const IncomingTurn = ({ onPress, turn, forPlayer }: Props) => {
  const { startDate, endDate } = turn;
  const startDateTime = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        cardStyle,
        {
          backgroundColor: forPlayer
            ? colors.primaryThree
            : colors.warningLight,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.timeText}>Cancha {turn.fieldNumber}</Text>
        {forPlayer ? (
          <IonIcon name="football" size={24} color={colors.primary} />
        ) : (
          <MCIcon
            name="timeline-clock-outline"
            size={24}
            color={colors.warning}
          />
        )}
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
