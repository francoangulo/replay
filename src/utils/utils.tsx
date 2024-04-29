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
import { Asset } from "react-native-image-picker";

/**
 * Generates a random pastel color based on the given number.
 *
 * @param {number} [number] - Optional parameter used to influence the color generation.
 * If not provided, a random number will be used.
 *
 * @returns {string} - A hexadecimal representation of the generated pastel color.
 */

export const getRandomPastelColor = (number: number): string => {
  //   const random = Math.random();
  const h = Math.floor((number || Math.random()) * 360);
  const s = 70;
  const l = 85;

  const hDecimal = l / 100;
  const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = hDecimal - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

    // Convert to Hex and prefix with "0" if required
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * Calculates the haversine distance between two geographical coordinates using the Earth's radius.
 *
 * @param {number} lat1 - Latitude of the first point in decimal degrees.
 * @param {number} lon1 - Longitude of the first point in decimal degrees.
 * @param {number} lat2 - Latitude of the second point in decimal degrees.
 * @param {number} lon2 - Longitude of the second point in decimal degrees.
 *
 * @returns {number} - The haversine distance between the two points in kilometers.
 */

export const haversine = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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

/**
 * Checks and manages location permissions on the device.
 *
 * @async
 * @param {object} options - Options for handling permission status.
 * @param {Function} [options.onGranted=() => {}] - Callback function to be executed when permission is granted.
 * @param {Function} [options.onDenied=() => {}] - Callback function to be executed when permission is denied.
 *
 * @returns {Promise<void>} - Resolves when the permission status is checked and appropriate actions are taken.
 *
 * @throws {Error} - Throws an error if the permission check encounters an unexpected state.
 */

export const checkLocationPermission = async ({
  onGranted = () => {},
  onDenied = () => {},
}: CheckLocationProps): Promise<void> => {
  let permissionStatus: PermissionStatus;
  // First check the permission status
  if (Platform.OS === "ios") {
    permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }

  // Action based on the permission status
  switch (permissionStatus) {
    case RESULTS.UNAVAILABLE:
      // Just unavailable, nothing we can do here
      Alert.alert(
        "No disponible",
        "Esta función no está disponible en tu dispositivo",
        [{ text: "Aceptar", onPress: () => onDenied(permissionStatus) }]
      );
      break;
    case RESULTS.DENIED:
      // Denied, but requestable
      // Inform the user about the need for the location
      Alert.alert(
        "Ubicación necesaria",
        "Necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          {
            text: "Aceptar",
            onPress: async () =>
              // Ask for the permission
              await askLocationPermission({ onGranted, onDenied }),
          },
        ],
        { cancelable: false }
      );
      break;
    case RESULTS.GRANTED || RESULTS.LIMITED:
      // Already granted, callback()
      onGranted(permissionStatus);
      break;
    case RESULTS.BLOCKED:
      // Blocked, not requestable any more
      // We need the user to go to settings and manually enable it
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

/**
 * Asks for location permission and executes specified callbacks based on the result.
 *
 * @param {AskLocationProps} options - Options for handling permission status.
 * @returns {Promise<void>} - Resolves when the permission status is checked and appropriate actions are taken.
 * @throws {Error} - Throws an error if the permission check encounters an unexpected state.
 */

const askLocationPermission = async ({
  onGranted = () => {},
  onDenied = () => {},
}: AskLocationProps) => {
  let permissionResult: PermissionStatus;
  // Ask for the permission
  if (Platform.OS === "ios") {
    permissionResult = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else {
    permissionResult = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  }

  // Action based on the permission result
  switch (permissionResult) {
    case RESULTS.UNAVAILABLE:
      // Just unavailable, nothing we can do here
      Alert.alert(
        "No disponible",
        "Esta función no está disponible en tu dispositivo",
        [{ text: "Aceptar", onPress: () => onDenied(permissionResult) }]
      );

      break;
    case RESULTS.DENIED:
      // Denied, but requestable
      // Inform the user about the need for the location
      Alert.alert(
        "Ubicación necesaria",
        "Por favor, necesitamos conocer su ubicación para mostrarle los complejos cercanos",
        [
          {
            text: "Aceptar",
            onPress: async () =>
              // Ask for the permission
              await askLocationPermission({ onGranted, onDenied }),
          },
          { text: "Cancelar", onPress: () => onDenied(permissionResult) },
        ],
        { cancelable: false }
      );
      break;
    case RESULTS.GRANTED || RESULTS.LIMITED:
      // Already granted, callback()
      onGranted(permissionResult);
      break;
    case RESULTS.BLOCKED:
      // Blocked, not requestable any more
      // We need the user to go to settings and manually enable it
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

/**
 * Opens the device's map application to view the location of a complex.
 *
 * @param {Complex} complex - The complex object containing location details.
 * @param {number} complex.latitude - The latitude of the complex.
 * @param {number} complex.longitude - The longitude of the complex.
 * @param {string} complex.name - The name or label of the complex.
 *
 * @returns {void} - This function does not return anything.
 *
 */

export const onViewLocation = (complex: Complex): void => {
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

/**
 * Converts the given duration in minutes to hours and remaining minutes.
 *
 * @param {60 | 90 | 120} minute - The duration in minutes (valid options: 60, 90, 120).
 * @returns {{ hour: number, minutes: number }} - An object containing the converted hours and remaining minutes.
 */

export const minutesToHours = (minute: 60 | 90 | 120) => {
  const hour = Math.trunc(minute / 60);
  const minutes = minute % 60;
  return { hour, minutes };
};

export interface BuiltImage {
  uri: string;
  type: string;
  name: string;
}

export const buildImageObjectToUpload = (image: Asset): BuiltImage | false => {
  let name = image?.fileName;
  const uri = Platform.select({
    ios: image?.uri?.replace("file://", ""),
    android: image?.uri,
  });
  const type = image?.type;
  //   if (!name) {
  //     name = path.parse(uri).base;
  //   }
  if (uri && type && name) {
    return {
      uri,
      type,
      name,
    };
  } else {
    return false;
  }
};
