import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { cardStyle, colors, paddings, titleStyle } from "../../theme/appTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DateTime } from "luxon";
import { createTurn, emptyTurns } from "../../redux/slices/turnsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../redux/slices/authSlice";

import { ScrollView } from "react-native-gesture-handler";
import IonIcon from "react-native-vector-icons/Ionicons";
import { FieldComponent } from "../components/FieldComponent";
import { SearchStackParamList } from "../navigators/SearchNavigatorPlayers";
import {
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from "react-native-calendars";
import { Turn } from "../../interfaces/Turns";

interface Props
  extends StackScreenProps<SearchStackParamList, "ComplexScreen"> {}

export const ComplexScreen = ({ route, navigation }: Props) => {
  const { availableTurns = [], getAvailableTurns = () => {} } = route.params;
  const [selectedTurn, setSelectedTurn] = useState<DateTime>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDateString, setSelectedDateString] = useState(
    DateTime.local().toFormat("yyyy-MM-dd")
  );
  const [selectedField, setSelectedField] = useState({ id: "", number: 1 });
  const { _id: playerId } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { top } = useSafeAreaInsets();
  const complex = route.params?.complex ?? false;

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            padding: 24,
            paddingTop: top,
            backgroundColor: colors.cardBg,
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {complex.name}
          </Text>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    console.log(
      "franco new turns",
      JSON.stringify(
        getAvailableTurns(
          DateTime.fromFormat(selectedDateString, "yyyy-MM-dd")
        ),
        null,
        4
      )
    );
    navigation.setParams({
      availableTurns: getAvailableTurns(
        DateTime.fromFormat(selectedDateString, "yyyy-MM-dd")
      ),
    });
  }, [selectedDateString]);

  const { FootballFields } = complex;

  const submitTurn = () => {
    if (!selectedTurn) {
      return;
    }
    dispatch(
      createTurn(
        {
          playerId,
          complexId: complex._id,
          complexOwnerId: complex.ownerId,
          startDate: selectedTurn,
          endDate: selectedTurn.plus({
            hours: 1,
          }),
          fieldId: selectedField.id,
          fieldNumber: selectedField.number,
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
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#00000044",
          }}
        >
          <View
            style={{
              backgroundColor: colors.cardBg,
              padding: 16,
              borderRadius: paddings.globalRadius,
              gap: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text style={{ ...titleStyle }}>Reservar turno</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <IonIcon name="close-outline" size={24} color={"red"} />
              </TouchableOpacity>
            </View>
            <Text style={{}}>
              ¿Quieres reservar el turno de las{" "}
              {selectedTurn?.toFormat("HH:mm")}?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitTurn}>
                <Text>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CalendarProvider
        date={selectedDateString}
        theme={{
          backgroundColor: "#040404",
          selectedDayBackgroundColor: "#000",
          arrowWidth: 90,
          monthTextColor: "green",
          todayButtonFontSize: 40,
          agendaKnobColor: "red",
        }}
        onDateChanged={(date) => setSelectedDateString(date)}
        style={{ flex: 1 }}
      >
        <ExpandableCalendar
          disablePan
          hideKnob
          openThreshold={0}
          closeThreshold={0}
          allowShadow
          style={{ paddingBottom: 16 }}
          theme={{
            backgroundColor: "red",
            monthTextColor: "green",
            todayBackgroundColor: "yellow",
            todayButtonTextColor: "green",
            selectedDayBackgroundColor: "green",
            selectedDayTextColor: "white",
            textSectionTitleColor: "red",
            textDayFontWeight: "bold",
            dayTextColor: "black",
            agendaDayTextColor: "green",
            stylesheet: {
              expandable: {
                main: {
                  knob: {
                    width: 40,
                    height: 4,
                    borderRadius: 3,
                    backgroundColor: "green",
                  },
                  containerShadow: {
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 0,
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                  },
                },
              },
            },
          }}
        />
        {/* <WeekCalendar
            theme={{
              agendaTodayColor: "red",
            }}
            renderHeader={() => <Text>Hello</Text>}
            allowShadow
          /> */}
        <ScrollView
          style={{
            flex: 1,
            marginTop: 120,
          }}
          contentContainerStyle={{
            flex: 1,
            paddingBottom: 420,
          }}
        >
          <Text style={titleStyle}>{complex.name}</Text>
          <View style={{ gap: 16, flex: 1 }}>
            {FootballFields
              ? FootballFields.map((footballField) => {
                  const fieldTurns = availableTurns.filter((turn) => {
                    return turn.fieldId === footballField._id;
                  });
                  return (
                    <FieldComponent
                      availableTurns={fieldTurns}
                      footballField={footballField}
                      onTurnPress={(turnTime) => {
                        setSelectedTurn(turnTime);
                        setModalVisible(true);
                        setSelectedField({
                          id: footballField._id,
                          number: footballField.fieldNumber,
                        });
                      }}
                      complex={complex}
                    />
                  );
                })
              : null}
          </View>
          <TouchableOpacity
            style={{
              position: "absolute",
              backgroundColor: "#FF5858",
              bottom: 120,
              right: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 4,
            }}
            onPress={() => dispatch(emptyTurns())}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Empty Turns
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </CalendarProvider>
    </View>
  );
};
