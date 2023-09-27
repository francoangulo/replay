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

interface Props extends StackScreenProps<any, any> {}

export const AdminComplexesScreenOwner = ({ navigation, route }: Props) => {
  const { ownerComplexes } = useAppSelector(selectOwnerComplexes);

  console.log("franco complejos", JSON.stringify(ownerComplexes, null, 4));

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
            const { name, address } = complex;
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate("ComplexScreen", { complex })
                }
                style={styles.complexCard}
                key={`complex-${idx}`}
              >
                <View style={{ rowGap: 8 }}>
                  <TextComponent type="subtitle">{name}</TextComponent>
                  <TextComponent type="text">{address}</TextComponent>
                </View>
                <View>
                  <Image
                    style={{ width: 100, height: 60, borderRadius: 4 }}
                    source={{
                      uri: "https://www.argfc.com/wp-content/uploads/2020/10/futbol555.jpg",
                    }}
                  />
                </View>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  complexCard: {
    ...(cardStyle as Object),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
