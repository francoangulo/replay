import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { colors } from "../../theme/appTheme";
import { useAddFields } from "../../hooks/useAddFields";
import { TimePickerModal } from "../components/TimePickerModal";
import { ScheduleCard } from "../components/ScheduleCard";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import ADIcon from "react-native-vector-icons/AntDesign";
import { FadeModal } from "../components/FadeModal";
import {
  deleteComplexSchedule,
  putComplexSchedules,
} from "../../redux/actions/complexes";
import { GenericButton } from "../../components/GenericButton";
import { FieldsAddError } from "../components/ModalsBodies/FieldsAddError";
import { FadeModalState } from "../../interfaces/FadeModal";
import { selectComplexById } from "../../redux/slices/complexesSlice";
import { ScheduleRemove } from "../components/ModalsBodies/ScheduleRemove";
import { ScheduleRemoveSuccess } from "../components/ModalsBodies/ScheduleRemoveSuccess";
import { ConfirmScheduleDeletion } from "../components/ModalsBodies/ConfirmScheduleDeletion";
import { GenericFadeModal } from "../components/GenericFadeModal";

type Props = StackScreenProps<ProfileStackParamList, "SchedulesScreen">;

export const SchedulesScreen = ({ navigation, route }: Props) => {
  const complexId = route?.params?.complexId;

  const complex = useAppSelector((state) =>
    selectComplexById(state, complexId)
  );

  useEffect(() => {
    console.log(
      "franco the complex schedules --> ",
      JSON.stringify(complex?.ComplexSchedules, null, 4)
    );
    return () => {};
  }, [complex]);

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
    onEditing,
    scheduleError,
    onWeekDaysChange,
    deleteSchedule,
  } = useAddFields(
    complex?.ComplexSchedules?.length
      ? { existingSchedules: complex?.ComplexSchedules }
      : {}
  );

  const dispatch = useAppDispatch();

  const [resultModalState, setResultModalState] = useState<FadeModalState>({
    visible: false,
    status: "",
    autoDismiss: true,
  });

  const [confirmDeletionModalState, setConfirmDeletionModalState] = useState({
    visible: false,
    scheduleId: "",
    scheduleIndex: 0,
  });

  const onDeleteSchedule = () => {
    setResultModalState({
      visible: true,
      status: "loading",
      autoDismiss: false,
    });
    dispatch(
      deleteComplexSchedule({
        body: {
          schedulesIds: [confirmDeletionModalState.scheduleId],
          complexId,
        },
        callback: () => {
          deleteSchedule(confirmDeletionModalState.scheduleIndex);
          setResultModalState({
            visible: true,
            status: "success",
            autoDismiss: true,
          });
        },
      })
    );
  };

  const showDeleteModal = (scheduleIdx: number, _id: string) => {
    setConfirmDeletionModalState({
      visible: true,
      scheduleId: _id,
      scheduleIndex: scheduleIdx,
    });
  };

  const submitSchedules = () => {
    if (false) {
      setResultModalState({
        visible: true,
        status: "success",
        autoDismiss: true,
      });
    } else {
      const errors = schedulesHaveErrors();
      if (errors) {
        return;
      }
      setResultModalState({
        visible: true,
        status: "loading",
        autoDismiss: false,
      });
      dispatch(
        putComplexSchedules({
          body: {
            schedules: footballSchedules.map(
              ({
                weekDays,
                sport,
                openingHour,
                openingMinute,
                closingHour,
                closingMinute,
                _id,
              }) => ({
                _id,
                closingTime: `${closingHour}:${closingMinute}`,
                openingTime: `${openingHour}:${openingMinute}`,
                sport,
                weekDays,
              })
            ),
            complexId,
          },
          callback: () =>
            setResultModalState({
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
      <ScreenHeader title="Horarios" navigation={navigation} route={route} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.inputsCardsContainers}>
          <View style={styles.schedulesCard}>
            {footballSchedules.map((schedule, scheduleIdx) => (
              <ScheduleCard
                key={`schedule-card-${scheduleIdx}`}
                onDeleteExistingSchedule={showDeleteModal}
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
            <GenericButton
              buttonType="secondary"
              buttonText="Agregar horario"
              rightIcon={
                <ADIcon name="plus" size={24} color={colors.primary} />
              }
              customButtonStyle={styles.dashedButton}
              customTextStyle={{ color: colors.primary }}
              onButtonPress={addFootballSchedule}
            />
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
          onButtonPress={() => submitSchedules()}
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
        modalState={resultModalState}
        setModalState={setResultModalState}
        modalContent={
          resultModalState.status === "error"
            ? FieldsAddError
            : resultModalState.status === "loading"
            ? ScheduleRemove
            : ScheduleRemoveSuccess
        }
      />
      <FadeModal
        modalState={resultModalState}
        setModalState={setResultModalState}
        modalContent={
          resultModalState.status === "error"
            ? FieldsAddError
            : resultModalState.status === "loading"
            ? ScheduleRemove
            : ScheduleRemoveSuccess
        }
      />
      <GenericFadeModal
        visible={confirmDeletionModalState.visible}
        ModalContent={
          <ConfirmScheduleDeletion
            onCancel={() => {
              setConfirmDeletionModalState({
                ...confirmDeletionModalState,
                visible: false,
              });
            }}
            onDelete={() => {
              onDeleteSchedule();
              setConfirmDeletionModalState({
                ...confirmDeletionModalState,
                visible: false,
              });
            }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollView: { flex: 1 },
  scrollViewContent: { paddingBottom: 80 },
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
    borderStyle: "dashed",
    backgroundColor: "transparent",
    color: colors.primary,
  },
});
