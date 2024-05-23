import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import IonIcon from "react-native-vector-icons/Ionicons";
import { cardStyle } from "../../theme/appTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends StackScreenProps<any, any> {
  title: string;
  noBack?: boolean;
}

export const ScreenHeader = ({ navigation, title, noBack = false }: Props) => {
  const { top: insetsTop } = useSafeAreaInsets();
  return (
    <View
      style={[cardStyle, { paddingTop: insetsTop }, styles.headerContainer]}
    >
      {noBack ? null : (
        <TouchableOpacity onPress={() => navigation.pop()}>
          <IonIcon name="arrow-back" size={24} />
        </TouchableOpacity>
      )}
      <TextComponent type="title">{title}</TextComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    borderRadius: 0,
    gap: 8,
  },
});
