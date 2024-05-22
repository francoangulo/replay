import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../theme/appTheme";

interface Props {
  error: boolean;
  hour: string;
  minute: string;
  onPickerPress: () => void;
}

export const TimePickerLabel = ({
  hour,
  minute,
  error,
  onPickerPress,
}: Props) => {
  return (
    <TouchableOpacity style={styles.picker} onPress={onPickerPress}>
      <Text
        style={[
          styles.pickerNumber,
          { ...(error && { color: colors.danger }) },
        ]}
      >
        {hour[0]}
      </Text>
      <Text
        style={[
          styles.pickerNumber,
          { ...(error && { color: colors.danger }) },
        ]}
      >
        {hour[1]}
      </Text>
      <Text style={{ ...(error && { color: colors.danger }) }}>:</Text>
      <Text
        style={[
          styles.pickerNumber,
          { ...(error && { color: colors.danger }) },
        ]}
      >
        {minute[0]}
      </Text>
      <Text
        style={[
          styles.pickerNumber,
          { ...(error && { color: colors.danger }) },
        ]}
      >
        {minute[1]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  picker: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: colors.inputBg,
    padding: 4,
    borderRadius: 8,
  },
  pickerNumber: {
    backgroundColor: colors.appBg,
    padding: 2,
    fontSize: 20,
    borderRadius: 4,
  },
});
