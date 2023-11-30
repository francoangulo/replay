import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { cardStyle } from "../../theme/appTheme";
import { Complex } from "../../interfaces/complexes";

interface Props {
  onPressCallback: () => void;
  complex: Complex;
}

export const ComplexCard = ({ onPressCallback, complex }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPressCallback}
      style={styles.complexCard}
    >
      <View style={{ rowGap: 8 }}>
        <TextComponent type="subtitle">{complex.name}</TextComponent>
        <TextComponent type="text">{complex.address}</TextComponent>
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
};

const styles = StyleSheet.create({
  complexCard: {
    ...(cardStyle as Object),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
