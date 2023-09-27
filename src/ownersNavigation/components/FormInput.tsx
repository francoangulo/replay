import React from "react";
import { Text, TextInput, View } from "react-native";
import { colors } from "../../theme/appTheme";

interface Props {
  label: string;
  error: string;
  defaultValue: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
}

export const FormInput = ({
  label,
  error,
  defaultValue,
  onChangeText,
  autoFocus = false,
}: Props) => {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: "500" }}>{label}</Text>
      <TextInput
        placeholder="Nombre"
        onChangeText={(value) => onChangeText(value)}
        defaultValue={defaultValue}
        style={{
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderColor: "#dddddd",
          borderRadius: 4,
          ...(!!error && {
            borderColor: colors.danger,
          }),
        }}
        autoCorrect={false}
        autoFocus={autoFocus}
      />
      <Text
        style={{
          fontWeight: "300",
          color: colors.danger,
          fontSize: 12,
        }}
      >
        {error}
      </Text>
    </View>
  );
};
