import { DateTime } from "luxon";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
  console.log("available turns", JSON.stringify(availableTurns, null, 4));
  return (
    <View style={cardStyle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={cardTitleStyle}>Cancha {footballField.fieldNumber}</Text>
        {complex.ComplexSchedules.map(({ openingTime, closingTime }) => {
          return (
            <Text
              style={{
                color: "gray",
                borderRightWidth: 1,
                borderRightColor: "black",
                marginLeft: 12,
              }}
            >
              {DateTime.fromFormat(openingTime, "HH:mm:ss").toFormat("HH:mm")} -{" "}
              {DateTime.fromFormat(closingTime, "HH:mm:ss").toFormat("HH:mm")}
            </Text>
          );
        })}
      </View>
      <Text style={{ marginTop: 16 }}>Turnos disponibles</Text>
      <View
        style={{
          flexDirection: "row",
          columnGap: 4,
          rowGap: 8,
          marginTop: 8,
          flexWrap: "wrap",
        }}
      >
        {availableTurns && availableTurns.length
          ? availableTurns.map(({ turnTime, available }) => {
              if (available)
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
              else
                return <QRCode value={[{ data: "francoqr", mode: "byte" }]} />;
            })
          : null}
      </View>
    </View>
  );
};
