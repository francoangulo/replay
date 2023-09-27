import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { TextComponent } from "../../components/TextComponent";
import IonIcon from "react-native-vector-icons/Ionicons";
import { cardStyle } from "../../theme/appTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props extends StackScreenProps<any, any> {
  title: string;
}

export const ScreenHeader = ({ navigation, title }: Props) => {
  const { top: insetsTop } = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        ...cardStyle,
        borderRadius: 0,
        gap: 8,
        paddingTop: insetsTop,
      }}
    >
      <TouchableOpacity onPress={() => navigation.pop()}>
        <IonIcon name="arrow-back" size={24} />
      </TouchableOpacity>
      <TextComponent type="title">{title}</TextComponent>
    </View>
  );
};
