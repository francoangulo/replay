import { StackScreenProps } from "@react-navigation/stack";
import React, { useCallback, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SearchStackParamList } from "../navigators/SearchNavigatorPlayers";
import QRCode from "react-native-qrcode-svg";
import { TextComponent } from "../../components/TextComponent";
import ViewShot from "react-native-view-shot";
import Share from "react-native-share";

interface Props
  extends StackScreenProps<SearchStackParamList, "BookedTurnScreen"> {}

export const BookedTurnScreen = ({ navigation, route }: Props) => {
  const turn = route.params?.turn;
  const screenshotRef = useRef(null);

  const onCapture = useCallback(async () => {
    if (!screenshotRef.current) return;
    const uri = await screenshotRef.current.capture();

    try {
      await Share.open({
        url: uri,
        //   ...(Platform.OS === "android" && {
        title: "Training App (MyStrengthBook)",
        message: "Look at my statistics in the Training App (MyStrengthbook)",
        //   }),
      });
    } catch (e) {
      console.log("e", e);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ViewShot
        ref={screenshotRef}
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: 16,
        }}
      >
        <View
          style={{
            padding: 32,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextComponent type="title" children="Turno reservado ✅" />
          <TextComponent
            type="text"
            children="Guarda este código QR para presentar a la hora de tu turno"
          />
        </View>
        <QRCode
          value={`replay://login/francoangulo2001@gmail.com/${turn._id}`}
          size={200}
        />
        <TouchableOpacity onPress={onCapture}>
          <Text>Compartir</Text>
        </TouchableOpacity>
      </ViewShot>
    </SafeAreaView>
  );
};
