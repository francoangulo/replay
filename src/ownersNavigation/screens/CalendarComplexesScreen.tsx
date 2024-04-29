import React from "react";
import { SafeAreaView, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useAppSelector } from "../../hooks/redux";
import { CalendarStackParamList } from "../navigators/CalendarNavigator";
import { ComplexCard } from "../components/ComplexCard";
import { selectComplexes } from "../../redux/slices/complexesSlice";

interface Props
  extends StackScreenProps<CalendarStackParamList, "CalendarComplexesScreen"> {}

const CalendarComplexesScreen = ({ navigation }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
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
    </SafeAreaView>
  );
};

export default CalendarComplexesScreen;
