import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { removeToken, removeUserId } from "../../helpers/asyncStorage";

interface Props extends StackScreenProps<any, any> {}

export const SettingsScreenPlayers = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={{ padding: 16, rowGap: 16 }}>
      <Text>Player settings</Text>
      <TouchableOpacity
        onPress={async () => {
          await removeToken();
          await removeUserId();
          navigation.replace("LoginScreen");
        }}
      >
        <Text>LogOut</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
