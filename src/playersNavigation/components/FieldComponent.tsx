import { DateTime } from "luxon";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { cardStyle, cardTitleStyle, colors } from "../../theme/appTheme";
import { FootballField } from "../../interfaces/FootballFields";
import { AvailableTurn } from "../../hooks/useAvailableTurns";
import { Complex } from "../../interfaces/complexes";
import QRCode from "react-native-qrcode-svg";

interface Props {
  footballField: FootballField;
  availableTurns: AvailableTurn[];
  onTurnPress: (turnTime: DateTime) => void;
  complex: Complex;
}

export const FieldComponent = ({
  footballField,
  availableTurns,
  onTurnPress,
  complex,
}: Props) => {
  const onlyAvailableTurns = availableTurns.filter(
    ({ available }) => available
  );
  return (
    <View style={cardStyle}>
      <View
        style={{
          flexDirection: "row",
          columnGap: 4,
          rowGap: 8,
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        <FlatList
          horizontal
          data={onlyAvailableTurns}
          renderItem={({ item: { turnTime, available } }) => {
            return (
              <TouchableOpacity
                style={{ flexShrink: 0 }}
                onPress={() => onTurnPress(turnTime)}
              >
                <Text
                  style={{
                    color: colors.primary,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    borderRadius: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    minWidth: 60,
                    textAlign: "center",
                  }}
                >
                  {turnTime.toFormat("HH:mm")}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => `field${item.fieldId}-turn${index}`}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        />
      </View>
    </View>
  );
};
