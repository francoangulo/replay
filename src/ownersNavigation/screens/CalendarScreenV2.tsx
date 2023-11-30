import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import {
  CalendarProvider,
  CalendarUtils,
  ExpandableCalendar,
  Timeline,
  TimelineEventProps,
} from "react-native-calendars";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";
import { DateTime } from "luxon";

export interface Event {
  id?: string;
  start: string;
  end: string;
  title: string;
  summary?: string;
  color?: string;
}

const today = new Date();
export const getDate = (offset = 0) =>
  CalendarUtils.getCalendarDateString(
    new Date().setDate(today.getDate() + offset)
  );

console.log("franco date", JSON.stringify(getDate(), null, 4));

const CalendarScreenV2 = () => {
  const { ownerTurns } = useAppSelector(selectTurns);
  console.log("franco owner turns", JSON.stringify(ownerTurns, null, 4));
  const [formattedTurns, setFormattedTurns] = useState<Event[]>([]);

  const formatTurns = () => {
    const formattedTurnsTemp = ownerTurns.map((turn) => {
      const date = DateTime.fromISO(turn.startDate).toFormat(
        "yyyy-MM-dd HH:mm:ss"
      );
      return { start: turn.startDate, end: turn.endDate, title: "Turno" };
    });
    console.log(
      "franco formatted result",
      JSON.stringify(formattedTurnsTemp, null, 4)
    );

    setFormattedTurns(formattedTurnsTemp);
  };

  useEffect(() => {
    formatTurns();
  }, []);

  const events = {
    "2023-10-23": {
      startDate: "2023-10-23T08:00:00.000Z",
      endDate: "2023-10-23T10:00:00.000Z",
      title: "Meeting with John",
    },
    "2023-10-24": {
      startDate: "2023-10-24T11:00:00.000Z",
      endDate: "2023-10-24T12:00:00.000Z",
      title: "Lunch with Mary",
    },
    "2023-10-25": {
      startDate: "2023-10-25T13:00:00.000Z",
      endDate: "2023-10-25T14:00:00.000Z",
      title: "Presentation to team",
    },
  };

  const timelineEvents: TimelineEventProps[] = [
    {
      start: `${getDate(-1)} 09:20:00`,
      end: `${getDate(-1)} 12:00:00`,
      title: "Merge Request to React Native Calendars",
      summary: "Merge Timeline Calendar to React Native Calendars",
    },
    {
      start: `${getDate()} 01:15:00`,
      end: `${getDate()} 02:30:00`,
      title: "Meeting A",
      summary: "Summary for meeting A",
    },
    {
      start: `${getDate()} 01:30:00`,
      end: `${getDate()} 02:30:00`,
      title: "Meeting B",
      summary: "Summary for meeting B",
    },
    {
      start: `${getDate()} 01:45:00`,
      end: `${getDate()} 02:45:00`,
      title: "Meeting C",
      summary: "Summary for meeting C",
    },
    {
      start: `${getDate()} 02:40:00`,
      end: `${getDate()} 03:10:00`,
      title: "Meeting D",
      summary: "Summary for meeting D",
    },
    {
      start: `${getDate()} 02:50:00`,
      end: `${getDate()} 03:20:00`,
      title: "Meeting E",
      summary: "Summary for meeting E",
    },
    {
      start: `${getDate()} 04:30:00`,
      end: `${getDate()} 05:30:00`,
      title: "Meeting F",
      summary: "Summary for meeting F",
    },
    {
      start: `${getDate(1)} 00:30:00`,
      end: `${getDate(1)} 01:30:00`,
      title: "Visit Grand Mother",
      summary: "Visit Grand Mother and bring some fruits.",
      color: "lightblue",
    },
    {
      start: `${getDate(1)} 02:30:00`,
      end: `${getDate(1)} 03:20:00`,
      title: "Meeting with Prof. Behjet Zuhaira",
      summary: "Meeting with Prof. Behjet at 130 in her office.",
    },
    {
      start: `${getDate(1)} 04:10:00`,
      end: `${getDate(1)} 04:40:00`,
      title: "Tea Time with Dr. Hasan",
      summary: "Tea Time with Dr. Hasan, Talk about Project",
    },
    {
      start: `${getDate(1)} 01:05:00`,
      end: `${getDate(1)} 01:35:00`,
      title: "Dr. Mariana Joseph",
      summary: "3412 Piedmont Rd NE, GA 3032",
    },
    {
      start: `${getDate(1)} 14:30:00`,
      end: `${getDate(1)} 16:30:00`,
      title: "Meeting Some Friends in ARMED",
      summary: "Arsalan, Hasnaat, Talha, Waleed, Bilal",
      color: "pink",
    },
    {
      start: `${getDate(2)} 01:40:00`,
      end: `${getDate(2)} 02:25:00`,
      title: "Meet Sir Khurram Iqbal",
      summary: "Computer Science Dept. Comsats Islamabad",
      color: "orange",
    },
    {
      start: `${getDate(2)} 04:10:00`,
      end: `${getDate(2)} 04:40:00`,
      title: "Tea Time with Colleagues",
      summary: "WeRplay",
    },
    {
      start: `${getDate(2)} 00:45:00`,
      end: `${getDate(2)} 01:45:00`,
      title: "Lets Play Apex Legends",
      summary: "with Boys at Work",
    },
    {
      start: `${getDate(2)} 11:30:00`,
      end: `${getDate(2)} 12:30:00`,
      title: "Dr. Mariana Joseph",
      summary: "3412 Piedmont Rd NE, GA 3032",
    },
    {
      start: `${getDate(4)} 12:10:00`,
      end: `${getDate(4)} 13:45:00`,
      title: "Merge Request to React Native Calendars",
      summary: "Merge Timeline Calendar to React Native Calendars",
    },
  ];

  const renderItem = ({ event: turn }: { event: Event }) => {
    // Render each turn as a list item
    if (turn.length === 0) return <View />;
    return (
      <View>
        <Text>Turno</Text>
        <Text>{DateTime.fromISO(turn.start).toFormat("HH:mm")}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CalendarProvider
        date={DateTime.now().toFormat("yyyy-MM-dd")}
        //     style={{ backgroundColor: "red" }}
        theme={{
          backgroundColor: "#040404",
          selectedDayBackgroundColor: "#000",
          arrowWidth: 90,
          monthTextColor: "green",
          todayButtonFontSize: 40,
          agendaKnobColor: "red",
        }}
        style={{ flex: 1 }}
        //   onDateChanged={(date) => setSelectedDateString(date)}
      >
        <ExpandableCalendar />
        <Timeline
          events={timelineEvents}
          //   renderEvent={renderItem}
        />
      </CalendarProvider>
    </SafeAreaView>
  );
};

export default CalendarScreenV2;
