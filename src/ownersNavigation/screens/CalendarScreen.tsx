import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";
import { Turn } from "../../interfaces/Turns";
import { DateTime } from "luxon";
import { colors } from "../../theme/appTheme";
import { getRandomPastelColor } from "../../utils/utils";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { CalendarStackParamList } from "../navigators/CalendarNavigator";

type Props = StackScreenProps<CalendarStackParamList, "CalendarScreen">;

const getNumberForPastel = (fieldNumber: number) => {
  return (fieldNumber + 1) / 10;
};

const CalendarScreen = ({ navigation, route }: Props) => {
  const [items, setItems] = useState<AgendaSchedule<Turn>>({});
  const { ownerTurns } = useAppSelector(selectTurns);
  const { complex } = route?.params;

  const [complexTurns, setComplexTurns] = useState<Turn[]>([]);
  const [calendarOpened, setCalendarOpened] = useState(false);

  useEffect(() => {
    const filteredTurns = ownerTurns.filter(
      (turn) => turn.complexId === complex._id
    );
    setComplexTurns(filteredTurns);
  }, []);

  const loadItems = () => {
    const itemsToRender: AgendaSchedule<Turn> = {};
    complexTurns.forEach((turn) => {
      const date = DateTime.fromISO(turn.startDate).toFormat("yyyy-MM-dd");
      if (!itemsToRender[date]) {
        itemsToRender[date] = [turn];
      } else {
        itemsToRender[date].push(turn);
      }
      itemsToRender[date].sort((a, b) => {
        if (
          DateTime.fromISO(a.startDate).toMillis() <
          DateTime.fromISO(b.startDate).toMillis()
        ) {
          return -1;
        }
        if (
          DateTime.fromISO(b.startDate).toMillis() <
          DateTime.fromISO(a.startDate).toMillis()
        ) {
          return 1;
        }
        return 0;
      });
    });
    setItems(itemsToRender);
  };
  useEffect(() => {
    loadItems();
  }, []);

  const renderItem = ({ startDate, endDate, fieldNumber }: Turn) => {
    return (
      <View
        style={{
          ...styles.item,
          backgroundColor: getRandomPastelColor((fieldNumber + 1) / 10),
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text>{DateTime.fromISO(startDate).toFormat("HH:mm")}</Text>
          <Text>{DateTime.fromISO(endDate).toFormat("HH:mm")}</Text>
        </View>
        <Text style={{ opacity: 0.4 }}>Cancha {fieldNumber}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.appBg,
      }}
    >
      <Agenda
        theme={{
          agendaTodayColor: colors.primary,
          agendaKnobColor: colors.primary,
          dotColor: colors.primary,
          backgroundColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          todayTextColor: colors.primary,
          calendarBackground: colors.appBg,
        }}
        calendarStyle={{ flex: 1, height: "100%" }}
        pastScrollRange={6}
        futureScrollRange={1}
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem}
        renderEmptyData={() => {
          return (
            <View
              style={{
                padding: 32,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Sin Turnos</Text>
            </View>
          );
        }}
        showScrollIndicator={true}
        showClosingKnob={true}
        showOnlySelectedDayItems={true}
        onCalendarToggled={(calendarOpened) =>
          setCalendarOpened(calendarOpened)
        }
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          gap: 4,
        }}
      >
        <Text>{complex.name}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 24,
            alignItems: "center",
          }}
        >
          {!calendarOpened ? (
            complex.FootballFields.map(({ fieldNumber }) => {
              return (
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <View
                    style={{
                      backgroundColor: getRandomPastelColor(
                        getNumberForPastel(fieldNumber)
                      ),
                      width: 10,
                      height: 10,
                      borderRadius: 10,
                    }}
                  />
                  <Text>Cancha {fieldNumber}</Text>
                </View>
              );
            })
          ) : (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <View
                style={{
                  backgroundColor: colors.primary,
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                }}
              />
              <Text>Días con turnos</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
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

export default CalendarScreen;
