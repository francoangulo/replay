import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { StackScreenProps } from "@react-navigation/stack";
import { selectAuth } from "../../redux/slices/authSlice";
import { FlatList, StyleSheet, View } from "react-native";
import { selectTurns, getPlayerTurns } from "../../redux/slices/turnsSlice";
import { DateTime } from "luxon";
import { IncomingTurn } from "../../ownersNavigation/components/IncomingTurn";
import { TextComponent } from "../../components/TextComponent";

interface Props extends StackScreenProps<any, any> {}

export const HomeScreenPlayers = ({ navigation }: Props) => {
  const user = useAppSelector(selectAuth);
  const { playerTurns } = useAppSelector(selectTurns);
  const dispatch = useAppDispatch();
  const getAllPlayerTurns = async () => {
    dispatch(getPlayerTurns(user?._id));
  };
  const incomingTurns = playerTurns
    ?.filter(({ startDate }) => {
      return DateTime.fromISO(startDate).toLocal().diffNow().milliseconds > 0;
    })
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
  useEffect(() => {
    !playerTurns?.length && getAllPlayerTurns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ gap: 8 }}>
        <TextComponent customStyles={{ paddingHorizontal: 16 }} type="title">
          Mis próximos turnos
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
                forPlayer
                turn={item}
                onPress={() =>
                  navigation.navigate("TurnScreen", { turn: item })
                }
              />
            );
          }}
        />
      </View>
      {/* <View style={{ flex: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{ flex: 1, width: "100%", height: "20%" }}
        />
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listStyle: { paddingHorizontal: 16, paddingBottom: 16 },
});
