import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, ScrollView } from "react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { colors, cardStyle } from "../../theme/appTheme";
import { useAddFields } from "../../hooks/useAddFields";
import { TimePickerModal } from "../components/TimePickerModal";
import { ScheduleCard } from "../components/ScheduleCard";
import { useAppDispatch } from "../../hooks/redux";
import ADIcon from "react-native-vector-icons/AntDesign";
import { FadeModal } from "../components/FadeModal";
import { FieldsAmountSelector } from "../components/FieldsAmountSelector";
import {
  postComplexSchedules,
  postFootballFields,
} from "../../redux/actions/complexes";
import { TextComponent } from "../../components/TextComponent";
import { GenericButton } from "../../components/GenericButton";
import { FieldsAddSuccess } from "../components/ModalsBodies/FieldsAddSuccess";
import { FieldsAddLoading } from "../components/ModalsBodies/FieldsAddLoading";
import { FieldsAddError } from "../components/ModalsBodies/FieldsAddError";
import { FadeModalState } from "../../interfaces/FadeModal";

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
  } = useAddFields({});

  const dispatch = useAppDispatch();

  const [fieldsState, setFieldsState] = useState({
    five: { playersAmount: 5, fieldsAmount: 0 },
    seven: { playersAmount: 7, fieldsAmount: 0 },
    nine: { playersAmount: 9, fieldsAmount: 0 },
    eleven: { playersAmount: 11, fieldsAmount: 0 },
  });
  const [modalState, setModalState] = useState<FadeModalState>({
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
      if (errors) {
        return;
      }
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
    <View style={styles.screenContainer}>
      <ScreenHeader
        title="Canchas y horarios"
        navigation={navigation}
        route={route}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.inputsCardsContainers}>
          <TextComponent type="subtitleLg" children={"Cantidad de canchas"} />

          <View style={[cardStyle, styles.fieldsAmountsCard]}>
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
        <View style={styles.inputsCardsContainers}>
          <TextComponent type="subtitleLg" children={"Horarios"} />
          <View style={styles.schedulesCard}>
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
              style={styles.dashedButton}
              onPress={addFootballSchedule}
            >
              <ADIcon name="plus" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerButtonsWrapper}>
        <GenericButton
          buttonText="Cancelar"
          buttonType="dangerNoBg"
          onButtonPress={() => navigation.pop()}
          customButtonStyle={styles.footerCancelButton}
        />
        <GenericButton
          buttonText="Finalizar"
          buttonType="primary"
          onButtonPress={() => submitComplex()}
          customButtonStyle={styles.footerFinishButton}
        />
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
        modalContent={
          modalState.status === "error"
            ? FieldsAddError
            : modalState.status === "loading"
            ? FieldsAddLoading
            : FieldsAddSuccess
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: { paddingBottom: 60 },
  screenContainer: { flex: 1 },
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
  },
  footerFinishButton: {
    flex: 1.25,
  },
  inputsCardsContainers: { padding: 16, gap: 8 },
  fieldsAmountsCard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  schedulesCard: { flex: 1, alignItems: "center", gap: 16 },
  dashedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderWidth: 1,
    borderColor: "#00000044",
    width: "100%",
    borderRadius: 5,
    borderStyle: "dashed",
  },
});
