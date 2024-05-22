import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { ComplexSchedule } from "../interfaces/ComplexesSchedules";
import { checkScheduleOverlapping } from "../utils/utils";

// We use this state cause the modal is generic and we have to know what we are editing
export interface EditingState {
  scheduleIdx: number;
  editingSchedule: string;
}

export interface ScheduleState {
  _id?: string;
  closingHour: string;
  closingMinute: string;
  openingHour: string;
  openingMinute: string;
  sport: string;
  weekDays: number[];
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

const parseExistingSchedules = (
  existingSchedules: ComplexSchedule[]
): ScheduleState[] => {
  return existingSchedules.map(
    ({ weekDays, openingTime, closingTime, _id }) => {
      const [openingHour, openingMinute] = openingTime.split(":");
      const [closingHour, closingMinute] = closingTime.split(":");
      return {
        openingHour,
        openingMinute,
        closingHour,
        closingMinute,
        weekDays,
        sport: "football",
        _id: _id,
      };
    }
  );
};

interface HookProps {
  existingSchedules?: ComplexSchedule[];
}

export const useAddFields = ({ existingSchedules }: HookProps = {}) => {
  const parsedExistingSchedules = existingSchedules
    ? parseExistingSchedules(existingSchedules)
    : undefined;
  const [footballSchedules, setFootballSchedules] = useState<ScheduleState[]>(
    parsedExistingSchedules || initialState
  );

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

  useEffect(() => {
    existingSchedules &&
      setFootballSchedules(parseExistingSchedules(existingSchedules));
  }, [existingSchedules]);

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

  const onScheduleChange = (date: Date) => {
    const newFootballSchedulesState = [...footballSchedules];
    const { editingSchedule, scheduleIdx } = editing;

    // First check if the schedule overlaps with an existing one
    const overlaps = checkScheduleOverlapping({
      date,
      scheduleIdx,
      compareWithSchedules: footballSchedules,
      onScheduleOverlapping: () =>
        setCurrentPickingError(
          "Ya existe un horario en los mismos días que se superpone con este horario"
        ),
    });
    if (overlaps) {
      return;
    }
    // we can do this cause this type of variables are those ones that are passed by reference
    const currentSchedule = newFootballSchedulesState[scheduleIdx];
    const newDate = DateTime.fromObject({
      hour: date.getHours(),
      minute: date.getMinutes(),
    });
    if (editingSchedule === "opening") {
      const currentClosingDate =
        currentSchedule.closingHour !== "XX"
          ? DateTime.fromObject({
              hour: Number(currentSchedule.closingHour),
              minute: Number(currentSchedule.closingMinute),
            })
          : false;

      if (currentClosingDate && newDate >= currentClosingDate) {
        setCurrentPickingError(
          "La hora de apertura debe ser antes de la hora de cierre"
        );
        return;
      }

      currentSchedule.openingHour = String(newDate.hour).padStart(2, "0");
      currentSchedule.openingMinute = String(newDate.minute).padEnd(2, "0");

      if (scheduleError.scheduleType === "opening") {
        setScheduleError({ ...scheduleError, scheduleType: "" });
      }
      if (scheduleError.scheduleType === "both") {
        setScheduleError({ ...scheduleError, scheduleType: "closing" });
      }
    } else {
      const currentOpeningDate =
        currentSchedule.openingHour !== "XX"
          ? DateTime.fromObject({
              hour: Number(currentSchedule.openingHour),
              minute: Number(currentSchedule.openingMinute),
            })
          : false;
      if (currentOpeningDate && newDate <= currentOpeningDate) {
        setCurrentPickingError(
          "La hora de cierre debe ser después de la hora de apertura"
        );
        return;
      }

      currentSchedule.closingHour = String(newDate.hour).padStart(2, "0");
      currentSchedule.closingMinute = String(newDate.minute).padEnd(2, "0");
      if (scheduleError.scheduleType === "closing") {
        setScheduleError({ ...scheduleError, scheduleType: "" });
      }
      if (scheduleError.scheduleType === "both") {
        setScheduleError({ ...scheduleError, scheduleType: "opening" });
      }
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
    if (dayValue) {
      newFootballSchedulesState[scheduleIdx].weekDays.push(dayIdx);
    } else {
      newFootballSchedulesState[scheduleIdx].weekDays =
        newFootballSchedulesState[scheduleIdx].weekDays.filter(
          (day) => day !== dayIdx
        );
    }
    newFootballSchedulesState[scheduleIdx].weekDays.sort();
    setFootballSchedules(newFootballSchedulesState);
  };

  const onEditing = (newEditing: EditingState) => {
    setEditing(newEditing);
  };

  const deleteSchedule = (scheduleIdx: number) => {
    if (footballSchedules.length === 1) {
      return;
    }
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
        if (emptyIdx > -1) {
          return -1;
        }
        return (
          checkScheduleOverlapping({
            date: DateTime.fromObject({
              hour: Number(openingHour),
              minute: Number(openingMinute),
            }).toJSDate(),
            scheduleIdx: idx,
            compareWithSchedules: footballSchedules,
            onScheduleOverlapping: () =>
              setCurrentPickingError(
                "Ya existe un horario en los mismos días que se superpone con este horario"
              ),
          }) ||
          checkScheduleOverlapping({
            date: DateTime.fromObject({
              hour: Number(closingHour),
              minute: Number(closingMinute),
            }).toJSDate(),
            scheduleIdx: idx,
            compareWithSchedules: footballSchedules,
            onScheduleOverlapping: () =>
              setCurrentPickingError(
                "Ya existe un horario en los mismos días que se superpone con este horario"
              ),
          })
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
