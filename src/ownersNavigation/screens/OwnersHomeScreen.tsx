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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
import { colors } from "../../theme/appTheme";
import LinearGradient from "react-native-linear-gradient";

type Props = StackScreenProps<HomeStackParamList, "OwnersHomeScreen">;

export const OwnersHomeScreen = ({ route, navigation }: Props) => {
  const turnIdParam = route.params?.turnIdParam ?? "";
  const { ownerTurns } = useAppSelector(selectTurns);
  const { _id, name } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const { top } = useSafeAreaInsets();
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
    <View style={styles.safeArea}>
      <LinearGradient
        colors={[
          colors.primaryOne,
          colors.primaryOne,
          colors.primaryThree,
          colors.appBg,
        ]}
        style={{ flex: 1 }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: `${colors.primaryOne}dd`,
            paddingTop: top + 8,
            zIndex: 1,
            height: 20,
            position: "absolute",
            top: 0,
          }}
        />
        <ScrollView
          contentContainerStyle={styles.screenContainer}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
        >
          <View
            style={{
              width: "100%",
              flexShrink: 0,
              backgroundColor: `${colors.primaryOne}`,
              paddingBottom: 16,
              padding: 16,
              paddingTop: top + 8,
              justifyContent: "flex-end",
            }}
          >
            <TextComponent
              type="title"
              children={`Bienvenido, ${name}!`}
              customStyles={{ fontWeight: "500", fontSize: 24 }}
            />
            <TextComponent
              type="title"
              children={`Revisa tus últimas novedades`}
              customStyles={{ fontWeight: "500", fontSize: 24 }}
            />
          </View>
          <View style={styles.contentContainer}>
            {pendingTurns?.length ? (
              <View>
                <TextComponent
                  customStyles={{ paddingHorizontal: 16 }}
                  type="title"
                >
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
            ) : null}
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
            {inProgressTurns?.length ? (
              <View style={{ gap: 8 }}>
                <TextComponent
                  customStyles={{ paddingHorizontal: 16 }}
                  type="title"
                >
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
            ) : null}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  listStyle: { paddingHorizontal: 16, paddingBottom: 16 },
  screenContainer: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 8,
    backgroundColor: colors.primaryOne,
  },
  safeArea: { flex: 1 },
  contentContainer: {
    gap: 8,
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
    zIndex: 2,
    flex: 1,
    backgroundColor: colors.appBg,
    paddingTop: 24,
    padding: 8,
  },
});
