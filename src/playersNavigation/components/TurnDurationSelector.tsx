import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/appTheme";
import { AvailableTurn } from "../../hooks/useAvailableTurns";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { SelectedTurnState } from "../screens/ComplexScreen";

interface Props {
  selectedTurn?: SelectedTurnState;
  filteredTurns: AvailableTurn[];
  setSelectedTurn: React.Dispatch<React.SetStateAction<SelectedTurnState>>;
}

const durations: [60, 90, 120] = [60, 90, 120];

export const TurnDurationSelector = ({
  selectedTurn,
  filteredTurns,
  setSelectedTurn,
}: Props) => {
  if (!filteredTurns?.length) return <></>;
  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        <MCIcon name="timer-sand" size={18} />
        <Text style={styles.cardTitle}>Selecciona la duración del turno</Text>
      </View>
      <View
        style={{
          ...styles.turnsListContainer,
        }}
      >
        {durations.map((duration, index) => {
          const isAvailable = filteredTurns.find(
            ({ turnTime }) =>
              (selectedTurn?.turnTime && duration === 60) ||
              selectedTurn?.turnTime
                ?.plus({ minutes: duration - 60 })
                .toFormat("HH:mm") === turnTime.toFormat("HH:mm")
          );
          return (
            <TouchableOpacity
              key={`duration-selector-${index}`}
              style={{
                ...styles.turnButton,
                ...(selectedTurn?.duration === duration && {
                  backgroundColor: colors.primary,
                }),
              }}
              onPress={() => {
                isAvailable && setSelectedTurn({ ...selectedTurn, duration });
              }}
              {...(!isAvailable && { activeOpacity: 1 })}
            >
              <Text
                style={{
                  ...styles.turnText,
                  ...(!isAvailable && {
                    color: "#555",
                    borderColor: "#555",
                    opacity: 0.25,
                  }),
                  ...(selectedTurn?.duration === duration && {
                    color: colors.cardBg,
                    fontWeight: "bold",
                  }),
                }}
              >
                {minutesToHours(duration).hour}h{" "}
                {minutesToHours(duration).minutes > 0
                  ? `${minutesToHours(duration).minutes}m`
                  : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.cardBg,
    paddingBottom: 16,
    marginTop: 20,
  },
  titleContainer: {
    width: "100%",
    paddingTop: 16,
    zIndex: 33,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: { fontWeight: "bold" },
  turnsListContainer: {
    paddingHorizontal: 32,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  turnButton: { flexShrink: 0, borderRadius: 4 },

  turnText: {
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    textAlign: "center",
  },
});

const minutesToHours = (minute: 60 | 90 | 120) => {
  const hour = Math.trunc(minute / 60);
  const minutes = minute % 60;
  return { hour, minutes };
};
