import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { colors, cardStyle } from "../../theme/appTheme";
import { useAddFields } from "../../hooks/useAddFields";
import { TimePickerModal } from "../components/TimePickerModal";
import { ScheduleCard } from "../components/ScheduleCard";
import { useAppDispatch } from "../../hooks/redux";
import {
  postComplexSchedules,
  postFootballFields,
} from "../../redux/slices/complexesSlice";
import ADIcon from "react-native-vector-icons/AntDesign";
import { FadeModal } from "../components/FadeModal";
import { FieldsAmountSelector } from "../components/FieldsAmountSelector";

type Props = StackScreenProps<ProfileStackParamList, "AddFieldsScreen">;

export const AddFieldsScreen = ({ navigation, route }: Props) => {
  const {
    currentPickingError,
    currentPickingDate,
    editing,
    setCurrentPickingError,
    setCurrentPickingDate,
    onScheduleChange,
    setModalVisible,
    modalVisible,
    schedulesHaveErrors,
    footballSchedules,
    addFootballSchedule,
    deleteSchedule,
    onEditing,
    scheduleError,
    onWeekDaysChange,
  } = useAddFields();

  const dispatch = useAppDispatch();

  const [fieldsState, setFieldsState] = useState({
    five: { playersAmount: 5, fieldsAmount: 0 },
    seven: { playersAmount: 7, fieldsAmount: 0 },
    nine: { playersAmount: 9, fieldsAmount: 0 },
    eleven: { playersAmount: 11, fieldsAmount: 0 },
  });
  const [modalState, setModalState] = useState({
    visible: false,
    status: "",
    autoDismiss: true,
  });

  useEffect(() => {
    if (modalState.visible === false && modalState.status === "success") {
      navigation.pop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  const complexId = route?.params?.complexId;

  const submitComplex = () => {
    if (false) {
      setModalState({ visible: true, status: "success", autoDismiss: true });
    } else {
      const errors = schedulesHaveErrors();
      if (errors) return;
      setModalState({ visible: true, status: "loading", autoDismiss: false });
      dispatch(
        postFootballFields({ body: { fieldsAmounts: fieldsState, complexId } })
      );
      dispatch(
        postComplexSchedules({
          body: {
            schedules: footballSchedules.map(
              ({
                weekDays,
                sport,
                openingHour,
                openingMinute,
                closingHour,
                closingMinute,
              }) => ({
                weekDays,
                sport,
                openingTime: `${openingHour}:${openingMinute}`,
                closingTime: `${closingHour}:${closingMinute}`,
              })
            ),
            complexId,
          },
          callback: () =>
            setModalState({
              visible: true,
              status: "success",
              autoDismiss: true,
            }),
        })
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Canchas y horarios"
        navigation={navigation}
        route={route}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ padding: 16, gap: 8 }}>
          <Text
            style={{ fontSize: 18, textAlign: "center", fontWeight: "bold" }}
          >
            Cantidad de canchas
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              ...(cardStyle as Object),
            }}
          >
            <View style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                }}
              >
                <FieldsAmountSelector
                  playersAmount={5}
                  fieldsState={fieldsState}
                  playersAmountString={"five"}
                  setFieldsState={setFieldsState}
                />
                <FieldsAmountSelector
                  playersAmount={7}
                  fieldsState={fieldsState}
                  playersAmountString={"seven"}
                  setFieldsState={setFieldsState}
                />
                <FieldsAmountSelector
                  playersAmount={9}
                  fieldsState={fieldsState}
                  playersAmountString={"nine"}
                  setFieldsState={setFieldsState}
                />
                <FieldsAmountSelector
                  playersAmount={11}
                  fieldsState={fieldsState}
                  playersAmountString={"eleven"}
                  setFieldsState={setFieldsState}
                />
              </View>
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{ fontSize: 18, textAlign: "center", fontWeight: "bold" }}
          >
            Horarios
          </Text>
          <View style={{ flex: 1, alignItems: "center", padding: 16, gap: 16 }}>
            {footballSchedules.map((schedule, scheduleIdx) => (
              <ScheduleCard
                key={`schedule-card-${scheduleIdx}`}
                onDeleteSchedule={deleteSchedule}
                onEditing={onEditing}
                schedule={schedule}
                scheduleError={scheduleError}
                scheduleIdx={scheduleIdx}
                schedulesLength={footballSchedules.length}
                setPickerVisible={setModalVisible}
                onWeekDaysChange={onWeekDaysChange}
              />
            ))}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
                borderWidth: 1,
                //     borderColor: colors.primary,
                borderColor: "#00000044",
                width: "100%",
                borderRadius: 5,
                borderStyle: "dashed",
              }}
              onPress={addFootballSchedule}
            >
              <ADIcon name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerButtonsWrapper}>
        <TouchableOpacity
          style={styles.footerCancelButton}
          onPress={() => navigation.pop()}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: colors.danger,
            }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerFinishButton}
          onPress={() => submitComplex()}
        >
          <Text style={{ fontWeight: "bold", color: colors.appBg }}>
            Finalizar
          </Text>
        </TouchableOpacity>
      </View>
      <TimePickerModal
        currentPickingDate={currentPickingDate}
        currentPickingError={currentPickingError}
        editing={editing}
        modalVisible={modalVisible}
        onScheduleChange={onScheduleChange}
        setCurrentPickingDate={setCurrentPickingDate}
        setCurrentPickingError={setCurrentPickingError}
        setModalVisible={setModalVisible}
      />
      <FadeModal
        modalState={modalState}
        setModalState={setModalState}
        modalContent={() => {
          return (
            <View>
              {modalState.status === "error" ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>❗️</Text>
                  <Text style={{ fontSize: 20 }}>Se produjo un error</Text>
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    Si el problema persiste, contacta un administrador
                  </Text>
                </View>
              ) : modalState.status === "loading" ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>⏳</Text>
                  <Text style={{ fontSize: 20 }}>Añadiendo canchas...</Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>✅</Text>
                  <Text style={{ fontSize: 20 }}>
                    Canchas agregadas con éxito!
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addFieldButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  sameSchedulesRow: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  sameSchedulesWrapper: {
    flexDirection: "row",
    backgroundColor: colors.cardBg,
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  fieldsWrapper: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  footerButtonsWrapper: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.appBgTransparent,
  },
  footerCancelButton: {
    flex: 0.75,
    justifyContent: "center",
    alignItems: "center",
  },
  footerFinishButton: {
    flex: 1.25,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
