import React from "react";
import { StyleSheet, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useAppSelector } from "../../hooks/redux";
import { CalendarStackParamList } from "../navigators/CalendarNavigator";
import { ComplexCard } from "../components/ComplexCard";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { ScreenHeader } from "../components/ScreenHeader";

interface Props
  extends StackScreenProps<CalendarStackParamList, "CalendarComplexesScreen"> {}

const CalendarComplexesScreen = ({ navigation, route }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);

  return (
    <View style={styles.screenContainer}>
      <ScreenHeader
        title="Calendario de turnos"
        navigation={navigation}
        route={route}
        noBack
      />
      <View style={styles.contentContainer}>
        {complexes.map((complex, idx) => (
          <ComplexCard
            key={`complex-${idx}`}
            complex={complex}
            onPressCallback={() =>
              navigation.navigate("CalendarScreen", { complex })
            }
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  contentContainer: { padding: 16, flexDirection: "row", gap: 8 },
});

export default CalendarComplexesScreen;
