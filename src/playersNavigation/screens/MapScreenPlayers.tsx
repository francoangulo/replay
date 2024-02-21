import React, { useEffect, useState } from "react";
import { AppState, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { checkLocationPermission, onViewLocation } from "../../utils/utils";
import { cardStyle, colors } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";
import { PermissionStatus } from "react-native-permissions";
import { GenericButton } from "../../components/GenericButton";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import MapViewDirections from "react-native-maps-directions";
import { Complex } from "../../interfaces/complexes";
import IonIcon from "react-native-vector-icons/Ionicons";
import { StackScreenProps } from "@react-navigation/stack";

interface Coords {
  latitude: number;
  longitude: number;
}

const MENDOZA_COORDS = { latitude: -32.89084, longitude: -68.82717 };
interface Props extends StackScreenProps<any, any> {}

export const MapScreenPlayers = ({ navigation }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [directionOrigin, setDirectionOrigin] = useState<Coords | {}>({});
  const [directionDestination, setDirectionDestination] = useState<Coords | {}>(
    {}
  );
  const [selectedComplex, setSelectedComplex] = useState<Complex | undefined>();
  console.log(
    "franco selected Complex: ",
    JSON.stringify(selectedComplex, null, 4)
  );
  const destination = {
    latitude: complexes[0].latitude,
    longitude: complexes[0].longitude,
  };

  //   const origin = userLocation;
  //   const destination = {
  //     latitude: complexes[0].latitude,
  //     longitude: complexes[0].longitude,
  //   };
  const GOOGLE_MAPS_APIKEY = "AIzaSyBEyz6WdYmXu3PELuQFIY8NyG3iWHxol4g";

  const [locationPermission, setLocationPermission] = useState<
    PermissionStatus | "unset"
  >("unset");

  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);

  const ensureLocationPermission = async () => {
    await checkLocationPermission({
      onGranted: (permissionStatus: PermissionStatus) => {
        setLocationPermission(permissionStatus);
      },
      onDenied: (permissionStatus: PermissionStatus) => {
        setLocationPermissionAsked(true);
        setLocationPermission(permissionStatus);
      },
    });
  };

  useEffect(() => {
    ensureLocationPermission();
    const locationSubscription = AppState.addEventListener(
      "change",
      async (state) => {
        if (state !== "active") return;
        await checkLocationPermission({
          onGranted: (permissionStatus: PermissionStatus) => {
            setLocationPermission(permissionStatus);
          },
          onDenied: (permissionStatus: PermissionStatus) => {
            setLocationPermissionAsked(true);
            setLocationPermission(permissionStatus);
          },
        });
      }
    );

    return () => {
      locationSubscription.remove();
    };
  }, []);

  useEffect(() => {
    locationPermission &&
      Geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          console.log({ latitude, longitude });
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }, [locationPermission]);

  console.log(
    "franco permission status",
    JSON.stringify(locationPermission, null, 4)
  );

  return (
    <View style={{ flex: 1 }}>
      {locationPermissionAsked &&
      !["granted", "limited"].includes(locationPermission) ? (
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
                onButtonPress={() =>
                  checkLocationPermission({
                    onGranted: (permissionStatus: PermissionStatus) =>
                      setLocationPermission(permissionStatus),
                    onDenied: (permissionStatus: PermissionStatus) => {
                      setLocationPermissionAsked(true);
                      setLocationPermission(permissionStatus);
                    },
                  })
                }
                buttonType="primary"
              />
            </View>
          </View>
        </View>
      ) : null}
      <MapView
        style={{ flex: 1, zIndex: 1 }}
        provider="google"
        //   initialRegion={{
        //     latitude: -32.89084,
        //     longitude: -68.82717,
        //     latitudeDelta: 20,
        //     longitudeDelta: 20,
        //   }}
        //   region={{
        //     latitude: userLocation.latitude,
        //     longitude: userLocation.longitude,
        //     latitudeDelta: 0,
        //     longitudeDelta: 0,
        //   }}
        showsUserLocation={true}
        mapPadding={{ bottom: 8, top: 8, left: 8, right: 8 }}
        followsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        onMarkerDeselect={() => setSelectedComplex(undefined)}
        initialCamera={{
          zoom: 12,
          center: {
            latitude: userLocation?.latitude || MENDOZA_COORDS.latitude,
            longitude: userLocation?.longitude || MENDOZA_COORDS.longitude,
          },
          altitude: 2000,
          heading: 0,
          pitch: 0,
        }}
      >
        {complexes.map((complex) => {
          const { latitude, longitude, name, _id } = complex;
          return (
            <Marker
              onCalloutPress={() => setSelectedComplex(undefined)}
              key={_id}
              title={name}
              coordinate={{ latitude, longitude }}
              pinColor={colors.primary}
              onPress={() => {
                setSelectedComplex(complex);
                directionDestination?.latitude &&
                  setDirectionDestination({ latitude, longitude });
              }}

              // image={require("../../assets/logo.jpg")}
            >
              {/* <Text>{name}</Text> */}
            </Marker>
          );
        })}
        {Object.keys(directionOrigin).length > 0 &&
        Object.keys(directionDestination).length > 0 ? (
          <MapViewDirections
            origin={directionOrigin}
            destination={directionDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor={colors.primary}
          />
        ) : null}
      </MapView>
      {selectedComplex && (
        <View style={[cardStyle, { borderRadius: 0, gap: 12 }]}>
          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
              },
            ]}
          >
            <TextComponent children={selectedComplex.name} type="title" />
            <IonIcon
              name="close"
              color={colors.danger}
              size={24}
              onPress={() => {
                setSelectedComplex(undefined);
                setDirectionDestination({});
              }}
            />
          </View>
          <View
            style={{ flexDirection: "row", gap: 16, paddingHorizontal: 12 }}
          >
            <GenericButton
              buttonText="Ver turnos"
              buttonType="primary"
              onButtonPress={() => {
                navigation.navigate("ComplexScreen", {
                  selectedComplex,
                  availableTurns,
                  getAvailableTurns,
                  playersAmountsSelectors,
                  getPlayersAmountsSelectors,
                });
              }}
              customButtonStyle={{ flex: 1, marginTop: 0 }}
            />
            {/* <GenericButton
              buttonText="Ver ruta"
              buttonType="primary"
              onButtonPress={() => {
                setDirectionOrigin(userLocation);
                setDirectionDestination({
                  latitude: selectedComplex.latitude,
                  longitude: selectedComplex.longitude,
                });
              }}
              customButtonStyle={{ flex: 1, marginTop: 0 }}
            /> */}
            <GenericButton
              buttonText={
                Platform.OS === "android" ? "Ver en Maps" : "Ver en Mapas"
              }
              buttonType="secondary"
              onButtonPress={() => onViewLocation(selectedComplex)}
              customButtonStyle={{ flex: 1, marginTop: 0 }}
            />
          </View>
        </View>
      )}
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
