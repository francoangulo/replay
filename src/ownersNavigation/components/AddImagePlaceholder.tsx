import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import { colors } from "../../theme/appTheme";

interface AddImageComponentProps {
  containerStyle: StyleProp<ViewStyle>;
  onPress: () => void;
}

export const AddImagePlaceholder = ({
  containerStyle,
  onPress,
}: AddImageComponentProps) => {
  return (
    <TouchableOpacity
      style={[styles.imageContainer, containerStyle]}
      onPress={onPress}
    >
      <IonIcon name="add-circle-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: { justifyContent: "center", alignItems: "center" },
  loader: {
    position: "absolute",
  },
});
