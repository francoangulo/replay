import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/appTheme";
import IonIcon from "react-native-vector-icons/Ionicons";

interface Props {
  playersAmount: number;
  fieldsState: {
    five: {
      playersAmount: number;
      fieldsAmount: number;
    };
    seven: {
      playersAmount: number;
      fieldsAmount: number;
    };
    nine: {
      playersAmount: number;
      fieldsAmount: number;
    };
    eleven: {
      playersAmount: number;
      fieldsAmount: number;
    };
  };
  playersAmountString: "five" | "seven" | "nine" | "eleven";
  setFieldsState: React.Dispatch<
    React.SetStateAction<{
      five: {
        playersAmount: number;
        fieldsAmount: number;
      };
      seven: {
        playersAmount: number;
        fieldsAmount: number;
      };
      nine: {
        playersAmount: number;
        fieldsAmount: number;
      };
      eleven: {
        playersAmount: number;
        fieldsAmount: number;
      };
    }>
  >;
}

export const FieldsAmountSelector = ({
  playersAmount,
  fieldsState,
  playersAmountString,
  setFieldsState,
}: Props) => {
  return (
    <View style={{ gap: 8 }}>
      <View style={styles.fieldTypeContainer}>
        <Text style={{ opacity: 0.6 }}>Fútbol</Text>
        <Text style={{ fontWeight: "bold", fontSize: 15, opacity: 0.5 }}>
          {playersAmount}
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            borderRadius: 4,
            backgroundColor: colors.appBg,
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {fieldsState[playersAmountString].fieldsAmount}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        <TouchableOpacity
          activeOpacity={0.3}
          style={styles.actionButton}
          onPress={() =>
            setFieldsState({
              ...fieldsState,
              [playersAmountString]: {
                ...fieldsState[playersAmountString],
                fieldsAmount: fieldsState[playersAmountString].fieldsAmount + 1,
              },
            })
          }
        >
          <IonIcon name="add-outline" size={12} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.3}
          style={styles.actionButton}
          onPress={() =>
            fieldsState[playersAmountString].fieldsAmount > 0 &&
            setFieldsState({
              ...fieldsState,
              [playersAmountString]: {
                ...fieldsState[playersAmountString],
                fieldsAmount: fieldsState[playersAmountString].fieldsAmount - 1,
              },
            })
          }
        >
          <IonIcon name="remove-outline" size={12} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldTypeContainer: {
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryThree,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  actionButton: {
    backgroundColor: colors.inputBg,
    padding: 8,
    borderRadius: 8,
  },
});
