import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Owner, OwnerResponse } from "../../interfaces/Owners";
import axios from "axios";
import { AppDispatch, RootState } from "../store";
import { LoginPlayerResponse, Player } from "../../interfaces/Players";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OwnerAuthState extends Owner {
  userType: "owner" | null;
}

export interface PlayerAuthState extends Player {
  userType: "player" | null;
}

// Define the initial state using that type
const initialState: OwnerAuthState | PlayerAuthState = {
  _id: "",
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  createdAt: "",
  updatedAt: "",
  userType: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<OwnerAuthState | PlayerAuthState>) => {
      return { ...state, ...action.payload };
    },
  },
});
const { login } = authSlice.actions;

export const loginOwner = (email: string) => async (dispatch: AppDispatch) => {
  try {
    const params = { email };
    const resp = await axios.get<OwnerResponse>(
      "http://192.168.100.178:3000/owners",
      { params }
    );
    console.log("franco respuesta", JSON.stringify(resp.data, null, 4));
    dispatch(login({ ...resp.data.owner, userType: "owner" }));
  } catch (error) {
    console.log({ error });
  }
};

export const loginPlayer =
  (email: string, password: string, callback: () => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const params = { email, password };
      const resp = await axios.post<LoginPlayerResponse>(
        "http://192.168.100.178:3000/players/login",
        params
      );
      console.log("franco respuesxta", JSON.stringify(resp.data, null, 4));
      if (resp.data.status === "success") {
        dispatch(login({ ...resp.data.player, userType: "player" }));

        await AsyncStorage.setItem("TOKEN", resp.data.token);
        await AsyncStorage.setItem("USER", resp.data.player._id);

        callback();
      }
    } catch (error) {
      console.log({ errorFranco: error });
    }
  };

export const registerPlayer =
  (
    name: string,
    lastName: string,
    phoneNumber: string,
    email: string,
    password: string,
    callback: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const params = { name, lastName, phoneNumber, email, password };
      const resp = await axios.post<{ status: string }>(
        "http://192.168.100.178:3000/players",
        params
      );
      console.log("franco respuesta", JSON.stringify(resp.data, null, 4));
      if (resp.data.status === "success") {
        callback();
      }
      // dispatch(login({ ...resp.data.player, userType: "player" }));
    } catch (error) {
      console.log({ errorFranco: error });
    }
  };

export const selectAuth = (state: RootState) => state.auth;

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
