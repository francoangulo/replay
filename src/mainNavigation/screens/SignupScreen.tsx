import CheckBox from "@react-native-community/checkbox";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useAppDispatch } from "../../hooks/redux";
import { registerPlayer } from "../../redux/slices/authSlice";

const SignupScreen = ({ navigation }) => {
  const [password, setPassword] = useState("franco2001");
  const [name, setName] = useState("Franco");
  const [lastName, setLastName] = useState("Angulo");
  const [phoneNumber, setPhoneNumber] = useState("2612536251");
  const [isOwner, setIsOwner] = useState(false);
  const [email, setEmail] = useState(
    isOwner ? "francoowner@gmail.com" : "francoplayer@gmail.com"
  );
  const dispatch = useAppDispatch();

  const handleSignup = () => {
    // handle signup logic here
    if (isOwner) {
    } else {
      dispatch(
        registerPlayer(name, lastName, phoneNumber, email, password, () =>
          navigation.pop()
        )
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isOwner}
          onValueChange={setIsOwner}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Owner</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#4BB543",
  },
  input: {
    width: "80%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4BB543",
    borderRadius: 4,
    padding: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});

export default SignupScreen;
