import React, { useEffect, useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { GenericButton } from "../../components/GenericButton";
import { colors } from "../../theme/appTheme";
import MapView, { Circle, Marker } from "react-native-maps";
import { MENDOZA_COORDS } from "../../utils/constants";
import Geolocation from "react-native-geolocation-service";
import Slider from "@react-native-community/slider";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";

interface Props {
  onInputChange: (distance: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
}
export const DistanceModalContent = ({
  onInputChange,
  onCancel,
  onConfirm,
}: Props) => {
  const { complexes } = useAppSelector(selectComplexes);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [kmDistance, setKmDistance] = useState(2);

  useEffect(() => {
    onInputChange(kmDistance);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kmDistance]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const { height } = useWindowDimensions();

  return (
    <View style={styles.modalContainer}>
      <TextComponent type="title" children={"Indica la distancia"} />
      <MapView
        style={{ height: height / 2 }}
        provider="google"
        showsUserLocation={true}
        mapPadding={{ bottom: 8, top: 8, left: 8, right: 8 }}
        loadingEnabled={true}
        initialCamera={{
          zoom: 13,
          center: {
            latitude: userLocation?.latitude || MENDOZA_COORDS.latitude,
            longitude: userLocation?.longitude || MENDOZA_COORDS.longitude,
          },
          altitude: 1000,
          heading: 0,
          pitch: 0,
        }}
      >
        <Circle
          center={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          radius={kmDistance * 1000}
          strokeWidth={1}
          strokeColor={colors.primary}
          fillColor={`${colors.primaryOne}33`}
        />

        {complexes.map((complex) => {
          const { latitude, longitude, name, _id } = complex;
          return (
            <Marker
              key={_id}
              title={name}
              coordinate={{ latitude, longitude }}
              pinColor={colors.primary}

              // * custom marker pin --> image={require("../../assets/logo.jpg")}
            >
              {/* // * custom marker component --> <TextComponent children={name} type="text" /> */}
            </Marker>
          );
        })}
      </MapView>

      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        minimumTrackTintColor={`${colors.primaryOne}`}
        maximumTrackTintColor={colors.primaryThree}
        thumbTintColor={colors.primary}
        value={kmDistance}
        onValueChange={(value) => setKmDistance(value)}
      />

      <View style={styles.distanceLabels}>
        <TextComponent type="subtitle" children={"1km"} />
        <TextComponent type="subtitle" children={"10km"} />
      </View>

      <View style={styles.modalButtonsContainer}>
        <GenericButton
          buttonText="Cancelar"
          buttonType="secondary"
          onButtonPress={onCancel}
          customButtonStyle={styles.button}
        />
        <GenericButton
          buttonText="Aceptar"
          buttonType="primary"
          onButtonPress={onConfirm}
          customButtonStyle={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    justifyContent: "center",
    gap: 8,
  },
  slider: { width: "100%", height: 40, marginBottom: 0 },
  modalButtonsContainer: { flexDirection: "row", width: "100%", gap: 12 },
  button: { flex: 1 },
  distanceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: -10,
  },
});
