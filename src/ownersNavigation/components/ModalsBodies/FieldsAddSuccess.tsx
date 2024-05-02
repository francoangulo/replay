import React from "react";
import { StyleSheet, View } from "react-native";
import { TextComponent } from "../../../components/TextComponent";

export const FieldsAddSuccess = () => {
  return (
    <View style={styles.contentContainer}>
      <TextComponent
        type="subtitleLg"
        children={"Canchas agregadas con éxito"}
        customStyles={styles.textStyles}
      />
      <TextComponent type="title" children={"✅"} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    rowGap: 8,
  },
  textStyles: { textAlign: "center" },
});
