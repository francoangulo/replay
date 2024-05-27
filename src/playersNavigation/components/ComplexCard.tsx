import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { StackScreenProps } from "@react-navigation/stack";
import { Complex } from "../../interfaces/complexes";
import IonIcon from "react-native-vector-icons/Ionicons";
import { useAvailableTurns } from "../../hooks/useAvailableTurns";
import { useAppSelector } from "../../hooks/redux";
import { selectTurns } from "../../redux/slices/turnsSlice";
import { TextComponent } from "../../components/TextComponent";
import { useComplexMainPicture } from "../../hooks/useComplexMainPicture";

interface Props extends StackScreenProps<any, any> {
  complex: Complex;
  paramsComplex?: Complex;
}

export const ComplexCard = ({ navigation, complex, paramsComplex }: Props) => {
  const { complexMainPicture } = useComplexMainPicture({
    complexId: complex._id,
    mainPictureKey: complex.mainPictureKey,
  });
  const [loadingImage, setLoadingImage] = useState(true);
  const { allTurns } = useAppSelector(selectTurns);
  const {
    availableTurns,
    loadingAvailableTurns,
    getAvailableTurns,
    playersAmountsSelectors,
    getPlayersAmountsSelectors,
  } = useAvailableTurns({
    complex,
    turns: allTurns,
  });
  const { name, address } = complex;

  // Following useEffect adds a listener for the screen focus. Each time the user pops this screen on top
  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      // If we receive a complex, it comes from MapScreen (ViewTurns action)
      if (paramsComplex) {
        // If this is the matching complex, we navigate to ComplexScreen
        if (paramsComplex._id === complex._id) {
          // First remove the param to avoid jumping to ComplexScreen
          // every time this screen is focused
          navigation.setParams({ paramsComplex: null });

          // Then jump into the ComplexScreen
          navigation.navigate("ComplexScreen", {
            complex,
            availableTurns,
            getAvailableTurns,
            playersAmountsSelectors,
            getPlayersAmountsSelectors,
          });
        }
      }
    });

    // Make sure to remove the event listener when screen unmounts
    return () => {
      focusListener();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAvailableTurns(complex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTurns]);

  if (loadingAvailableTurns) {
    return <ActivityIndicator size={50} color={colors.primary} />;
  }
  const turnsAmount = availableTurns.reduce((acc, { available }) => {
    if (available) {
      acc++;
    }
    return acc;
  }, 0);

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => {
        navigation.navigate("ComplexScreen", {
          complex,
          availableTurns,
          getAvailableTurns,
          playersAmountsSelectors,
          getPlayersAmountsSelectors,
        });
      }}
    >
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <TextComponent type="title" children={name} />
          <View style={styles.subtitlesContainer}>
            <View style={styles.infoRow}>
              <IonIcon name="time-outline" size={20} color={colors.primary} />
              <TextComponent
                type="subtitle"
                children={`${turnsAmount} turnos disponibles hoy`}
              />
            </View>
            <View style={styles.infoRow}>
              <IonIcon
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <TextComponent type="text" children={address} />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.complexImagePlaceholderContainer,
            { ...(!loadingImage && { display: "none" }) },
          ]}
        >
          <ActivityIndicator color={colors.primary} />
        </View>
        {complexMainPicture && (
          <Image
            source={{
              uri: complexMainPicture,
            }}
            style={[
              styles.complexImage,
              {
                ...(loadingImage && {
                  width: 1,
                  height: 1,
                  position: "absolute",
                  opacity: 0,
                }),
              },
            ]}
            onLoad={() => setLoadingImage(false)}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: { flexDirection: "row", justifyContent: "space-between" },
  infoContainer: { gap: 16 },
  subtitlesContainer: { gap: 4 },
  infoRow: { flexDirection: "row", gap: 4, alignItems: "center" },
  complexImagePlaceholderContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    justifyContent: "center",
  },
  complexImage: { width: 100, height: 100, borderRadius: 8 },
});
