import { DateTime } from "luxon";
import { Turn } from "../interfaces/Turns";
import { useEffect, useState } from "react";
import { Complex } from "../interfaces/complexes";
// Settings.defaultZone = "utc";

interface Props {
  complex: Complex;
  turns: Turn[];
}

export interface AvailableTurn {
  turnTime: DateTime;
  available: boolean;
  fieldId: string;
}

export const useAvailableTurns = ({ complex, turns }: Props) => {
  useEffect(() => {
    getAvailableTurns();
    setLoadingAvailableTurns(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [availableTurns, setAvailableTurns] = useState<AvailableTurn[]>([]);
  const [loadingAvailableTurns, setLoadingAvailableTurns] =
    useState<boolean>(true);

  const getAvailableTurns = (selectedDate: DateTime = DateTime.now()) => {
    const turnsAccumulator: AvailableTurn[] = [];
    setAvailableTurns([]);
    complex.FootballFields.forEach((footballField) => {
      complex.ComplexSchedules.forEach((complexSchedule) => {
        // Obtener el rango de horarios de apertura y cierre
        const openingHour = Number(complexSchedule.openingTime.split(":")[0]);
        const openingMinute = Number(complexSchedule.openingTime.split(":")[1]);
        const closingHour = Number(complexSchedule.closingTime.split(":")[0]);
        const closingMinute = Number(complexSchedule.closingTime.split(":")[1]);

        const openingDate = DateTime.fromObject({
          hour: openingHour,
          minute: openingMinute,
          day: selectedDate.get("day"),
        });
        if (!complexSchedule.weekDays.includes(openingDate.weekday - 1)) return;
        const closingDate = DateTime.fromObject({
          // Minus 1 because at that time it is closedd
          hour: closingHour - 1,
          minute: closingMinute,
          day: selectedDate.get("day"),
        });

        console.log("franco opening at", JSON.stringify(openingDate, null, 4));

        const hoursDiff = closingDate.diff(openingDate, "hours").toObject();

        const halfTurns = hoursDiff.hours ? hoursDiff.hours * 2 + 1 : 0;

        const availableTurnsHours = Array.from(Array(halfTurns).keys());

        let lastTurn = openingDate.minus({ minutes: 30 });
        const createdTurns = availableTurnsHours.map(() => {
          const newHalfTurn = lastTurn.plus({ minutes: 30 });

          console.log("franco turns", JSON.stringify(turns, null, 4));

          const notAvailable =
            turns.some((turn) => {
              const turnStart = DateTime.fromISO(turn.startDate);
              const turnEnd = DateTime.fromISO(turn.endDate);
              return (
                footballField._id === turn.fieldId &&
                ((newHalfTurn > turnStart && newHalfTurn < turnEnd) ||
                  (newHalfTurn.plus({ hours: 1 }) > turnStart &&
                    newHalfTurn.plus({ hours: 1 }) < turnEnd) ||
                  newHalfTurn.toMillis() === turnStart.toMillis())
              );
            }) || newHalfTurn.valueOf() < DateTime.local().valueOf();
          lastTurn = newHalfTurn;
          const pushingTurn = {
            turnTime: newHalfTurn,
            available: !notAvailable,
            fieldId: footballField._id,
          };
          turnsAccumulator.push(pushingTurn);
          return pushingTurn;
        });

        turnsAccumulator.concat([...createdTurns]);
      });
    });
    setAvailableTurns([...turnsAccumulator]);
    return turnsAccumulator;
  };
  const formattedTurns = availableTurns.map(({ turnTime }) =>
    turnTime.toFormat("HH:mm")
  );

  return {
    loadingAvailableTurns,
    availableTurns,
    formattedTurns,
    getAvailableTurns,
  };
};
