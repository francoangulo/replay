import React from "react";
import { SafeAreaView, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useAppSelector } from "../../hooks/redux";
import { CalendarStackParamList } from "../navigators/CalendarNavigator";
import { selectOwnerComplexes } from "../../redux/slices/ownerComplexesSlice";
import { ComplexCard } from "../components/ComplexCard";

interface Props
  extends StackScreenProps<CalendarStackParamList, "CalendarComplexesScreen"> {}

const CalendarComplexesScreen = ({ navigation }: Props) => {
  const { ownerComplexes } = useAppSelector(selectOwnerComplexes);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        {ownerComplexes.map((complex, idx) => (
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
