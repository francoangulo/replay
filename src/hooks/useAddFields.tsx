import { DateTime } from "luxon";
import { useState } from "react";

export interface EditingState {
  scheduleIdx: number;
  editingSchedule: string;
}

export interface ScheduleState {
  openingHour: string;
  openingMinute: string;
  closingHour: string;
  closingMinute: string;
  weekDays: number[];
  sport: string;
}

const initialState: ScheduleState[] = [
  {
    openingHour: "XX",
    openingMinute: "XX",
    closingHour: "XX",
    closingMinute: "XX",
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    sport: "football",
  },
];

export const useAddFields = () => {
  const [footballSchedules, setFootballSchedules] =
    useState<ScheduleState[]>(initialState);

  const [modalVisible, setModalVisible] = useState(false);

  const [currentPickingError, setCurrentPickingError] = useState("");

  const [currentPickingDate, setCurrentPickingDate] = useState<Date>(
    // with this we avoid setting times like 21:27 when there is no picker date change
    DateTime.now().set({ minute: 0 }).toJSDate()
  );

  const [scheduleError, setScheduleError] = useState({
    scheduleIdx: [-1],
    error: "",
    scheduleType: "",
  });

  const [editing, setEditing] = useState<EditingState>({
    scheduleIdx: 0,
    editingSchedule: "opening",
  });

  const addFootballSchedule = () => {
    const newFootballSchedulesState = [...footballSchedules];
    newFootballSchedulesState.push({
      openingHour: "XX",
      openingMinute: "XX",
      closingHour: "XX",
      closingMinute: "XX",
      weekDays: [0, 1, 2, 3, 4, 5, 6],
      sport: "football",
    });
    setFootballSchedules(newFootballSchedulesState);
  };

  const checkScheduleOverlapping = (
    date: Date,
    scheduleIdx: number
  ): boolean => {
    const newDateHours = Number(String(date.getHours()).padStart(2, "0"));
    const newDateMinutes = Number(String(date.getMinutes()).padEnd(2, "0"));
    const overlaps = footballSchedules.some(
      (
        { openingHour, openingMinute, closingHour, closingMinute, weekDays },
        idx
      ) => {
        if (scheduleIdx !== idx) {
          const numberOpeningHour = Number(openingHour);
          const numberOpeningMinute = Number(openingMinute);
          const numberClosingHour = Number(closingHour);
          const numberClosingMinute = Number(closingMinute);

          if (
            // el horario actual coincide en días con otro horario ya existente
            footballSchedules[scheduleIdx].weekDays.some(
              (day) => weekDays.indexOf(day) >= 0
            ) &&
            // la hora está entre otro horario
            ((newDateHours > numberOpeningHour &&
              newDateHours < numberClosingHour) ||
              // misma hora, pero mayor minuto (cae dentro por los minutos)
              (newDateHours === numberOpeningHour &&
                newDateMinutes > numberOpeningMinute) ||
              // misma hora, pero menor minuto (cae dentro por los minutos)
              (newDateHours === numberClosingHour &&
                newDateMinutes < numberClosingMinute))
          ) {
            setCurrentPickingError(
              "Los horarios de una misma cancha no pueden superponerse A"
            );
            return true;
          }

          const currentScheduleNumberOpeningHour = Number(
            footballSchedules[scheduleIdx].openingHour
          );
          const currentScheduleNumberOpeningMinute = Number(
            footballSchedules[scheduleIdx].openingMinute
          );
          const currentScheduleNumberClosingHour = Number(
            footballSchedules[scheduleIdx].closingHour
          );
          const currentScheduleNumberClosingMinute = Number(
            footballSchedules[scheduleIdx].closingMinute
          );
          if (editing.editingSchedule === "opening") {
            if (
              footballSchedules[scheduleIdx].weekDays.some(
                (day) => weekDays.indexOf(day) >= 0
              ) &&
              (((numberOpeningHour > newDateHours ||
                (numberOpeningHour === newDateHours &&
                  numberOpeningMinute > newDateMinutes)) &&
                numberClosingHour < currentScheduleNumberClosingHour) ||
                (numberClosingHour === currentScheduleNumberClosingHour &&
                  numberClosingMinute < currentScheduleNumberClosingMinute))
            ) {
              setCurrentPickingError(
                "Los horarios de una misma cancha no pueden superponerse B"
              );
              return true;
            }
          } else {
            if (
              footballSchedules[scheduleIdx].weekDays.some(
                (day) => weekDays.indexOf(day) >= 0
              ) &&
              (((numberOpeningHour > currentScheduleNumberOpeningHour ||
                (numberOpeningHour === currentScheduleNumberOpeningHour &&
                  numberOpeningMinute > currentScheduleNumberOpeningMinute)) &&
                numberClosingHour < newDateHours) ||
                (numberClosingHour === newDateHours &&
                  numberClosingMinute < newDateMinutes))
            ) {
              setCurrentPickingError(
                "Los horarios de una misma cancha no pueden superponerse C"
              );
              return true;
            }
          }
        }
        return false;
      }
    );

    return overlaps;
  };

  const onScheduleChange = (date: Date) => {
    const newFootballSchedulesState = [...footballSchedules];
    const { editingSchedule, scheduleIdx } = editing;
    const overlaps = checkScheduleOverlapping(date, scheduleIdx);
    if (overlaps) return;
    // we can do this cause this type of variables are those ones that are passed by reference
    const currentSchedule = newFootballSchedulesState[scheduleIdx];
    const newDateHours = String(date.getHours()).padStart(2, "0");
    const newDateMinutes = String(date.getMinutes()).padEnd(2, "0");
    if (editingSchedule === "opening") {
      if (
        newDateHours > currentSchedule.closingHour ||
        (newDateHours === currentSchedule.closingHour &&
          (newDateMinutes > currentSchedule.closingMinute ||
            newDateMinutes === currentSchedule.closingMinute))
      ) {
        setCurrentPickingError(
          "La hora de apertura debe ser antes de la hora de cierre"
        );
        return;
      }

      currentSchedule.openingHour = newDateHours;
      currentSchedule.openingMinute = newDateMinutes;

      if (scheduleError.scheduleType === "opening")
        setScheduleError({ ...scheduleError, scheduleType: "" });
      if (scheduleError.scheduleType === "both")
        setScheduleError({ ...scheduleError, scheduleType: "closing" });
    } else {
      if (
        currentSchedule.openingHour !== "XX" &&
        currentSchedule.openingMinute !== "XX" &&
        (newDateHours < currentSchedule.openingHour ||
          (newDateHours === currentSchedule.openingHour &&
            (newDateMinutes < currentSchedule.openingMinute ||
              newDateMinutes === currentSchedule.openingMinute)))
      ) {
        setCurrentPickingError(
          "La hora de cierre debe ser después de la hora de apertura"
        );
        return;
      }

      currentSchedule.closingHour = newDateHours;
      currentSchedule.closingMinute = newDateMinutes;
      if (scheduleError.scheduleType === "closing")
        setScheduleError({ ...scheduleError, scheduleType: "" });
      if (scheduleError.scheduleType === "both")
        setScheduleError({ ...scheduleError, scheduleType: "opening" });
    }
    setModalVisible(false);
    setCurrentPickingError("");
    setFootballSchedules(newFootballSchedulesState);
  };

  const onWeekDaysChange = (
    scheduleIdx: number,
    dayIdx: number,
    dayValue: boolean
  ) => {
    const newFootballSchedulesState = [...footballSchedules];
    if (dayValue) newFootballSchedulesState[scheduleIdx].weekDays.push(dayIdx);
    else
      newFootballSchedulesState[scheduleIdx].weekDays =
        newFootballSchedulesState[scheduleIdx].weekDays.filter(
          (day) => day !== dayIdx
        );
    newFootballSchedulesState[scheduleIdx].weekDays.sort();
    setFootballSchedules;
  };

  const onEditing = (editing: EditingState) => {
    setEditing(editing);
  };

  const deleteSchedule = (scheduleIdx: number) => {
    if (footballSchedules.length === 1) return;
    const spliceSchedulesState = [...footballSchedules];
    spliceSchedulesState.splice(scheduleIdx, 1);
    setFootballSchedules([...spliceSchedulesState]);
  };

  const schedulesHaveErrors = (): boolean => {
    let emptyIdx = -1;
    let overlapingIdx = -1;
    let scheduleType = "";
    emptyIdx = footballSchedules.findIndex(
      ({ openingHour, openingMinute, closingHour, closingMinute }) =>
        openingHour === "XX" ||
        openingMinute === "XX" ||
        closingHour === "XX" ||
        closingMinute === "XX"
    );
    overlapingIdx = footballSchedules.findIndex(
      ({ openingHour, openingMinute, closingHour, closingMinute }, idx) => {
        if (emptyIdx > -1) return -1;
        return (
          checkScheduleOverlapping(
            DateTime.fromObject({
              hour: Number(openingHour),
              minute: Number(openingMinute),
            }).toJSDate(),
            idx
          ) ||
          checkScheduleOverlapping(
            DateTime.fromObject({
              hour: Number(closingHour),
              minute: Number(closingMinute),
            }).toJSDate(),
            idx
          )
        );
      }
    );
    if (emptyIdx > -1) {
      const isOpening =
        footballSchedules[emptyIdx].openingHour === "XX" &&
        footballSchedules[emptyIdx].openingMinute === "XX";

      const isClosing =
        footballSchedules[emptyIdx].closingHour === "XX" &&
        footballSchedules[emptyIdx].closingMinute === "XX";

      isClosing && (scheduleType = "closing");
      isOpening && (scheduleType = "opening");
      isOpening && isClosing && (scheduleType = "both");
    }

    console.log("franco empty", JSON.stringify(emptyIdx, null, 4));
    console.log("franco overlaping", JSON.stringify(overlapingIdx, null, 4));

    if (emptyIdx > -1) {
      setScheduleError({
        scheduleIdx: [emptyIdx],
        scheduleType,
        error: "Por favor completa el horario",
      });
      return true;
    }

    if (overlapingIdx > -1) {
      setScheduleError({
        scheduleIdx: [overlapingIdx],
        scheduleType: "both",
        error: "Este horario se superpone con otro",
      });
      return true;
    }

    return false;
  };

  return {
    deleteSchedule,
    onEditing,
    currentPickingError,
    currentPickingDate,
    editing,
    setCurrentPickingError,
    setCurrentPickingDate,
    setModalVisible,
    onScheduleChange,
    modalVisible,
    schedulesHaveErrors,
    footballSchedules,
    scheduleError,
    addFootballSchedule,
    onWeekDaysChange,
  };
};
