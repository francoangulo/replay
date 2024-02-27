import React, { useEffect, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { checkLocationPermission, onViewLocation } from "../../utils/utils";
import { colors } from "../../theme/appTheme";
import { PermissionStatus } from "react-native-permissions";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { Complex } from "../../interfaces/complexes";
import { StackScreenProps } from "@react-navigation/stack";
import { LocationPermissionModal } from "../components/MapScreen/LocationPermissionModal";
import { ComplexActions } from "../components/MapScreen/ComplexActions";
import { MENDOZA_COORDS } from "../../utils/constants";

interface Props extends StackScreenProps<any, any> {}

export const MapScreenPlayers = ({ navigation }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [selectedComplex, setSelectedComplex] = useState<Complex | undefined>();

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
        if (state !== "active") {
          return;
        }
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
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }, [locationPermission]);

  return (
    <View style={styles.screenContainer}>
      {locationPermissionAsked &&
      !["granted", "limited"].includes(locationPermission) ? (
        <LocationPermissionModal
          handleGrant={() =>
            checkLocationPermission({
              onGranted: (permissionStatus: PermissionStatus) =>
                setLocationPermission(permissionStatus),
              onDenied: (permissionStatus: PermissionStatus) => {
                setLocationPermissionAsked(true);
                setLocationPermission(permissionStatus);
              },
            })
          }
        />
      ) : null}
      <MapView
        style={styles.mapView}
        provider="google"
        showsUserLocation={true}
        mapPadding={{ bottom: 8, top: 8, left: 8, right: 8 }}
        showsMyLocationButton={true}
        loadingEnabled={true}
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
              key={_id}
              title={name}
              coordinate={{ latitude, longitude }}
              pinColor={colors.primary}
              onPress={() => {
                setSelectedComplex(complex);
              }}

              // * custom marker pin --> image={require("../../assets/logo.jpg")}
            >
              {/* // * custom marker component --> <TextComponent children={name} type="text" /> */}
            </Marker>
          );
        })}
      </MapView>
      {selectedComplex && (
        <ComplexActions
          onClose={() => {
            setSelectedComplex(undefined);
          }}
          onViewTurns={() => {
            navigation.navigate("SearchNavigator", {
              screen: "Search",
              params: { paramsComplex: selectedComplex },
            });
          }}
          onViewLocation={onViewLocation}
          selectedComplex={selectedComplex}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  mapView: { flex: 1, zIndex: 1 },
});
