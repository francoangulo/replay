import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { cardStyle, colors, paddings } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";
import { useAppSelector } from "../../hooks/redux";
import { selectOwnerComplexes } from "../../redux/slices/ownerComplexesSlice";
import { ScreenHeader } from "../components/ScreenHeader";
import { ComplexCard } from "../components/ComplexCard";

interface Props extends StackScreenProps<any, any> {}

export const AdminComplexesScreenOwner = ({ navigation, route }: Props) => {
  const { ownerComplexes } = useAppSelector(selectOwnerComplexes);

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Complejos deportivos"
        navigation={navigation}
        route={route}
      />
      <View
        style={{
          padding: paddings.globalPadding,
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <ScrollView
          contentContainerStyle={{ rowGap: 16, paddingBottom: 16 }}
          style={{ rowGap: 16, paddingBottom: 16 }}
        >
          {ownerComplexes?.map((complex, idx) => {
            return (
              <ComplexCard
                key={`complex-${idx}`}
                complex={complex}
                onPressCallback={() =>
                  navigation.navigate("ComplexScreen", { complex })
                }
              />
            );
          })}
        </ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 4,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("AddComplexScreen")}
        >
          <Text style={{ color: colors.appBg, fontWeight: "bold" }}>
            Añadir Complejo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
