import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { indexedWeekdays } from "../../utils/constants";
import { useAddFields } from "../../hooks/useAddFields";
import { ScheduleCard } from "../components/ScheduleCard";

type ScreenProps = StackScreenProps<ProfileStackParamList, "SchedulesScreen">;
export const SchedulesScreen = ({ route }: ScreenProps) => {
  const { complexId } = route.params;
  const { complexes } = useAppSelector(selectComplexes);

  const complex = complexes.find(
    (ownerComplex) => ownerComplex._id === complexId
  );
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
  } = useAddFields({ existingSchedules: complex?.ComplexSchedules });

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <TextComponent children={"Horarios"} type="title" />
      </View>
      <View style={styles.mainContentContainer}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  header: { paddingHorizontal: 16 },
  mainContentContainer: { flex: 1 },
});
