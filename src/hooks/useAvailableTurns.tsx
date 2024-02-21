import { DateTime } from "luxon";
import { Turn } from "../interfaces/Turns";
import { useEffect, useState } from "react";
import { Complex } from "../interfaces/complexes";
// Settings.defaultZone = "utc";

interface TurnsObject {
  [key: string]: AvailableTurn;
}
interface Props {
  complex?: Complex;
  turns: Turn[];
}

export interface AvailableTurn {
  turnTime: DateTime;
  available: boolean;
  fieldId: string;
  fieldNumber: number;
  playersAmount: number;
}

export const useAvailableTurns = ({ complex, turns }: Props) => {
  const [availableTurns, setAvailableTurns] = useState<AvailableTurn[]>([]);
  const [loadingAvailableTurns, setLoadingAvailableTurns] =
    useState<boolean>(true);
  const [playersAmountsSelectors, setPlayersAmountsSelectors] = useState<
    number[]
  >([]);

  useEffect(() => {
    complex && getAvailableTurns(complex);
    getPlayersAmountsSelectors(availableTurns, true);
    setLoadingAvailableTurns(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    availableTurns &&
      availableTurns.length &&
      getPlayersAmountsSelectors(availableTurns, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTurns]);

  const getAvailableTurns = (
    complex: Complex,
    selectedDate: DateTime = DateTime.now(),
    toState: boolean = true
  ) => {
    const turnsAccumulator: AvailableTurn[] = [];
    toState && setAvailableTurns([]);
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
          month: selectedDate.get("month"),
          year: selectedDate.get("year"),
        });
        if (!complexSchedule.weekDays.includes(openingDate.weekday - 1)) return;
        const closingDate = DateTime.fromObject({
          // Minus 1 because at that time it is closedd
          hour: closingHour - 1,
          minute: closingMinute,
          day: selectedDate.get("day"),
          month: selectedDate.get("month"),
          year: selectedDate.get("year"),
        });

        const hoursDiff = closingDate.diff(openingDate, "hours").toObject();

        const halfTurns = hoursDiff.hours ? hoursDiff.hours * 2 + 1 : 0;

        const availableTurnsHours = Array.from(Array(halfTurns).keys());

        let lastTurn = openingDate.minus({ minutes: 30 });
        const createdTurns = availableTurnsHours.map(() => {
          const newHalfTurn = lastTurn.plus({ minutes: 30 });

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
          const pushingTurn: AvailableTurn = {
            turnTime: newHalfTurn,
            available: !notAvailable,
            fieldId: footballField._id,
            fieldNumber: footballField.fieldNumber,
            playersAmount: footballField.playersAmount,
          };
          turnsAccumulator.push(pushingTurn);
          return pushingTurn;
        });

        turnsAccumulator.concat([...createdTurns]);
      });
    });
    const turnsObject: TurnsObject = {};
    turnsAccumulator.forEach((turn) => {
      if (!turn.available) return;
      const turnTime = turn.turnTime.toFormat("HH:mm");
      const turnKey = `${turnTime}-${turn.playersAmount}`;

      if (!turnsObject[turnKey]) {
        turnsObject[turnKey] = turn;
      } else if (!turnsObject[turnKey].available) {
        turnsObject[turnKey] = turn;
      }
    });

    const finalTurns = Object.keys(turnsObject).map((key) => turnsObject[key]);
    //     const finalTurns = turnsAccumulator;

    toState && setAvailableTurns([...finalTurns]);

    return finalTurns;
  };

  const getPlayersAmountsSelectors = (
    turns: AvailableTurn[],
    toState: boolean = true
  ) => {
    const playersAmountsVariables: number[] = turns.reduce(
      (acc: number[], turn) => {
        if (!acc.includes(turn.playersAmount)) {
          acc.push(turn.playersAmount);
        }
        return acc;
      },
      []
    );
    toState && setPlayersAmountsSelectors(playersAmountsVariables);

    return playersAmountsVariables;
  };

  return {
    loadingAvailableTurns,
    availableTurns,
    playersAmountsSelectors,
    getPlayersAmountsSelectors,
    getAvailableTurns,
  };
};
