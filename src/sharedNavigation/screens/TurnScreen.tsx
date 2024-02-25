import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useRef, useState } from "react";
import { HomeStackParamList } from "../../ownersNavigation/navigators/HomeNavigator";
import {
  SafeAreaView,
  View,
  Platform,
  Vibration,
  StyleSheet,
} from "react-native";
import { Turn } from "../../interfaces/Turns";
import { TextComponent } from "../../components/TextComponent";
import { DateTime } from "luxon";
import { colors, cardStyle } from "../../theme/appTheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { confirmTurn } from "../../redux/slices/turnsSlice";
import { selectAuth } from "../../redux/slices/authSlice";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import QRCode from "react-native-qrcode-svg";
import { CommonActions } from "@react-navigation/native";
import { selectOwnerComplexes } from "../../redux/slices/ownerComplexesSlice";
import { ViewLocationButton } from "../components/ViewLocationButton";
import { ConfirmTurnButton } from "../components/ConfirmTurnButton";
import { TurnCardRow } from "../components/TurnCardRow";
import { ShareButton } from "../components/ShareButton";
import { FadeModal } from "../../ownersNavigation/components/FadeModal";
import { FadeModalState } from "../../interfaces/FadeModal";
import { ConfirmedTurnModalContent } from "../components/ConfirmedTurnModalContent";

type Props = StackScreenProps<HomeStackParamList, "TurnScreen">;

export const TurnScreen = ({ navigation, route }: Props) => {
  const turn: Turn = route?.params?.turn ?? false;
  const user = useAppSelector(selectAuth);
  const { ownerComplexes } = useAppSelector(selectOwnerComplexes);
  const complex = ownerComplexes.find(
    (ownerComplex) => ownerComplex._id === turn.complexId
  );
  const userType = user?.userType;
  const dispatch = useAppDispatch();
  const screenshotRef = useRef<ViewShot>(null);
  const [fadeModalState, setFadeModalState] = useState<FadeModalState>({
    visible: false,
    autoDismiss: false,
    status: "success",
  });

  const onTurnConfirm = () => {
    dispatch(
      confirmTurn({ turnId: turn._id }, () => {
        Vibration.vibrate();
        setFadeModalState({ ...fadeModalState, visible: true });
      })
    );
  };

  const onCapture = useCallback(async () => {
    // we use a timeout to avoid the button from being transparent in the screenshot
    setTimeout(async () => {
      if (!screenshotRef?.current) {
        return;
      }
      const uri = screenshotRef?.current?.capture?.();

      try {
        if (!uri) {
          await Share.open({
            url: uri,
            ...(Platform.OS === "android" && {
              title: "RePlay - Reserve&Play",
              message: "Mira los detalles de mi turno escaneando el código QR",
            }),
          });
        } else {
          throw new Error("Ocurrió un problema al compartir el turno");
        }
      } catch (e) {
        console.error("e", e);
      }
    }, 500);
  }, []);

  const onModalAccept = () => {
    setFadeModalState({ ...fadeModalState, visible: false });
    const navigationState = navigation.getState();
    const prevRouteName =
      navigationState?.routes[navigationState?.routes?.length - 2]?.name;

    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          prevRouteName === "OwnersHomeScreen"
            ? {
                name: "OwnersHomeScreen",
                params: { complex },
              }
            : {
                name: "CalendarScreen",
                params: { complex },
              },
          {
            name: "TurnScreen",
            params: { turn: { ...turn, confirmed: true } },
          },
        ],
      })
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ViewShot
        ref={screenshotRef}
        style={styles.viewShot}
        options={{ format: "jpg", fileName: `turn-confirmation-${turn._id}` }}
      >
        <FadeModal
          modalState={fadeModalState}
          setModalState={setFadeModalState}
          modalContent={() => (
            <ConfirmedTurnModalContent onModalAccept={onModalAccept} />
          )}
        />
        <TextComponent type="title">Detalles del turno</TextComponent>
        <View style={styles.contentContainer}>
          <View style={styles.turnCard}>
            <TurnCardRow title={"Complejo"} value={complex?.name!} />
            <TurnCardRow title={"Dirección"} value={complex?.address!} />
            <TurnCardRow
              title={"Fecha"}
              value={DateTime.fromISO(turn.startDate).toFormat("dd-MM-yyyy")}
            />
            <TurnCardRow
              title={"Desde"}
              value={DateTime.fromISO(turn.startDate).toFormat("HH:mm")}
            />
            <TurnCardRow
              title={"Hasta"}
              value={DateTime.fromISO(turn.endDate).toFormat("HH:mm")}
            />
            <TurnCardRow title={"Cancha"} value={String(turn.fieldNumber)} />
            <TurnCardRow
              title={"Estado"}
              value={turn.confirmed ? "Confirmado" : "No confirmado"}
              valueTextStyles={{
                ...styles.confirmedTextStyle,
                color: turn.confirmed ? colors.primary : colors.danger,
              }}
            />
            {userType === "player" ? (
              <ViewLocationButton turn={turn} complex={complex!} />
            ) : !turn.confirmed ? (
              <ConfirmTurnButton onTurnConfirm={onTurnConfirm} />
            ) : null}
          </View>
          <View style={styles.qrContainer}>
            <View
              style={{
                ...styles.qrStatusBackground,
                backgroundColor: turn.confirmed
                  ? colors.primaryThree
                  : `#FAEEEF`,
              }}
            >
              <QRCode
                value={`replay://login/francoangulo2001@gmail.com/${turn._id}`}
                size={170}
              />
            </View>
          </View>
        </View>
        <ShareButton onCapture={onCapture} />
      </ViewShot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  viewShot: { flex: 1, padding: 16 },
  turnCard: {
    width: "100%",
    ...(cardStyle as Object),
    gap: 8,
    marginTop: 16,
  },
  confirmedTextStyle: { fontWeight: "bold" },
  qrContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  qrStatusBackground: { padding: 48, borderRadius: 1000 },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 32,
  },
});
