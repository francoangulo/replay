import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Easing,
} from "react-native";
import { cardStyle, colors } from "../../theme/appTheme";
import { DateTime } from "luxon";
import IonIcon from "react-native-vector-icons/Ionicons";
import { Turn } from "../../interfaces/Turns";
import { TurnCardRow } from "../../sharedNavigation/components/TurnCardRow";

interface Props {
  onPress: () => void;
  turn: Turn;
}

export const InProgressTurn = ({ onPress, turn }: Props) => {
  const { startDate, endDate } = turn;
  const startDateTime = DateTime.fromISO(startDate);
  const endDateTime = DateTime.fromISO(endDate);
  const animatedBallRotation = useRef(new Animated.Value(0)).current; // Initial value for top: 0
  const animatedBallBounce = useRef(new Animated.Value(0)).current; // Initial value for top: 0

  useEffect(() => {
    const sequenceAnimation = Animated.sequence([
      Animated.timing(animatedBallRotation, {
        toValue: 360,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedBallBounce, {
        toValue: -15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(animatedBallBounce, {
        toValue: 0,
        duration: 500,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(Animated.parallel([sequenceAnimation])).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[cardStyle, { backgroundColor: colors.primaryThree }]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.timeText}>Cancha {turn.fieldNumber}</Text>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animatedBallRotation.interpolate({
                  inputRange: [0, 360],
                  outputRange: ["0deg", "360deg"],
                }),
              },
              { translateY: animatedBallBounce },
            ],
          }}
        >
          <IonIcon name="football" size={24} color={colors.primary} />
        </Animated.View>
      </View>
      <TurnCardRow title="Inicio" value={startDateTime.toFormat("HH:mm")} />
      <TurnCardRow title="Fin" value={endDateTime.toFormat("HH:mm")} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeText: { textTransform: "capitalize", fontWeight: "700" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
});
