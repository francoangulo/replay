import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../theme/appTheme";
import IonIcon from "react-native-vector-icons/Ionicons";
import { AvailableTurn } from "../../hooks/useAvailableTurns";
import { SelectedTurnState } from "../screens/ComplexScreen";
import { DateTime } from "luxon";

interface Props {
  filteredTurns: AvailableTurn[];
  setSelectedTurn: React.Dispatch<React.SetStateAction<SelectedTurnState>>;
  setSelectedField: (
    value: React.SetStateAction<{
      id: string;
      number: number;
    }>
  ) => void;
  selectedTurn: SelectedTurnState;
}

export const TurnTimeSelector = ({
  filteredTurns,
  setSelectedTurn,
  setSelectedField,
  selectedTurn,
}: Props) => {
  const onTimeSelect = (
    turnTime: DateTime,
    fieldId: string,
    fieldNumber: number
  ) => {
    const isAvailable =
      !selectedTurn?.duration ||
      filteredTurns.find(
        ({ turnTime: arrayTurnTime }) =>
          turnTime
            ?.plus({ minutes: selectedTurn.duration })
            .toFormat("HH:mm") === arrayTurnTime.toFormat("HH:mm")
      );

    setSelectedTurn({
      ...(isAvailable && { ...selectedTurn }),
      turnTime,
    });
    setSelectedField({
      id: fieldId,
      number: fieldNumber,
    });
  };
  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        {filteredTurns.length ? (
          <>
            <IonIcon name="time-outline" size={18} />
            <Text style={styles.cardTitle}>Selecciona la hora</Text>
          </>
        ) : (
          <Text style={{ ...styles.cardTitle, paddingBottom: 16 }}>
            No hay turnos disponibles para este día
          </Text>
        )}
      </View>
      {filteredTurns.length ? (
        <FlatList
          contentContainerStyle={styles.turnsListContainer}
          horizontal
          data={filteredTurns}
          renderItem={({ item: { turnTime, fieldId, fieldNumber } }) => {
            return (
              <TouchableOpacity
                style={{
                  ...styles.turnButton,
                  ...(selectedTurn?.turnTime === turnTime && {
                    backgroundColor: colors.primary,
                  }),
                }}
                onPress={() => onTimeSelect(turnTime, fieldId, fieldNumber)}
              >
                <Text
                  style={{
                    ...styles.turnText,
                    ...(selectedTurn?.turnTime === turnTime && {
                      color: colors.cardBg,
                      fontWeight: "bold",
                    }),
                  }}
                >
                  {turnTime.toFormat("HH:mm")}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `field${item.fieldId}-turn${index}`}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.cardBg,
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
  cardTitle: {
    fontWeight: "bold",
    //     paddingBottom: 16,
  },
  turnsListContainer: {
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 16,
  },
  turnButton: { flexShrink: 0, borderRadius: 12 },

  turnText: {
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    textAlign: "center",
  },
});
