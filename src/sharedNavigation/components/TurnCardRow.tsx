import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

interface Props {
  title: string;
  value: string;
  valueTextStyles?: StyleProp<TextStyle>;
}

export const TurnCardRow = ({ title, value, valueTextStyles = {} }: Props) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.rowTitle}>{title}: </Text>
      <Text style={valueTextStyles}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: { flexDirection: "row", justifyContent: "space-between" },
  rowTitle: { fontWeight: "bold" },
});
