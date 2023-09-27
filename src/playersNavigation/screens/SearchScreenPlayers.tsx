import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
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
import { PERMISSIONS, PermissionStatus, check } from "react-native-permissions";

interface Props extends StackScreenProps<any, any> {}

export const SearchScreenPlayers = ({ navigation, route }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);
  const [filteredComplexes, setFilteredComplexes] =
    useState<Complex[]>(complexes);

  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      filterComplexes(filterValue);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [filterValue]);

  const filterComplexes = (value: string) => {
    const filteringComplexes = complexes.filter(({ name }) => {
      console.log({ name }, { value });

      return name.toLowerCase().includes(value.toLowerCase());
    });
    if (value.length === 0) return setFilteredComplexes(complexes);
    setFilteredComplexes(filteringComplexes);
  };

  const getNearComplexes = () => {
    checkLocationPermission();
  };

  const checkLocationPermission = async () => {
    let permissionStatus: PermissionStatus;
    if (Platform.OS === "ios") {
      permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else {
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
    console.log("permission", JSON.stringify(permissionStatus, null, 4));
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, gap: 16 }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            borderWidth: 1,
            borderRadius: 16,
            borderColor: "#dddddd",
            alignItems: "center",
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <IonIcon name="search-outline" size={20} />
          <TextInput
            style={{
              flex: 1,
            }}
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
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </SafeAreaView>
  );
};
