import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store";
import {
  Turn,
  TurnsResponse,
  CreateTurnResponse,
} from "../../interfaces/Turns";
import { DateTime } from "luxon";

// Define a type for the slice state
export interface OwnerTurnsState {
  ownerTurns: Turn[];
  allTurns: Turn[];
  loadingOwnerTurns: boolean;
  loadingAllTurns: boolean;
}

// Define the initial state using that type
const initialState: OwnerTurnsState = {
  ownerTurns: [],
  allTurns: [],
  loadingOwnerTurns: true,
  loadingAllTurns: true,
};

export const ownerTurnsSlice = createSlice({
  name: "ownerTurns",
  initialState,
  reducers: {
    setOwnerTurns: (state, action: PayloadAction<Turn[]>) => {
      return {
        ...state,
        ownerTurns: [...state.ownerTurns, ...action.payload],
        loadingOwnerTurns: false,
      };
    },
    setAllTurns: (state, action: PayloadAction<Turn[]>) => {
      return {
        ...state,
        allTurns: [...state.allTurns, ...action.payload],
        loadingAllTurns: false,
      };
    },
    resetAllTurns: (state) => {
      return {
        ...state,
        allTurns: [],
        loadingAllTurns: false,
      };
    },
  },
});

const { setOwnerTurns } = ownerTurnsSlice.actions;
const { setAllTurns } = ownerTurnsSlice.actions;
const { resetAllTurns } = ownerTurnsSlice.actions;

export const getOwnerTurns =
  (ownerId: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { complexOwnerId: ownerId };
      const resp = await axios.get<TurnsResponse>(
        "http://192.168.100.178:3000/turns",
        { params }
      );
      console.log("resp", JSON.stringify(resp, null, 4));
      dispatch(setOwnerTurns(resp.data.turns));
    } catch (error) {
      console.log({ error });
    }
  };

export const getAllTurns = () => async (dispatch: AppDispatch) => {
  try {
    const resp = await axios.get<TurnsResponse>(
      "http://192.168.100.178:3000/turns"
    );
    console.log("resp", JSON.stringify(resp, null, 4));
    dispatch(setAllTurns(resp.data.turns));
  } catch (error) {
    console.log({ error });
  }
};

interface TurnProps {
  playerId: string;
  startDate: DateTime;
  endDate: DateTime;
  complexId: string;
  fieldId: string;
  complexOwnerId: string;
}

export const createTurn =
  (
    {
      playerId,
      complexId,
      complexOwnerId,
      endDate,
      fieldId,
      startDate,
    }: TurnProps,
    callback: (newTurn: Turn) => void = () => {}
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await axios.post<CreateTurnResponse>(
        "http://192.168.100.178:3000/turns",
        { playerId, complexId, complexOwnerId, endDate, fieldId, startDate }
      );
      dispatch(setAllTurns([resp.data.newTurn]));
      callback(resp.data.newTurn);
    } catch (error) {
      console.log({ error });
    }
  };

export const emptyTurns = () => async (dispatch: AppDispatch) => {
  console.log("REMOVING??");

  try {
    const resp = await axios.delete<CreateTurnResponse>(
      "http://192.168.100.178:3000/turns/all"
    );
    console.log("resp", JSON.stringify(resp.data, null, 4));
    dispatch(resetAllTurns());
  } catch (error) {
    console.log({ error });
  }
};

export const selectTurns = (state: RootState) => state.turns;

// Action creators are generated for each case reducer function
export const {} = ownerTurnsSlice.actions;

export default ownerTurnsSlice.reducer;
