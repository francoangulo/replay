import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SearchStackParamList } from "../navigators/SearchNavigatorPlayers";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import { colors } from "../../theme/appTheme";
import IonIcon from "react-native-vector-icons/Ionicons";

interface Props
  extends StackScreenProps<SearchStackParamList, "BookedTurnScreen"> {}

export const BookedTurnScreen = ({ route }: Props) => {
  const turn = route.params?.turn;
  const screenshotRef = useRef(null);

  const onCapture = useCallback(async () => {
    if (!screenshotRef.current) return;
    setTimeout(async () => {
      const uri = await screenshotRef.current.capture();

      try {
        await Share.open({
          url: uri,
          //   ...(Platform.OS === "android" && {
          title: "RePlay - Reserve&Play",
          message: "Mira los detalles de mi turno escaneando el código QR",
          //   }),
        });
      } catch (e) {
        console.error("e", e);
      }
    }, 500);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ViewShot
        ref={screenshotRef}
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingBottom: 16,
          backgroundColor: colors.primaryThree,
        }}
        options={{ format: "jpg", fileName: `turn-confirmation-${turn._id}` }}
      >
        <View
          style={{
            width: "100%",
            height: 280,
            backgroundColor: colors.primary,
            position: "absolute",
            top: 0,
            borderBottomEndRadius: 340,
            borderBottomStartRadius: 340,
          }}
        />
        <SafeAreaView
          style={{
            // padding: 32,
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            paddingBottom: 200,
            width: "100%",
          }}
        >
          <View style={{ paddingTop: 15 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: colors.cardBg,
                fontSize: 30,
                textAlign: "center",
              }}
            >
              Turno reservado
            </Text>
            <Text
              style={{
                fontSize: 50,
                fontWeight: "bold",
                color: colors.cardBg,
                textAlign: "center",
              }}
            >
              ✓
            </Text>
            <Text
              style={{
                marginHorizontal: 40,
                textAlign: "center",
                opacity: 0.6,
                fontWeight: "bold",
                color: colors.cardBg,
              }}
            >
              ¡Su turno ha sido reservado con éxito! Guarda el siguiente código
              QR para presentarlo a la hora de tu turno
            </Text>
          </View>
          <QRCode
            value={`replay://login/francoangulo2001@gmail.com/${turn._id}`}
            size={200}
          />
          <TouchableOpacity
            style={{
              backgroundColor: `${colors.primary}ff`,
              padding: 16,
              borderRadius: 8,
              width: "70%",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              alignItems: "center",
            }}
            onPress={onCapture}
          >
            <Text
              style={{
                color: colors.appBg,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Compartir
            </Text>
            <IonIcon name="share-social" color={colors.cardBg} size={20} />
          </TouchableOpacity>
        </SafeAreaView>
      </ViewShot>
    </View>
  );
};
