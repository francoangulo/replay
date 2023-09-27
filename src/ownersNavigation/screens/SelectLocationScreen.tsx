import React, { useEffect, useState } from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { colors } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";

interface Props
  extends StackScreenProps<ProfileStackParamList, "SelectLocationScreen"> {}

export const SelectLocationScreen = ({ navigation, route }: Props) => {
  const [complexCoordinate, setComplexCoordinate] = useState<LatLng>();
  useEffect(() => {
    if (route.params?.complexCoordinate)
      setComplexCoordinate(route.params?.complexCoordinate);
  }, []);

  const openWithApp = () => {
    if (!complexCoordinate) return;
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      // ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${complexCoordinate.latitude},${complexCoordinate.longitude}`;
    const label = "Custom Label";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  };
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: complexCoordinate
            ? complexCoordinate.latitude
            : -32.90184575718629, // ! TODO: REPLACE WITH USER LOCATION
          longitude: complexCoordinate
            ? complexCoordinate.longitude
            : -68.80538728131646, // ! TODO: REPLACE WITH USER LOCATION
          latitudeDelta: 0.0922,
          longitudeDelta: 0.06,
        }}
        provider={PROVIDER_GOOGLE}
        onPress={({ nativeEvent: { coordinate } }) =>
          setComplexCoordinate(coordinate)
        }
      >
        {complexCoordinate ? (
          <Marker
            coordinate={{
              latitude: complexCoordinate?.latitude,
              longitude: complexCoordinate?.longitude,
            }}
            pinColor="red"
            title="marcador"
          />
        ) : null}
      </MapView>
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          position: "absolute",
          bottom: 0,
          columnGap: 32,
          padding: 16,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 0.75,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.appBg,
          }}
          onPress={() => navigation.pop()}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: colors.danger,
            }}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1.25,
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("AddComplexScreen", {
              complexCoordinate,
            });
            //     openWithApp
          }}
        >
          <Text style={{ fontWeight: "bold", color: colors.appBg }}>
            Confirmar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
