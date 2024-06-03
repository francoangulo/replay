import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  calendarProviderStyles,
  calendarProviderTheme,
  colors,
  expandableCalendarTheme,
} from "../../theme/appTheme";
import { DateTime } from "luxon";
import { createTurn } from "../../redux/slices/turnsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../redux/slices/authSlice";

import { ScrollView } from "react-native-gesture-handler";
import IonIcon from "react-native-vector-icons/Ionicons";
import { SearchStackParamList } from "../navigators/SearchNavigatorPlayers";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Turn } from "../../interfaces/Turns";
import { Header } from "../components/Header";
import { TurnTimeSelector } from "../components/TurnTimeSelector";
import { ComplexBanner } from "../components/ComplexBanner";
import { ConfirmTurnModal } from "../components/ConfirmTurnModal";
import { TurnDurationSelector } from "../components/TurnDurationSelector";
import { PlayersAmountSelector } from "../components/PlayersAmountSelector";
import { AvailableTurn } from "../../hooks/useAvailableTurns";
import { CommonActions } from "@react-navigation/native";
import { GenericButton } from "../../components/GenericButton";

interface Props
  extends StackScreenProps<SearchStackParamList, "ComplexScreen"> {}

export interface SelectedTurnState {
  turnTime?: DateTime;
  duration?: 60 | 90 | 120;
}

export const ComplexScreen = ({ route, navigation }: Props) => {
  let {
    availableTurns = [],
    getAvailableTurns,
    playersAmountsSelectors,
    getPlayersAmountsSelectors,
  } = route.params;
  const complex = route.params?.complex ?? false;

  const [filteredTurns, setFilteredTurns] = useState(availableTurns);
  const [selectedPlayersAmount, setSelectedPlayersAmount] = useState<number>(
    playersAmountsSelectors[0] || 5
  );

  const [loading, setLoading] = useState(true);
  const [selectedTurn, setSelectedTurn] = useState<SelectedTurnState>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    DateTime.local().toFormat("yyyy-MM-dd")
  );
  const [selectedField, setSelectedField] = useState({ id: "", number: 1 });
  const user = useAppSelector(selectAuth);
  const { _id: playerId } = user;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const newFilteredTurns = availableTurns.filter(
      ({ playersAmount }) => playersAmount === selectedPlayersAmount
    );
    if (newFilteredTurns.length) {
      setFilteredTurns(sortByDate(newFilteredTurns));
      setLoading(false);
    } else {
      setFilteredTurns(
        sortByDate(
          availableTurns.filter(
            ({ playersAmount }) =>
              playersAmount === playersAmountsSelectors[0] || 5
          )
        )
      );
      setLoading(false);
      setSelectedPlayersAmount(playersAmountsSelectors[0] || 5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTurns]);

  useEffect(() => {
    const newTurns = getAvailableTurns(
      complex,
      DateTime.fromFormat(selectedDateString, "yyyy-MM-dd"),
      false
    );
    navigation.dispatch(
      CommonActions.setParams({
        availableTurns: newTurns,
        playersAmountsSelectors: getPlayersAmountsSelectors(newTurns, false),
      })
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateString]);

  useEffect(() => {
    const newFilteredTurns = sortByDate(
      availableTurns.filter(
        ({ playersAmount }) => playersAmount === selectedPlayersAmount
      )
    );

    setFilteredTurns(newFilteredTurns);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlayersAmount]);

  const submitTurn = () => {
    if (!selectedTurn?.turnTime || !selectedTurn.duration) {
      return;
    }
    dispatch(
      createTurn(
        {
          playerId,
          complexId: complex._id,
          complexOwnerId: complex.ownerId,
          startDate: selectedTurn.turnTime,
          endDate: selectedTurn.turnTime.plus({
            minutes: selectedTurn.duration,
          }),
          fieldId: selectedField.id,
          fieldNumber: selectedField.number,
          duration: selectedTurn.duration,
          playersAmount: selectedPlayersAmount,
        },
        (turn: Turn) => {
          navigation.replace("BookedTurnScreen", { turn });
        }
      )
    );
    //     setModalVisible(false);
    //     navigation.pop();
  };

  return (
    <View style={styles.screenContainer}>
      <ConfirmTurnModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedTurn={selectedTurn}
        submitTurn={submitTurn}
      />
      <Header title={complex.name} navigation={navigation} route={route} />
      <ScrollView
        style={styles.scrollViewStyle}
        contentContainerStyle={styles.scrollViewContentStyle}
      >
        <CalendarProvider
          date={selectedDateString}
          theme={calendarProviderTheme}
          onDateChanged={(date) => {
            setLoading(true);
            setSelectedDateString(date);
          }}
          style={calendarProviderStyles}
        >
          <ComplexBanner complex={complex} />
          <View style={styles.dateSelectorTitleContainer}>
            <IonIcon name="calendar-outline" size={18} />
            <Text style={styles.dateSelectorTitle}>Selecciona la fecha</Text>
          </View>
          <ExpandableCalendar
            disablePan
            hideKnob
            openThreshold={0}
            closeThreshold={0}
            allowShadow
            style={styles.calendar}
            theme={expandableCalendarTheme}
          />
          {loading ? (
            <ActivityIndicator size={50} />
          ) : (
            <>
              <PlayersAmountSelector
                playersAmountsSelectors={playersAmountsSelectors}
                selectedPlayersAmount={selectedPlayersAmount}
                setSelectedPlayersAmount={setSelectedPlayersAmount}
              />
              <TurnTimeSelector
                filteredTurns={filteredTurns}
                setSelectedField={setSelectedField}
                setSelectedTurn={setSelectedTurn}
                selectedTurn={selectedTurn}
              />
              <TurnDurationSelector
                selectedTurn={selectedTurn}
                filteredTurns={filteredTurns}
                setSelectedTurn={setSelectedTurn}
              />
            </>
          )}

          {filteredTurns.length ? (
            <View style={styles.footerButtonsContainer}>
              <GenericButton
                buttonText="Reservar Turno"
                buttonType="primary"
                {...(!(selectedTurn?.turnTime && selectedTurn?.duration) && {
                  customButtonStyle: { opacity: 0.35 },
                })}
                onButtonPress={submitTurn}
              />
            </View>
          ) : null}
        </CalendarProvider>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  calendar: { paddingBottom: 16, zIndex: 1, height: 140 },
  dateSelectorTitleContainer: {
    width: "100%",
    paddingTop: 8,
    zIndex: 33,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cardBg,
    gap: 8,
  },
  dateSelectorTitle: { fontWeight: "bold" },
  scrollViewStyle: {
    flex: 1,
  },
  scrollViewContentStyle: {
    //     flex: 1,
    justifyContent: "space-between",
    //     paddingBottom: 232,
  },
  footerButtonsContainer: {
    padding: 16,
  },

  emptyTurnsButton: {
    backgroundColor: "#FF5858",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  emptyTurnsButtonText: { color: "white", fontWeight: "bold" },

  bookTurnButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    width: "100%",
    alignItems: "center",
  },
  bookTurnButtonText: { color: "white", fontWeight: "bold" },
});

const sortByDate = (turnsToSort: AvailableTurn[]) =>
  turnsToSort.sort((turnA, turnB) => {
    if (turnA.turnTime < turnB.turnTime) return -1;
    if (turnB.turnTime < turnA.turnTime) return 1;
    return 0;
  });
