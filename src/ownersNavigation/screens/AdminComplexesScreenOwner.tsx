import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { paddings } from "../../theme/appTheme";
import { useAppSelector } from "../../hooks/redux";
import { ScreenHeader } from "../components/ScreenHeader";
import { ComplexCard } from "../components/ComplexCard";
import { selectComplexes } from "../../redux/slices/complexesSlice";
import { GenericButton } from "../../components/GenericButton";

interface Props extends StackScreenProps<any, any> {}

export const AdminComplexesScreenOwner = ({ navigation, route }: Props) => {
  const { complexes } = useAppSelector(selectComplexes);

  return (
    <View style={styles.screenContainer}>
      <ScreenHeader
        title="Complejos deportivos"
        navigation={navigation}
        route={route}
      />
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContentStyle}
          style={styles.scrolLViewStyle}
        >
          {complexes?.map((complex, idx) => {
            return (
              <ComplexCard
                key={`complex-${idx}`}
                complex={complex}
                onPressCallback={() =>
                  navigation.navigate("ComplexScreen", {
                    complexId: complex._id,
                  })
                }
              />
            );
          })}
        </ScrollView>
        <GenericButton
          buttonText="Añadir Complejo"
          onButtonPress={() => navigation.navigate("AddComplexScreen")}
          buttonType="primary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  contentContainer: {
    padding: paddings.globalPadding,
    flex: 1,
    justifyContent: "space-between",
  },
  scrollViewContentStyle: {
    rowGap: 16,
    paddingBottom: 16,
    flexDirection: "row",
    gap: 8,
  },
  scrolLViewStyle: { rowGap: 16, paddingBottom: 16 },
});
