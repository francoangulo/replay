import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenHeader } from "../components/ScreenHeader";
import { StackScreenProps } from "@react-navigation/stack";
import { cardStyle, colors } from "../../theme/appTheme";
import { TextComponent } from "../../components/TextComponent";
import IonIcon from "react-native-vector-icons/Ionicons";
import ADIcon from "react-native-vector-icons/AntDesign";
import { Asset, launchImageLibrary } from "react-native-image-picker";
import { ProfileStackParamList } from "../navigators/ProfileNavigatorOwners";
import { FormInput } from "../components/FormInput";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectAuth } from "../../redux/slices/authSlice";
import { FadeModal } from "../components/FadeModal";
import { FadeModalState } from "../../interfaces/FadeModal";
import { buildImageObjectToUpload } from "../../utils/utils";
import { postComplex } from "../../redux/actions/complexes";

type Props = StackScreenProps<ProfileStackParamList, "AddComplexScreen">;
interface FormErrors {
  complexName: string;
  complexAddress: string;
  complexPicture: string;
  complexCoordinate: string;
}

export const AddComplexScreenOwners = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const { _id: ownerId } = useAppSelector(selectAuth);

  const [modalState, setModalState] = useState<FadeModalState>({
    visible: false,
    status: "",
    complexId: "",
    autoDismiss: true,
  });

  useEffect(() => {
    navigation.replace("AddFieldsScreen", {
      complexId: "123",
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      modalState.visible === false &&
      modalState.status === "success" &&
      modalState.complexId
    ) {
      navigation.replace("AddFieldsScreen", {
        complexId: modalState.complexId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState]);

  const [complexName, setComplexName] = useState<string>("");
  const [complexAddress, setComplexAddress] = useState<string>("");
  const [complexPicture, setComplexPicture] = useState<Asset>({});
  const [errors, setErrors] = useState<FormErrors>({
    complexName: "",
    complexAddress: "",
    complexPicture: "",
    complexCoordinate: "",
  });

  const complexCoordinate = route.params?.complexCoordinate ?? undefined;

  const selectPicture = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    result?.assets &&
      result?.assets[0].uri &&
      setComplexPicture(result.assets[0]);
  };

  const checkErrors = (): FormErrors => {
    let errors = {
      complexName: "",
      complexAddress: "",
      complexPicture: "",
      complexCoordinate: "",
    };
    if (!complexName.length) {
      errors.complexName = "Por favor ingresa el nombre del complejo";
    }
    if (complexName.length < 3) {
      errors.complexName = "Por favor ingresa un nombre válido";
    }

    if (!complexAddress.length) {
      errors.complexAddress = "Por favor ingresa la dirección del complejo";
    }
    if (complexAddress.length < 6) {
      errors.complexAddress = "Por favor ingresa una dirección válida";
    }

    if (!Object.keys(complexPicture).length) {
      errors.complexPicture = "Por favor agreaga una foto del complejo";
    }
    if (!complexCoordinate) {
      errors.complexCoordinate = "Por favor selecciona la ubicación en el mapa";
    }
    if (!complexCoordinate?.latitude || !complexCoordinate.longitude) {
      errors.complexCoordinate = "Por favor selecciona la ubicación en el mapa";
    }
    setErrors(errors);
    return errors;
  };

  const goNextStep = async () => {
    if (false) {
      setModalState({
        visible: true,
        status: "success",
        complexId: "123",
        autoDismiss: true,
      });
    } else {
      const checkedErrors = checkErrors();
      if (
        Object.keys(checkedErrors).some(
          (error) => checkedErrors[error as keyof FormErrors].length
        )
      ) {
        return;
      }
      const imageBody = await buildImageObjectToUpload(complexPicture);
      dispatch(
        postComplex({
          body: {
            name: complexName,
            address: complexAddress,
            latitude: complexCoordinate.latitude, // ! TODO
            longitude: complexCoordinate.longitude, // ! TODO
            ownerId,
            complexPicture: imageBody, // ! TODO
          },
          callback: (complexId) =>
            setModalState({
              visible: true,
              status: "success",
              complexId,
              autoDismiss: true,
            }),
        })
      );
    }
  };

  const { width: windowWidth } = Dimensions.get("window");
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        title="Añadir complejo"
        navigation={navigation}
        route={route}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          style={{ padding: 16, flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ gap: 32 }}>
              <View style={{ ...(cardStyle as Object), gap: 16 }}>
                <FormInput
                  label="Nombre del complejo"
                  error={errors.complexName}
                  defaultValue={complexName}
                  onChangeText={(value) => setComplexName(value)}
                  autoFocus
                />
                <FormInput
                  label="Dirección del complejo"
                  error={errors.complexAddress}
                  defaultValue={complexAddress}
                  onChangeText={(value) => setComplexAddress(value)}
                />

                <View style={{ alignItems: "center", gap: 4 }}>
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onPress={() =>
                      navigation.navigate("SelectLocationScreen", {
                        complexCoordinate,
                      })
                    }
                  >
                    <IonIcon name="location-outline" size={20} />

                    <TextComponent type="text">
                      Seleccionar Ubicación
                    </TextComponent>

                    {complexCoordinate ? (
                      <ADIcon name="check" size={24} color={colors.primary} />
                    ) : null}
                    {!!errors.complexCoordinate && !complexCoordinate ? (
                      <ADIcon name="close" size={24} color={colors.danger} />
                    ) : null}
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "300",
                      color: colors.danger,
                      fontSize: 12,
                    }}
                  >
                    {errors.complexCoordinate}
                  </Text>
                </View>
              </View>
              {complexPicture?.uri?.length ?? 0 > 0 ? (
                <TouchableOpacity
                  style={{
                    width: windowWidth - 32,
                    height: (windowWidth - 32) / 1.78,
                    ...(cardStyle as Object),
                    padding: 0,
                  }}
                  onPress={selectPicture}
                >
                  <Image
                    source={{ uri: complexPicture.uri }}
                    style={{ width: "100%", height: "100%", borderRadius: 16 }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width: windowWidth - 32,
                    height: (windowWidth - 32) / 1.78,
                    borderWidth: 1,
                    borderStyle: "dashed",
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    ...(!!errors.complexPicture && {
                      borderColor: colors.danger,
                    }),
                  }}
                  onPress={selectPicture}
                >
                  <ADIcon name="plus" size={24} />
                  {errors.complexPicture ? (
                    <Text
                      style={{
                        fontWeight: "300",
                        color: colors.danger,
                        fontSize: 12,
                      }}
                    >
                      {errors.complexPicture}
                    </Text>
                  ) : (
                    <TextComponent type="text">Foto</TextComponent>
                  )}
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 0.75,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => navigation.pop()}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: colors.danger,
                  }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1.25,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => goNextStep()}
              >
                <Text style={{ fontWeight: "bold", color: colors.appBg }}>
                  Siguiente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FadeModal
        modalState={modalState}
        setModalState={setModalState}
        modalContent={() => {
          return (
            <View>
              {modalState.status === "error" ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>❗️</Text>
                  <Text style={{ fontSize: 20 }}>Se produjo un error</Text>
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    Si el problema persiste, contacta un administrador
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    rowGap: 8,
                  }}
                >
                  <Text style={{ fontSize: 40 }}>✅</Text>
                  <Text style={{ fontSize: 20 }}>Complejo creado</Text>
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    Ahora vamos al último paso
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};
