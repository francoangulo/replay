import React from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";
import { DateTime } from "luxon";
import { cardStyle } from "../../theme/appTheme";

export const OwnersHomeScreen = ({ route, navigation }) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  console.log("franco param on home", JSON.stringify(turnIdParam, null, 4));
  const { ownerTurns } = useAppSelector(selectTurns);
  const incomingTurns = ownerTurns.filter(({ startDate }) => {
    return DateTime.fromISO(startDate).diffNow().milliseconds > 0;
  });
  if (turnIdParam)
    return (
      <SafeAreaView>
        <Text>{turnIdParam}</Text>
        <Button
          title="Aceptar"
          onPress={() => navigation.setParams({ turnIdParam: false })}
        />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={{ padding: 16 }}>
      <View style={{ gap: 8 }}>
        {ownerTurns && ownerTurns.length
          ? ownerTurns.map(({ startDate, endDate }, idx) => {
              const startDateTime = DateTime.fromISO(startDate, {
                zone: "UTC",
              });
              const endDateTime = DateTime.fromISO(endDate, {
                zone: "UTC",
              });

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
