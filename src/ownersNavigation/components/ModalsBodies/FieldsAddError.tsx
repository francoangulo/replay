import React from "react";
import { StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";

export const FieldsAddError = () => {
  return (
    <View style={styles.contentContainer}>
      <TextComponent type="title" children={"❗️"} />
      <TextComponent type="subtitleLg" children={"Se produjo un error"} />
      <TextComponent
        type="text"
        children={"Si el problema persiste, contacta un administrador"}
      />
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
