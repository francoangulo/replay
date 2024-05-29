import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { DateTime } from "luxon";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Turn } from "../../interfaces/Turns";
import { TurnCardRow } from "../../sharedNavigation/components/TurnCardRow";
import { TextComponent } from "../../components/TextComponent";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";

interface Props {
  onPress: () => void;
  turn: Turn;
}

export const PendingConfirmationTurn = ({ onPress, turn }: Props) => {
  const { startDate, endDate } = turn;
  const { complexes } = useAppSelector(selectComplexes);
  const startDateTime = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[cardStyle, { backgroundColor: colors.dangerLight }]}
    >
      <View style={styles.cardHeader}>
        <TextComponent type="subtitle">
          {complexes.find((complex) => complex._id === turn.complexId)?.name ||
            ""}
        </TextComponent>
        <IonIcon name="alert" size={24} color={colors.danger} />
      </View>
      <TextComponent type="text">
        Cancha {String(turn.fieldNumber)}
      </TextComponent>
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
