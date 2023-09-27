import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { colors } from "../../theme/appTheme";
import { useAppDispatch } from "../../hooks/redux";
import { deleteComplex } from "../../redux/slices/complexesSlice";

type Props = StackScreenProps<ProfileStackParamList, "ComplexScreen">;

export const ComplexScreen = ({ route, navigation }: Props) => {
  const { complex } = route.params;
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 16,
        rowGap: 16,
        alignItems: "center",
      }}
    >
      <TextComponent type="title">{complex.name}</TextComponent>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <Text>{JSON.stringify(route.params, null, 4)}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.danger,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 5,
          }}
          onPress={() => dispatch(deleteComplex(complex._id, navigation.pop))}
        >
          <Text style={{ fontWeight: "bold", color: "white" }}>Remove</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
