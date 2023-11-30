import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token: string) => {
  return AsyncStorage.setItem("TOKEN", token);
};

export const getToken = async () => {
  return AsyncStorage.getItem("TOKEN");
};

export const removeToken = () => {
  return AsyncStorage.removeItem("TOKEN");
};

export const saveUserId = async (userId: string) => {
  return AsyncStorage.setItem("USER_ID", userId);
};

export const getUserId = async () => {
  return AsyncStorage.getItem("USER_ID");
};

export const removeUserId = () => {
  return AsyncStorage.removeItem("USER_ID");
};
