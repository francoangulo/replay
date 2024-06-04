import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { SearchStackParamList } from "../navigators/SearchNavigatorPlayers";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { colors } from "../../theme/appTheme";
import IonIcon from "react-native-vector-icons/Ionicons";
import { GenericButton } from "../components";
import { TextComponent } from "../../components/TextComponent";

interface Props
  extends StackScreenProps<SearchStackParamList, "BookedTurnScreen"> {}

export const BookedTurnScreen = ({ route }: Props) => {
  const turn = route.params?.turn;
  const screenshotRef = useRef<any>(null);

  const onCapture = useCallback(async () => {
    if (!screenshotRef.current) {
      return;
    } else {
      setTimeout(async () => {
        if (!screenshotRef.current) {
          return;
        }

        const uri = await screenshotRef.current.capture();

        try {
          await Share.open({
            url: uri,
            title: "RePlay - Reserve&Play",
            message: "Mira los detalles de mi turno escaneando el código QR",
          });
        } catch (e) {
          console.error("e", e);
        }
      }, 500);
    }
  }, []);

  return (
    <View style={styles.screenContainer}>
      <ViewShot
        ref={screenshotRef}
        style={styles.screenshotContainer}
        options={{ format: "jpg", fileName: `turn-confirmation-${turn._id}` }}
      >
        <View style={styles.coloredBackground} />
        <SafeAreaView style={styles.contentContainer}>
          <View style={styles.bookedHeaderContainer}>
            <TextComponent type="text" customStyles={styles.bookedTitle}>
              Turno reservado
            </TextComponent>
            <TextComponent type="text" customStyles={styles.checkIconText}>
              ✓
            </TextComponent>
            <TextComponent type="text" customStyles={styles.bookedDescription}>
              ¡Su turno ha sido reservado con éxito! Guarda el siguiente código
              QR para presentarlo a la hora de tu turno
            </TextComponent>
          </View>
          <QRCode
            value={`replay://login/francoangulo2001@gmail.com/${turn._id}`}
            size={200}
          />
          <View style={styles.shareButtonContainer}>
            <GenericButton
              buttonText="Compartir"
              buttonType="primary"
              rightIcon={
                <IonIcon name="share-social" color={colors.cardBg} size={20} />
              }
              onButtonPress={onCapture}
            />
          </View>
        </SafeAreaView>
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  shareButtonContainer: {
    padding: 16,
    width: "100%",
  },
  bookedDescription: {
    marginHorizontal: 40,
    textAlign: "center",
    opacity: 0.6,
    fontWeight: "bold",
    color: colors.cardBg,
  },
  checkIconText: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.cardBg,
    textAlign: "center",
  },
  bookedTitle: {
    fontWeight: "bold",
    color: colors.cardBg,
    fontSize: 30,
    textAlign: "center",
  },
  bookedHeaderContainer: { paddingTop: 15 },
  contentContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingBottom: 200,
    width: "100%",
  },
  coloredBackground: {
    width: "100%",
    height: 280,
    backgroundColor: colors.primary,
    position: "absolute",
    top: 0,
    borderBottomEndRadius: 340,
    borderBottomStartRadius: 340,
  },
  screenshotContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingBottom: 16,
    backgroundColor: colors.primaryThree,
  },
  screenContainer: { flex: 1 },
});
