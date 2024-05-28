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
export interface TurnsState {
  ownerTurns: Turn[];
  playerTurns: Turn[];
  allTurns: Turn[];
  loadingOwnerTurns: boolean;
  loadingPlayerTurns: boolean;
  loadingAllTurns: boolean;
}

// Define the initial state using that type
const initialState: TurnsState = {
  ownerTurns: [],
  playerTurns: [],
  allTurns: [],
  loadingOwnerTurns: true,
  loadingPlayerTurns: true,
  loadingAllTurns: true,
};

export const ownerTurnsSlice = createSlice({
  name: "ownerTurns",
  initialState,
  reducers: {
    setOwnerTurns: (state, action: PayloadAction<Turn[]>) => {
      return {
        ...state,
        ownerTurns: [...action.payload],
        loadingOwnerTurns: false,
      };
    },
    setPlayerTurns: (state, action: PayloadAction<Turn[]>) => {
      return {
        ...state,
        playerTurns: [...state.playerTurns, ...action.payload],
        loadingPlayerTurns: false,
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
      return {
        ...state,
        allTurns: [
          ...state.allTurns.map((turn) =>
            turn._id === action.payload._id ? action.payload : turn
          ),
        ],
        ownerTurns: [
          ...state.ownerTurns.map((turn) =>
            turn._id === action.payload._id ? action.payload : turn
          ),
        ],

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

export const { setOwnerTurns } = ownerTurnsSlice.actions;
const { setPlayerTurns } = ownerTurnsSlice.actions;
const { setAllTurns } = ownerTurnsSlice.actions;
const { resetAllTurns } = ownerTurnsSlice.actions;
const { updateTurn } = ownerTurnsSlice.actions;

export const getOwnerTurns =
  (ownerId: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { complexOwnerId: ownerId };
      const resp = await replayAPI.get<TurnsResponse>("/turns", { params });
      dispatch(setOwnerTurns(resp.data.turns));
    } catch (error) {
      console.error({ error });
    }
  };

export const getPlayerTurns =
  (playerId: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { playerId };
      const resp = await replayAPI.get<TurnsResponse>("/turns", { params });
      dispatch(setPlayerTurns(resp.data.turns));
    } catch (error) {
      console.error({ error });
    }
  };

export const getAllTurns = () => async (dispatch: AppDispatch) => {
  try {
    const resp = await replayAPI.get<TurnsResponse>("/turns");
    dispatch(setAllTurns(resp.data.turns));
  } catch (error) {
    console.error({ error });
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
  duration: 60 | 90 | 120;
  playersAmount: number;
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
      duration,
      playersAmount,
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
        duration,
        playersAmount,
      });
      dispatch(setAllTurns([resp.data.newTurn]));
      dispatch(setPlayerTurns([resp.data.newTurn]));
      dispatch(setOwnerTurns([resp.data.newTurn]));
      callback(resp.data.newTurn);
    } catch (error) {
      console.error({ error });
    }
  };

export const emptyTurns = () => async (dispatch: AppDispatch) => {
  try {
    await replayAPI.delete<CreateTurnResponse>("/turns/all");
    dispatch(resetAllTurns());
  } catch (error) {
    console.error({ error });
  }
};

export const confirmTurn =
  (
    { turnId }: { turnId: string },
    callback: (newTurn: Turn) => void = () => {}
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.put<ConfirmTurnResponse>("/turns/confirm", {
        turnId,
      });
      dispatch(updateTurn(resp.data.confirmedTurn));
      callback(resp.data.confirmedTurn);
    } catch (error) {
      console.error({ error });
    }
  };

export const selectTurns = (state: RootState) => state.turns;

// Action creators are generated for each case reducer function
export const {} = ownerTurnsSlice.actions;

export default ownerTurnsSlice.reducer;
