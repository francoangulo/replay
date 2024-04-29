import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../../hooks/redux";
import { cardStyle } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import { selectAuth } from "../../redux/slices/authSlice";
import ADIcon from "react-native-vector-icons/AntDesign";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { TextComponent } from "../../components/TextComponent";
import { GenericButton } from "../../components/GenericButton";
interface Props extends StackScreenProps<any, any> {}
export const ProfileScreenOwners = ({ navigation }: Props) => {
  const { name, lastName } = useAppSelector(selectAuth);
  const { top: insetsTop } = useSafeAreaInsets();

  return (
    <View style={styles.screenContainer}>
      <View
        style={[cardStyle, { paddingTop: insetsTop }, styles.headerContainer]}
      >
        <View style={cardStyle}>
          <ADIcon name="user" size={32} />
        </View>
        <TextComponent type="title">{`${name} ${lastName}`}</TextComponent>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={[cardStyle, styles.adminComplexesButton]}
          onPress={() => navigation.navigate("AdminComplexesScreen")}
        >
          <TextComponent type="subtitle">Administrar Complejos</TextComponent>
          <MCIcon name="chevron-right" size={20} />
        </TouchableOpacity>

        <GenericButton
          buttonType="danger"
          buttonText="Cerrar sesión"
          onButtonPress={() => navigation.replace("LoginScreen")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    rowGap: 16,
    flex: 1,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingBottom: 24,
  },
  contentContainer: { padding: 16, flex: 1, justifyContent: "space-between" },
  adminComplexesButton: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
