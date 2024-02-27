import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppSelector } from "../../hooks/redux";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { ComplexCard } from "../components/ComplexCard";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Complex } from "../../interfaces/complexes";

import Geolocation from "react-native-geolocation-service";
import { checkLocationPermission, haversine } from "../../utils/utils";
import { FadeModalState } from "../../interfaces/FadeModal";
import { colors } from "../../theme/appTheme";
import { DistanceModal } from "../components/SearchScreen/DistanceModal";

interface Props extends StackScreenProps<any, any> {}

export const SearchScreenPlayers = ({ navigation, route }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);
  const [filteredComplexes, setFilteredComplexes] =
    useState<Complex[]>(complexes);

  const paramsComplex = route.params?.paramsComplex;

  const [filterValue, setFilterValue] = useState("");
  const [kilometersDistanceState, setKilometersDistanceState] = useState(5);

  const [distanceModalState, setDistanceModalState] = useState<FadeModalState>({
    visible: false,
    autoDismiss: false,
    status: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      filterComplexes(filterValue);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue]);

  const filterComplexes = (value: string) => {
    const filteringComplexes = complexes.filter(({ name }) => {
      return name.toLowerCase().includes(value.toLowerCase());
    });
    if (value.length === 0) {
      return setFilteredComplexes(complexes);
    }
    setFilteredComplexes(filteringComplexes);
  };

  const getNearComplexes = () => {
    checkLocationPermission({
      onGranted: () =>
        setDistanceModalState({ ...distanceModalState, visible: true }),
      onDenied: () => {},
    });
  };

  const filterByLocation = (kmDistance: number) => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const locationFilteredComplexes = complexes.filter((complex) => {
          const haversineDistance = haversine(
            latitude,
            longitude,
            complex.latitude,
            complex.longitude
          );
          console.log(
            "franco the haversine distance: ",
            JSON.stringify(haversineDistance, null, 4)
          );
          console.log(
            "franco the km distance: ",
            JSON.stringify(kmDistance, null, 4)
          );
          return haversineDistance <= kmDistance;
        });

        setFilteredComplexes(locationFilteredComplexes);
      },
      (error) => {
        // See error code charts below.
        console.error(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const onDistanceInputChange = (distance: number) => {
    setKilometersDistanceState(distance);
  };

  const onDistanceCancel = () => {
    setDistanceModalState({
      ...distanceModalState,
      visible: false,
    });
  };

  const onDistanceConfirm = () => {
    setDistanceModalState({
      ...distanceModalState,
      visible: false,
    });
    kilometersDistanceState && filterByLocation(kilometersDistanceState);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.screenContainer}>
        <DistanceModal
          distanceModalState={distanceModalState}
          setDistanceModalState={setDistanceModalState}
          onInputChange={onDistanceInputChange}
          onCancel={onDistanceCancel}
          onConfirm={onDistanceConfirm}
        />

        <View style={styles.searchBarContainer}>
          <IonIcon name="search-outline" size={20} />
          <TextInput
            style={styles.complexSearchInput}
            defaultValue=""
            onChangeText={(value) => setFilterValue(value)}
          />
          <TouchableOpacity onPress={() => getNearComplexes()}>
            <IonIcon name="location-outline" size={24} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredComplexes}
          keyExtractor={(item, idx) => `${item._id}-${idx}`}
          renderItem={({ item: complex }) => (
            <ComplexCard
              complex={complex}
              navigation={navigation}
              route={route}
              paramsComplex={paramsComplex}
            />
          )}
          // eslint-disable-next-line react/no-unstable-nested-components
          ItemSeparatorComponent={() => (
            <View style={styles.complexesSeparator} />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.inputBorder,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  complexSearchInput: { flex: 1 },
  screenContainer: { flex: 1, padding: 16, gap: 16 },
  safeAreaView: { flex: 1 },

  complexesSeparator: { height: 12 },
});
