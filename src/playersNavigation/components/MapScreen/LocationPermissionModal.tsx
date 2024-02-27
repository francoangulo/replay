import React from "react";
import { StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";
import { cardStyle, colors } from "../../../theme/appTheme";
import { GenericButton } from "../../../components/GenericButton";

interface Props {
  handleGrant: () => void;
}

export const LocationPermissionModal = ({ handleGrant }: Props) => {
  return (
    <View style={styles.permissionsModalFade}>
      <View style={[cardStyle, { width: "70%", gap: 16 }]}>
        <TextComponent type="title" children={"Permisos requeridos"} />
        <TextComponent
          type="text"
          children={
            "Para acceder a la función de mapa, necesitamos acceso a tu ubicación."
          }
        />
        <TextComponent
          type="text"
          children={
            "Por favor, otorga los permisos necesarios en la configuración de tu dispositivo."
          }
        />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <GenericButton
            buttonText="Otorgar"
            customButtonStyle={{ flex: 1 }}
            onButtonPress={handleGrant}
            buttonType="primary"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionsModalFade: {
    zIndex: 2,
    position: "absolute",
    backgroundColor: colors.appFadeBg,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
