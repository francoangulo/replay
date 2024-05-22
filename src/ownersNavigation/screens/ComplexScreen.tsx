import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { TextComponent } from "../../components/TextComponent";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { cardStyle, colors } from "../../theme/appTheme";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { deleteComplex } from "../../redux/actions/complexes";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComplexMainPicture } from "../../hooks/useComplexMainPicture";
import { GenericButton } from "../../components/GenericButton";
import ImageColors from "react-native-image-colors";
import { ImageColorsResult } from "react-native-image-colors/lib/typescript/types";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IonIcon from "react-native-vector-icons/Ionicons";
import { selectComplexById } from "../../redux/slices/complexesSlice";

interface RowCardProps {
  imageColor: string;
  amount: number;
  text: string;
  Icon: JSX.Element;
  onPress?: () => void;
}
const RowCard = ({ amount, text, Icon, onPress = () => {} }: RowCardProps) => {
  return (
    <TouchableOpacity style={[cardStyle, styles.rowCards]} onPress={onPress}>
      {Icon}

      <TextComponent children={String(amount)} type="title" />
      <TextComponent
        children={`${text}${amount > 1 ? "s" : ""}`}
        type="subtitle"
      />
    </TouchableOpacity>
  );
};

type ScreenProps = StackScreenProps<ProfileStackParamList, "ComplexScreen">;

export const ComplexScreen = ({ route, navigation }: ScreenProps) => {
  const { complexId } = route.params;
  const complex = useAppSelector((state) =>
    selectComplexById(state, complexId)
  )!;
  const dispatch = useAppDispatch();
  const { top } = useSafeAreaInsets();
  const [imageColor, setImageColor] = useState<string>("");

  const { complexMainPicture } = useComplexMainPicture({
    complexId: complex._id,
    mainPictureKey: complex.mainPictureKey,
  });

  const getImagePrimaryColor = async () => {
    const colorsResult: ImageColorsResult = await ImageColors.getColors(
      complexMainPicture,
      {
        fallback: colors.primary,
        cache: true,
        key: complexMainPicture,
      }
    );

    if (colorsResult.platform === "ios") {
      setImageColor(colorsResult.primary);
    } else {
      if (colorsResult.platform === "android") {
        setImageColor(colorsResult.average || colors.primary);
      }
    }
  };

  useEffect(() => {
    if (complexMainPicture?.length) {
      getImagePrimaryColor();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexMainPicture]);

  return (
    <View style={[styles.screenContainer]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContainer,
          { paddingTop: top },
        ]}
      >
        <View>
          <View style={styles.nameContainer}>
            <TextComponent type="title">{complex.name}</TextComponent>
          </View>
          <View style={styles.pictureContainer}>
            {complexMainPicture?.length ? (
              <View style={[styles.imageShadow, { shadowColor: imageColor }]}>
                <Image
                  source={{ uri: complexMainPicture }}
                  style={[styles.complexPicture]}
                />
              </View>
            ) : null}
          </View>
          <View style={styles.rowContainer}>
            <RowCard
              amount={complex?.FootballFields?.length || 0}
              imageColor={imageColor}
              text="Cancha"
              Icon={
                <MCIcon
                  name="soccer-field"
                  color={imageColor || colors.primary}
                  size={40}
                />
              }
            />
            <RowCard
              amount={complex?.ComplexSchedules?.length || 0}
              imageColor={imageColor}
              text="Horario"
              Icon={
                <IonIcon
                  name="time-outline"
                  color={imageColor || colors.primary}
                  size={40}
                />
              }
              onPress={() =>
                navigation.navigate("SchedulesScreen", {
                  complexId: complex._id,
                })
              }
            />
            <RowCard
              amount={complex.extraPicturesKeys?.length || 0}
              imageColor={imageColor}
              text="Foto"
              Icon={
                <IonIcon
                  name="camera-outline"
                  color={imageColor || colors.primary}
                  size={40}
                />
              }
              onPress={() =>
                navigation.navigate("PicturesScreen", {
                  complexId: complex._id,
                })
              }
            />
          </View>
        </View>
        <View style={styles.footer}>
          <GenericButton
            buttonText="Remove"
            buttonType="danger"
            onButtonPress={() =>
              dispatch(deleteComplex(complex._id, navigation.pop))
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    rowGap: 16,
    flex: 1,
    overflow: "visible",
  },
  scrollViewContainer: {
    paddingBottom: 32,
    flex: 1,
    justifyContent: "space-between",
  },
  nameContainer: { paddingHorizontal: 24 },
  pictureContainer: {
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  complexPicture: { aspectRatio: 16 / 9, borderRadius: 24 },
  imageColorBlurred: {
    aspectRatio: 16 / 9,
    width: "100%",
    top: 0,
    position: "absolute",
    zIndex: -1,
    opacity: 0.5,
    right: 0,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    gap: 8,
  },
  rowCards: { flex: 1, alignItems: "center" },
  imageShadow: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15.46,

    elevation: 9,
  },
});
