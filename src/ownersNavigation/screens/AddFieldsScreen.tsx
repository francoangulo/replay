import React, { useState } from "react";
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
import IonIcon from "react-native-vector-icons/Ionicons";
import { ScheduleCard } from "../components/ScheduleCard";
import { useAppDispatch } from "../../hooks/redux";
import {
  postComplexSchedules,
  postFootballFields,
} from "../../redux/slices/complexesSlice";
import ADIcon from "react-native-vector-icons/AntDesign";

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

  const [fieldsAmount, setFieldsAmount] = useState(1);
  console.log("franco route", JSON.stringify(route, null, 4));
  const complexId = route?.params?.complexId;

  const submitComplex = () => {
    const errors = schedulesHaveErrors();
    console.log("franco errores", JSON.stringify(errors, null, 4));
    if (errors) return;
    dispatch(postFootballFields({ body: { fieldsAmount, complexId } }));
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
      })
    );
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
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text style={{ fontSize: 16 }}>Fútbol</Text>
                <IonIcon
                  name="football-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 50,
                  }}
                >
                  {fieldsAmount}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.appBgTransparent,
                    padding: 8,
                    borderRadius: 8,
                  }}
                  onPress={() => setFieldsAmount(fieldsAmount + 1)}
                >
                  <IonIcon name="add-outline" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.appBgTransparent,
                    padding: 8,
                    borderRadius: 8,
                  }}
                  onPress={() => setFieldsAmount(fieldsAmount - 1)}
                >
                  <IonIcon name="remove-outline" size={24} />
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{ flex: 1, alignItems: "center" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MCIcon name="table-tennis" size={24} color={colors.primary} />
                <Text style={{ fontSize: 16 }}>Padel</Text>
              </View>
              <Text
                style={{
                  fontSize: 50,
                }}
              >
                1
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.appBgTransparent,
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <IonIcon name="add-outline" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.appBgTransparent,
                    padding: 8,
                    borderRadius: 8,
                  }}
                >
                  <IonIcon name="remove-outline" size={24} />
                </TouchableOpacity>
              </View>
            </View> */}
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
                borderColor: colors.primary,
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
        {/* <View style={styles.fieldsWrapper}>
          {fieldsState.map(({ fieldSchedules }, fieldIdx) => {
            return (
              <FieldCard
                key={`field-card-${fieldIdx}`}
                addSchedule={addSchedule}
                fieldIdx={fieldIdx}
                fieldSchedules={fieldSchedules}
                onEditing={onEditing}
                onDelete={deleteField}
                setPickerVisible={setModalVisible}
                fieldsLength={fieldsState.length}
                onDeleteSchedule={deleteSchedule}
                fieldError={fieldError}
              />
            );
          })}
          <TouchableOpacity style={styles.addFieldButton} onPress={addField}>
            <ADIcon name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View> */}
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
