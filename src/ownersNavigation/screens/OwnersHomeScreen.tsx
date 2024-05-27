import React, { useState } from "react";
import {
  Button,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getOwnerTurns, selectTurns } from "../../redux/slices/turnsSlice";
import { DateTime } from "luxon";
import { TextComponent } from "../../components/TextComponent";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigators/HomeNavigator";
import { selectAuth } from "../../redux/slices/authSlice";
import { InProgressTurn } from "../components/InProgressTurn";
import { PendingConfirmationTurn } from "../components/PendingConfirmationTurn";
import { IncomingTurn } from "../components/IncomingTurn";
import { useWebSockets } from "../../hooks/useWebSockets";

type Props = StackScreenProps<HomeStackParamList, "OwnersHomeScreen">;

export const OwnersHomeScreen = ({ route, navigation }: Props) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  const { ownerTurns } = useAppSelector(selectTurns);
  const { _id } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  useWebSockets();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(getOwnerTurns(_id));
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.screenContainer}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      >
        <View style={{ gap: 8 }}>
          <TextComponent customStyles={{ paddingHorizontal: 16 }} type="title">
            Turnos a confirmar
          </TextComponent>
          <FlatList
            style={styles.listStyle}
            horizontal
            data={pendingTurns}
            keyExtractor={(item, idx) => `${item._id}-${idx}`}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => {
              return (
                <PendingConfirmationTurn
                  turn={item}
                  onPress={() =>
                    navigation.navigate("TurnScreen", { turn: item })
                  }
                />
              );
            }}
          />
        </View>
        {incomingTurns?.length ? (
          <View style={{ gap: 8 }}>
            <TextComponent
              customStyles={{ paddingHorizontal: 16 }}
              type="title"
            >
              Próximos turnos
            </TextComponent>
            <FlatList
              style={styles.listStyle}
              horizontal
              data={incomingTurns}
              keyExtractor={(item) => item._id}
              ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
              renderItem={({ item }) => {
                return (
                  <IncomingTurn
                    turn={item}
                    onPress={() =>
                      navigation.navigate("TurnScreen", { turn: item })
                    }
                  />
                );
              }}
            />
          </View>
        ) : null}

        <View style={{ gap: 8 }}>
          <TextComponent customStyles={{ paddingHorizontal: 16 }} type="title">
            Turnos en curso
          </TextComponent>

          <FlatList
            horizontal
            data={inProgressTurns}
            keyExtractor={(item) => item._id}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
            renderItem={({ item }) => (
              <InProgressTurn
                turn={item}
                onPress={() =>
                  navigation.navigate("TurnScreen", { turn: item })
                }
              />
            )}
            style={styles.listStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listStyle: { paddingHorizontal: 16, paddingBottom: 16 },
  screenContainer: { flex: 1, justifyContent: "flex-start", gap: 8 },
});
