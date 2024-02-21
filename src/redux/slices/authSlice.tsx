import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Owner, OwnerResponse } from "../../interfaces/Owners";
import { AppDispatch, RootState } from "../store";
import { LoginPlayerResponse, Player } from "../../interfaces/Players";
import { saveToken, saveUserId } from "../../helpers/asyncStorage";
import { LoginUserResponse } from "../../interfaces/Users";
import replayAPI from "../../api/api";

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
    const resp = await replayAPI.get<OwnerResponse>("/owners", { params });
    dispatch(login({ ...resp.data.owner, userType: "owner" }));
  } catch (error) {
    console.log({ error });
  }
};

interface LoginProps {
  email?: string;
  password?: string;
  callback?: (userType?: string) => void;
  userId?: string;
  token?: string;
}

export const loginPlayer =
  ({ email, password, callback, userId, token }: LoginProps) =>
  async (dispatch: AppDispatch) => {
    try {
      if (email && password) {
        const params = { email, password };
        const res = await replayAPI.post<LoginPlayerResponse>(
          "/players/login",
          params
        );
        if (res.data.status === "success") {
          dispatch(login({ ...res.data.player, userType: "player" }));

          await saveToken(res.data.token);
          await saveUserId(res.data.player._id);

          callback && callback();
        }
      } else {
        const params = { userId, token };
        const resp = await replayAPI.post<LoginPlayerResponse>(
          "/players/login",
          params
        );
        dispatch(login({ ...resp.data.player, userType: "player" }));
        callback && callback("player");
      }
    } catch (error) {
      console.log({ error });
    }
  };

export const loginUser =
  ({ email, password, callback, userId, token }: LoginProps) =>
  async (dispatch: AppDispatch) => {
    console.log("HELLO THERE?");

    try {
      if (email && password) {
        const body = { email, password };
        const res = await replayAPI.post<LoginUserResponse>(
          "/users/login",
          body
        );
        if (res.data.status === "success") {
          if (res.data?.player) {
            dispatch(login({ ...res.data.player, userType: "player" }));
            await saveUserId(res.data.player._id);
            await saveToken(res.data.token);
            callback && callback("player");
          }

          if (res.data?.owner) {
            dispatch(login({ ...res.data.owner, userType: "owner" }));
            await saveUserId(res.data.owner._id);
            await saveToken(res.data.token);
            callback && callback("owner");
          }
        }
      } else {
        const params = { userId, token };
        const res = await replayAPI.post<LoginUserResponse>(
          "/users/login",
          params
        );

        if (res.data?.player) {
          dispatch(login({ ...res.data.player, userType: "player" }));
          callback && callback("player");
        }
        if (res.data?.owner) {
          dispatch(login({ ...res.data.owner, userType: "owner" }));
          callback && callback("owner");
        }
      }
    } catch (error) {
      console.log("error logging in user: ", error);
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
  async () => //   dispatch: AppDispatch
  {
    try {
      const params = { name, lastName, phoneNumber, email, password };
      const resp = await replayAPI.post<{ status: string }>("/players", params);
      if (resp.data.status === "success") {
        callback();
      }
      // dispatch(login({ ...resp.data.player, userType: "player" }));
    } catch (error) {
      console.log({ error });
    }
  };

export const selectAuth = (state: RootState) => state.auth;

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
