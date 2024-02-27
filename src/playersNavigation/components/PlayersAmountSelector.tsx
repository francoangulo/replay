import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/appTheme";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";

interface Props {
  playersAmountsSelectors: number[];
  selectedPlayersAmount: number;
  setSelectedPlayersAmount: React.Dispatch<React.SetStateAction<number>>;
}

export const PlayersAmountSelector = ({
  playersAmountsSelectors,
  selectedPlayersAmount,
  setSelectedPlayersAmount,
}: Props) => {
  if (!playersAmountsSelectors?.length) {
    return <></>;
  }
  return (
    <View style={styles.cardContainer}>
      <View style={styles.titleContainer}>
        <MCIcon name="timer-sand" size={18} />
        <Text style={styles.cardTitle}>
          Selecciona la cantidad de jugadores por equipo
        </Text>
      </View>
      <View
        style={{
          ...styles.turnsListContainer,
        }}
      >
        {playersAmountsSelectors.map((playersAmount, index) => {
          return (
            <TouchableOpacity
              key={`players-amount-selector-${index}`}
              style={{
                ...styles.turnButton,
                ...(selectedPlayersAmount === playersAmount && {
                  backgroundColor: colors.primary,
                }),
              }}
              onPress={() => {
                setSelectedPlayersAmount(playersAmount);
              }}
            >
              <Text
                style={{
                  ...styles.turnText,
                  ...(selectedPlayersAmount === playersAmount && {
                    color: colors.cardBg,
                    fontWeight: "bold",
                  }),
                }}
              >
                {playersAmount}
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
