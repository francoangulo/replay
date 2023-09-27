import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { cardStyle, colors } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import { selectAuth } from "../../redux/slices/authSlice";
import ADIcon from "react-native-vector-icons/AntDesign";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextComponent } from "../../components/TextComponent";
interface Props extends StackScreenProps<any, any> {}
export const ProfileScreenOwners = ({ navigation }: Props) => {
  const { name, lastName } = useAppSelector(selectAuth);
  const { top: insetsTop } = useSafeAreaInsets();

  return (
    <View style={{ rowGap: 16, flex: 1 }}>
      <View
        style={{
          ...cardStyle,
          paddingTop: insetsTop,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          paddingBottom: 24,
        }}
      >
        <View style={cardStyle}>
          <ADIcon name="user" size={32} />
        </View>
        <TextComponent type="title">{`${name} ${lastName}`}</TextComponent>
      </View>
      <View style={{ padding: 16, flex: 1, justifyContent: "space-between" }}>
        <TouchableOpacity
          style={{
            ...cardStyle,
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("AdminComplexesScreen")}
        >
          <TextComponent type="subtitle">Administrar Complejos</TextComponent>
          <MCIcon name="chevron-right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: colors.danger,
            paddingHorizontal: 16,
            paddingVertical: 12,
            alignItems: "center",
            borderRadius: 4,
          }}
          onPress={() => navigation.replace("LoginScreen")}
        >
          <Text style={{ color: colors.appBg, fontWeight: "bold" }}>
            LogOut
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
