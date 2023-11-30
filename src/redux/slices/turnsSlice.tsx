import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import {
  Turn,
  TurnsResponse,
  CreateTurnResponse,
  ConfirmTurnResponse,
} from "../../interfaces/Turns";
import { DateTime } from "luxon";
import replayAPI from "../../api/api";

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
    updateTurn: (state, action: PayloadAction<Turn>) => {
      const updatedTurns = state.allTurns.map((turn) => {
        if (turn._id === action.payload._id) return action.payload;
        return turn;
      });
      return {
        ...state,
        allTurns: [...updatedTurns],
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
const { updateTurn } = ownerTurnsSlice.actions;

export const getOwnerTurns =
  (ownerId: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { complexOwnerId: ownerId };
      const resp = await replayAPI.get<TurnsResponse>("/turns", { params });
      console.log("turns resp", JSON.stringify(resp.data.turns, null, 4));
      dispatch(setOwnerTurns(resp.data.turns));
    } catch (error) {
      console.log({ error });
    }
  };

export const getAllTurns = () => async (dispatch: AppDispatch) => {
  try {
    const resp = await replayAPI.get<TurnsResponse>("/turns");
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
  fieldNumber: number;
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
      fieldNumber,
      startDate,
    }: TurnProps,
    callback: (newTurn: Turn) => void = () => {}
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.post<CreateTurnResponse>("/turns", {
        playerId,
        complexId,
        complexOwnerId,
        endDate,
        fieldId,
        fieldNumber,
        startDate,
      });
      dispatch(setAllTurns([resp.data.newTurn]));
      callback(resp.data.newTurn);
    } catch (error) {
      console.log({ error });
    }
  };

export const emptyTurns = () => async (dispatch: AppDispatch) => {
  try {
    const resp = await replayAPI.delete<CreateTurnResponse>("/turns/all");
    dispatch(resetAllTurns());
  } catch (error) {
    console.log({ error });
  }
};

export const confirmTurn =
  (
    { turnId }: { turnId: string },
    callback: (newTurn: Turn) => void = () => {}
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.post<ConfirmTurnResponse>("/turns/confirm", {
        turnId,
      });
      dispatch(updateTurn(resp.data.confirmedTurn));
      callback(resp.data.confirmedTurn);
    } catch (error) {
      console.log({ error });
    }
  };

export const selectTurns = (state: RootState) => state.turns;

// Action creators are generated for each case reducer function
export const {} = ownerTurnsSlice.actions;

export default ownerTurnsSlice.reducer;
