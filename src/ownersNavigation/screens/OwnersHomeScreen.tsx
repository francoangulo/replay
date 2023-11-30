import React from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";
import { DateTime } from "luxon";
import { cardStyle } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigators/HomeNavigator";

type Props = StackScreenProps<HomeStackParamList, "OwnersHomeScreen">;

export const OwnersHomeScreen = ({ route, navigation }: Props) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  const { ownerTurns } = useAppSelector(selectTurns);

  const pendingTurns = ownerTurns
    .filter(
      ({ confirmed, startDate }) =>
        confirmed === false &&
        DateTime.fromISO(startDate).toLocal().diffNow().milliseconds > 0
    )
    .sort((a, b) => {
      if (
        DateTime.fromISO(a.startDate).toMillis() <
        DateTime.fromISO(b.startDate).toMillis()
      ) {
        return -1;
      }
      if (
        DateTime.fromISO(b.startDate).toMillis() <
        DateTime.fromISO(a.startDate).toMillis()
      ) {
        return 1;
      }
      return 0;
    });

  const incomingTurns = ownerTurns.filter(({ startDate, confirmed }) => {
    return (
      DateTime.fromISO(startDate).toLocal().diffNow().milliseconds > 0 &&
      confirmed
    );
  });

  const inProgressTurns = ownerTurns.filter(({ startDate, endDate }) => {
    return (
      DateTime.fromISO(startDate).toLocal().diffNow().milliseconds < 0 &&
      DateTime.fromISO(endDate).toLocal().diffNow().milliseconds > 0
    );
  });
  if (turnIdParam) {
    return (
      <SafeAreaView>
        <Text>{turnIdParam}</Text>
        <Button
          title="Aceptar"
          onPress={() => navigation.setParams({ turnIdParam: undefined })}
        />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        <TextComponent type="title">Turnos a confirmar</TextComponent>
        <FlatList
          horizontal
          data={pendingTurns}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => {
            const { startDate, endDate } = item;
            const startDateTime = DateTime.fromISO(startDate).setLocale("es");
            const endDateTime = DateTime.fromISO(endDate).setLocale("es");
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TurnScreen", { turn: item })
                }
                style={cardStyle}
              >
                <Text
                  style={{ textTransform: "capitalize", fontWeight: "700" }}
                >
                  {startDateTime.toLocal().diffNow().days > 2
                    ? " "
                    : startDateTime.setLocale("es").toRelativeCalendar({
                        locale: "es",
                      })}
                </Text>
                <Text>
                  {startDateTime.toFormat("HH:mm")} -{" "}
                  {endDateTime.toFormat("HH:mm")}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <TextComponent type="title">Próximos turnos</TextComponent>
        <FlatList
          horizontal
          data={incomingTurns}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item: { startDate, endDate } }) => {
            const startDateTime = DateTime.fromISO(startDate).setLocale("es");
            const endDateTime = DateTime.fromISO(endDate).setLocale("es");
            return (
              <View style={cardStyle}>
                <Text
                  style={{ textTransform: "capitalize", fontWeight: "700" }}
                >
                  {startDateTime.toLocal().diffNow().days > 2
                    ? " "
                    : startDateTime.setLocale("es").toRelativeCalendar({
                        locale: "es",
                      })}
                </Text>
                <Text>
                  {startDateTime.toFormat("HH:mm")} -{" "}
                  {endDateTime.toFormat("HH:mm")}
                </Text>
              </View>
            );
          }}
        />

        <TextComponent type="title">Turnos en curso</TextComponent>
        {inProgressTurns && inProgressTurns.length
          ? inProgressTurns.map(({ startDate, endDate }, idx) => {
              const startDateTime = DateTime.fromISO(startDate);
              const endDateTime = DateTime.fromISO(endDate);

              return (
                <View key={`incoming-turn-${idx}`} style={cardStyle}>
                  <Text
                    style={{ textTransform: "capitalize", fontWeight: "700" }}
                  >
                    {startDateTime.toRelativeCalendar()} -{" "}
                    <Text style={{ color: "gray", fontWeight: "300" }}>
                      ({startDateTime.toFormat("d LLL")})
                    </Text>
                  </Text>
                  <Text>
                    {startDateTime.toFormat("HH:mm")} -{" "}
                    {endDateTime.toFormat("HH:mm")}
                  </Text>
                </View>
              );
            })
          : null}
      </View>
    </SafeAreaView>
  );
};
