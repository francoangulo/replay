import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import { Complex } from "../../interfaces/complexes";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useAvailableTurns } from "../../hooks/useAvailableTurns";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";

interface Props extends StackScreenProps<any, any> {
  complex: Complex;
}

export const ComplexCard = ({ navigation, complex }: Props) => {
  const { allTurns } = useAppSelector(selectTurns);
  const { availableTurns, loadingAvailableTurns } = useAvailableTurns({
    footballFields: complex.FootballFields,
    turns: allTurns,
  });
  const { name, address } = complex;
  if (loadingAvailableTurns) {
    return <ActivityIndicator size={50} color={colors.primary} />;
  }
  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => {
        console.log(
          "available turns my bro",
          JSON.stringify(availableTurns, null, 4)
        );
        navigation.navigate("ComplexScreen", { complex, availableTurns });
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ gap: 16 }}>
          <Text
            style={{
              textTransform: "capitalize",
              fontWeight: "700",
            }}
          >
            {name}
          </Text>
          <View style={{ gap: 4 }}>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <IonIcon
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <Text
                style={{
                  color: "gray",
                }}
              >
                {address}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
            >
              <IonIcon name="time-outline" size={20} color={colors.primary} />
              <Text
                style={{
                  color: "gray",
                }}
              >
                {availableTurns.length} turnos disponibles
              </Text>
            </View>
          </View>
        </View>

        <Image
          source={{
            uri: "https://beneficios.lacapital.com.ar/media/cache/16/00/160057f1cc2bf346e91e1475fb3dc0af.jpg",
          }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
        />
      </View>
    </TouchableOpacity>
  );
};
