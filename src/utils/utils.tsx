import { Alert, Linking, Platform } from "react-native";
import {
  PERMISSIONS,
  PermissionStatus,
  RESULTS,
  check,
  openSettings,
  request,
} from "react-native-permissions";
import { Complex } from "../interfaces/complexes";

export const getRandomPastelColor = (number: number) => {
  //   const random = Math.random();
  const h = Math.floor((number || Math.random()) * 360);
  const s = 70;
  const l = 85;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Haversine formula to calculate the distance between two coordinates
export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

interface CheckLocationProps {
  onGranted?: (permissionStatus: PermissionStatus) => void;
  onDenied?: (permissionStatus: PermissionStatus) => void;
}

export const checkLocationPermission = async ({
  onGranted = () => {},
  onDenied = () => {},
}: CheckLocationProps) => {
  let permissionStatus: PermissionStatus;
  if (Platform.OS === "ios") {
    permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }
  switch (permissionStatus) {
    case RESULTS.UNAVAILABLE:
      Alert.alert(
        "No disponible",
        "Esta función no está disponible en tu dispositivo",
        [{ text: "Aceptar", onPress: () => onDenied(permissionStatus) }]
      );
      break;
    case RESULTS.DENIED:
      Alert.alert(
        "Ubicación necesaria",
        "Necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          {
            text: "Aceptar",
            onPress: async () =>
              await askLocationPermission({ onGranted, onDenied }),
          },
        ],
        { cancelable: false }
      );
      break;
    case RESULTS.GRANTED || RESULTS.LIMITED:
      onGranted(permissionStatus);
      break;
    case RESULTS.BLOCKED:
      Alert.alert(
        "Ubicación necesaria",
        "Por favor, necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          { text: "Aceptar", onPress: openSettings },
          { text: "Cancelar", onPress: () => onDenied(permissionStatus) },
        ],
        { cancelable: false }
      );
      break;
  }
};

interface AskLocationProps {
  onGranted?: (permissionStatus: PermissionStatus) => void;
  onDenied?: (permissionStatus: PermissionStatus) => void;
}

const askLocationPermission = async ({
  onGranted = () => {},
  onDenied = () => {},
}: AskLocationProps) => {
  let permissionResult: PermissionStatus;
  if (Platform.OS === "ios") {
    permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }

  switch (permissionResult) {
    case RESULTS.UNAVAILABLE:
      Alert.alert(
        "No disponible",
        "Esta función no está disponible en tu dispositivo",
        [{ text: "Aceptar", onPress: () => onDenied(permissionResult) }]
      );

      break;
    case RESULTS.DENIED:
      Alert.alert(
        "Ubicación necesaria",
        "Por favor, necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          {
            text: "Aceptar",
            onPress: async () =>
              await askLocationPermission({ onGranted, onDenied }),
          },
          { text: "Cancelar", onPress: () => onDenied(permissionResult) },
        ],
        { cancelable: false }
      );
      break;
    case RESULTS.GRANTED || RESULTS.LIMITED:
      onGranted(permissionResult);
      break;
    case RESULTS.BLOCKED:
      Alert.alert(
        "Ubicación necesaria",
        "Por favor, necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          { text: "Aceptar", onPress: openSettings },
          { text: "Cancelar", onPress: () => onDenied(permissionResult) },
        ],
        { cancelable: false }
      );
      break;
  }
};

export const onViewLocation = (complex: Complex) => {
  const scheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const latLng = `${complex?.latitude},${complex?.longitude}`;
  const label = complex?.name;
  const url =
    Platform.OS === "ios"
      ? `${scheme}${label}@${latLng}`
      : `${scheme}${latLng}(${label})`;

  Linking.openURL(url);
};
