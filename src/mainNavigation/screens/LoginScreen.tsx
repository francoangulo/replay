import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, paddings } from "../../theme/appTheme";
import {
  loginOwner,
  loginPlayer,
  selectAuth,
} from "../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import axios from "axios";
import { AllOwnersResponse } from "../../interfaces/Owners";
import { PlayersResponse } from "../../interfaces/Players";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({ navigation, route }: Props) => {
  const emailParam = route.params?.email ?? "";
  const turnIdParam = route.params?.turnId ?? "";
  console.log("franco email param:", JSON.stringify(emailParam, null, 4));
  const getUsers = async () => {
    const response1 = await axios.get<AllOwnersResponse>(
      "http://192.168.100.178:3000/owners"
    );
    const response2 = await axios.get<PlayersResponse>(
      "http://192.168.100.178:3000/players"
    );
    const users = {
      owners: response1.data.owners,
      players: response2.data.players,
    };
    console.log("users", JSON.stringify(users, null, 4));
  };
  useEffect(() => {
    if (emailParam) {
      dispatch(loginOwner(emailParam));

      navigation.replace("OwnersNavigator", { turnIdParam });
    }
    getUsers();
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ownerMode, setOwnerMode] = useState(false);
  const authState = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const submitLogin = async () => {
    console.log("DISPATCHING");
    console.log("owner mode: ", ownerMode);

    if (ownerMode) {
      dispatch(loginOwner("francoangulo2001@gmail.com"));
      navigation.replace("OwnersNavigator");
    } else {
      dispatch(
        loginPlayer(email, password, () =>
          navigation.replace("PlayersNavigator")
        )
      );
    }
  };
  useEffect(() => {
    console.log("authState", JSON.stringify(authState, null, 4));
  }, [authState]);

  const getToken = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    console.log("franco token", JSON.stringify(token, null, 4));
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: paddings.globalPadding,
        ...(ownerMode && { backgroundColor: colors.primary }),
        rowGap: 32,
      }}
    >
      <View
        style={{ ...styles.card, backgroundColor: colors.cardBg, rowGap: 16 }}
      >
        <Text>{email}</Text>
        <TextInput
          style={{
            width: "100%",
            height: 40,
            padding: 8,
            backgroundColor: colors.appBg,
            borderBottomColor: "black",
          }}
          defaultValue={email}
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Ingresa tu email..."
          autoCapitalize="none"
        />
        <TextInput
          style={{
            width: "100%",
            height: 40,
            padding: 8,
            backgroundColor: colors.appBg,
            borderBottomColor: "black",
          }}
          defaultValue={password}
          keyboardType="email-address"
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña..."
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => {
            submitLogin();
          }}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: colors.appBg, fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          setOwnerMode(!ownerMode);
          setEmail(ownerMode ? "francoangulo2001@gmail.com" : "");
        }}
      >
        <Text style={{ color: ownerMode ? colors.appBg : colors.primary }}>
          {ownerMode ? "Player?" : "Owner?"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignupScreen");
        }}
      >
        <Text style={{ color: ownerMode ? colors.appBg : colors.primary }}>
          Signup
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: "100%",
    elevation: 2,
    backgroundColor: "red",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
