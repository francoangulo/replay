import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Complex } from "../../interfaces/complexes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps extends StackScreenProps<any, any> {
  complex: Complex;
}

export const Header = ({ navigation, route, complex }: HeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <IonIcon
          name="arrow-back"
          size={25}
          style={{ ...styles.backIcon, marginTop: top }}
          color={"#000000"}
        />
      </TouchableOpacity>
      <Text
        style={{
          ...styles.headerTitle,
          paddingTop: top,
        }}
      >
        {complex.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: { padding: 2 },
  headerTitle: { fontSize: 24, fontWeight: "bold", zIndex: 2 },
  headerContainer: {
    position: "absolute",
    zIndex: 2,
    flex: 1,
    width: "100%",
    backgroundColor: "#ffffffd4",
    gap: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    paddingBottom: 4,
  },
});
