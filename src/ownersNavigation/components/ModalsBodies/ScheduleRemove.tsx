import React from "react";
import { StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";

export const ScheduleRemove = () => {
  return (
    <View style={styles.contentContainer}>
      <TextComponent type="subtitleLg" children={"Eliminando horario..."} />
      <TextComponent type="title" children={"⏳"} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
  },
});
