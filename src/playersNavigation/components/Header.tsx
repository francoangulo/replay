import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";

interface HeaderProps extends StackScreenProps<any, any> {
  title: string;
}

export const Header = ({ navigation, title }: HeaderProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer]}>
      <TouchableOpacity onPress={() => navigation.pop()}>
        <IonIcon
          name="arrow-back"
          size={25}
          style={{ ...styles.backIcon, marginTop: top }}
          color={"#000000"}
        />
      </TouchableOpacity>
      <TextComponent
        type="title"
        customStyles={{
          paddingTop: top,
        }}
      >
        {title}
      </TextComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: { padding: 2 },
  headerContainer: {
    width: "100%",
    backgroundColor: colors.appBg,
    gap: 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    paddingBottom: 16,
  },
});
