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
import { loginOwner, loginUser } from "../../redux/slices/authSlice";
import { useAppDispatch } from "../../hooks/redux";
import { StackActions } from "@react-navigation/native";
import Config from "react-native-config";
import { GenericButton } from "../../components/GenericButton";

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({ navigation, route }: Props) => {
  const emailParam = route.params?.email ?? "";
  const turnIdParam = route.params?.turnId ?? "";

  useEffect(() => {
    if (emailParam) {
      dispatch(loginOwner(emailParam));

      navigation.replace("OwnersNavigator", { turnIdParam });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useAppDispatch();

  const submitLogin = async () => {
    dispatch(
      loginUser({
        email,
        password,
        callback: (userType) => {
          const destinationRoute =
            userType && userType === "player"
              ? "PlayersNavigator"
              : "OwnersNavigator";
          navigation.dispatch(
            StackActions.replace(destinationRoute, { fromSplash: true })
          );
        },
      })
    );
  };

  const submitDevPlayer = async () => {
    dispatch(
      loginUser({
        email: "francoplayer@gmail.com",
        password: "franco2001",
        callback: (userType) => {
          const destinationRoute =
            userType && userType === "player"
              ? "PlayersNavigator"
              : "OwnersNavigator";
          navigation.dispatch(
            StackActions.replace(destinationRoute, { fromSplash: true })
          );
        },
      })
    );
  };

  const submitDevOwner = async () => {
    dispatch(
      loginUser({
        email: "francoowner@gmail.com",
        password: "franco2001",
        callback: (userType) => {
          const destinationRoute =
            userType && userType === "player"
              ? "PlayersNavigator"
              : "OwnersNavigator";
          navigation.dispatch(
            StackActions.replace(destinationRoute, { fromSplash: true })
          );
        },
      })
    );
  };

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: paddings.globalPadding,
        rowGap: 32,
      }}
    >
      {!["local", "localphy"].includes(Config.SELECTED_ENVIRONMENT) ? (
        <>
          <View
            style={{
              ...styles.card,
              backgroundColor: colors.cardBg,
              rowGap: 16,
            }}
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
              autoCorrect={false}
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
              <Text style={{ color: colors.appBg, fontWeight: "bold" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignupScreen");
            }}
          >
            <Text style={{ color: colors.primary }}>Signup</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View>
          <GenericButton
            buttonText="PLAYER"
            buttonType="secondary"
            onButtonPress={submitDevPlayer}
          />
          <GenericButton
            buttonText="OWNER"
            buttonType="primary"
            onButtonPress={submitDevOwner}
          />
        </View>
      )}
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
