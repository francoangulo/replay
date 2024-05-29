import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";

interface Props {
  title: string;
  value: string;
  valueTextStyles?: StyleProp<TextStyle>;
}

export const TurnCardRow = ({ title, value, valueTextStyles = {} }: Props) => {
  return (
    <View style={styles.rowContainer}>
      <TextComponent type="text" customStyles={styles.rowTitle}>
        {title}:{" "}
      </TextComponent>
      <TextComponent type="text">{value}</TextComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: { flexDirection: "row", justifyContent: "space-between" },
  rowTitle: { fontWeight: "bold" },
});
