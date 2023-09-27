import { FootballField } from "../interfaces/FootballFields";
import { DateTime, Settings } from "luxon";
import { Turn } from "../interfaces/Turns";
import { useEffect, useState } from "react";
Settings.defaultZone = "utc";

interface Props {
  footballFields: FootballField[];
  turns: Turn[];
}

export interface AvailableTurn {
  turnTime: DateTime;
  available: boolean;
  fieldId: string;
}

export const useAvailableTurns = ({ footballFields, turns }: Props) => {
  let turnsVariable: AvailableTurn[] = [];
  useEffect(() => {
    getAvailableTurns();
    setLoadingAvailableTurns(false);
  }, []);

  const [availableTurns, setAvailableTurns] = useState<AvailableTurn[]>([]);
  const [loadingAvailableTurns, setLoadingAvailableTurns] =
    useState<boolean>(true);

  const getAvailableTurns = () => {
    footballFields.forEach((footballField) => {
      footballField.FieldSchedules.forEach((fieldSchedule) => {
        // Obtener el rango de horarios de apertura y cierre
        const openingHour = Number(fieldSchedule.openingTime.split(":")[0]);
        const openingMinute = Number(fieldSchedule.openingTime.split(":")[1]);
        const closingHour = Number(fieldSchedule.closingTime.split(":")[0]);
        const closingMinute = Number(fieldSchedule.closingTime.split(":")[1]);
        const openingDate = DateTime.fromObject({
          hour: openingHour,
          minute: openingMinute,
        });
        const closingDate = DateTime.fromObject({
          // Minus 1 because at that time it is closedd
          hour: closingHour - 1,
          minute: closingMinute,
        });

        const hoursDiff = closingDate.diff(openingDate, "hours").toObject();
        const halfTurns = hoursDiff.hours ? hoursDiff.hours * 2 + 1 : 0;

        const availableTurnsHours = Array.from(Array(halfTurns).keys());
        let lastTurn = openingDate.minus({ minutes: 30 });
        const createdTurns = availableTurnsHours.map(() => {
          const newHalfTurn = lastTurn.plus({ minutes: 30 });
          const notAvailable = turns.some((turn) => {
            const turnStart = DateTime.fromISO(turn.startDate);
            const turnEnd = DateTime.fromISO(turn.endDate);

            return (
              (newHalfTurn > turnStart && newHalfTurn < turnEnd) ||
              (newHalfTurn.plus({ hours: 1 }) > turnStart &&
                newHalfTurn.plus({ hours: 1 }) < turnEnd) ||
              newHalfTurn.toMillis() === turnStart.toMillis()
            );
          });
          lastTurn = newHalfTurn;
          return {
            turnTime: newHalfTurn,
            available: !notAvailable,
            fieldId: footballField._id,
          };
        });
        //   turnsVariable = [...availableTurns, ...createdTurns];
        setAvailableTurns([...availableTurns, ...createdTurns]);
      });
    });
    //     setAvailableTurns(turnsVariable);
  };
  const formattedTurns = availableTurns.map(({ turnTime }) =>
    turnTime.toFormat("HH:mm")
  );
  console.log(
    "franco available turns",
    JSON.stringify(availableTurns, null, 4)
  );
  return { loadingAvailableTurns, availableTurns, formattedTurns };
};
