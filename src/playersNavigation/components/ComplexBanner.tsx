import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Complex } from "../../interfaces/complexes";
import { colors } from "../../theme/appTheme";
import { DateTime } from "luxon";

const weekdaysReference = ["L", "M", "M", "J", "V", "S", "D"];

interface BannerProps {
  complex: Complex;
}

export const ComplexBanner = ({ complex }: BannerProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <>
      <LinearGradient
        colors={["#000000cc", "#00000066", "#00000000"]}
        style={{
          ...styles.gradient,
          paddingTop: top + 20,
        }}
      >
        {complex?.ComplexSchedules?.map(
          ({ openingTime, closingTime, weekDays }, idx) => {
            return (
              <View style={styles.chipContainer} key={`schedule-${idx}`}>
                <View style={styles.weekdaysContainer}>
                  {weekDays?.map((day) => (
                    <Text>{weekdaysReference[day]}</Text>
                  ))}
                </View>
                <Text>
                  {DateTime.fromFormat(openingTime, "HH:mm:ss").toFormat(
                    "HH:mm"
                  )}{" "}
                  -{" "}
                  {DateTime.fromFormat(closingTime, "HH:mm:ss").toFormat(
                    "HH:mm"
                  )}
                </Text>
              </View>
            );
          }
        )}
      </LinearGradient>

      <Image
        source={{
          uri: "https://beneficios.lacapital.com.ar/media/cache/16/00/160057f1cc2bf346e91e1475fb3dc0af.jpg",
        }}
        style={styles.bannerImage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: 250,
    zIndex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexDirection: "row",
  },
  chipContainer: {
    backgroundColor: `${colors.cardBg}bb`,
    borderRadius: 8,
    padding: 4,
    paddingHorizontal: 8,
  },
  weekdaysContainer: { flexDirection: "row", justifyContent: "space-around" },
  bannerImage: { width: "100%", height: 250, zIndex: -1 },
});
