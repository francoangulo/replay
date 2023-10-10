import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store";
import { Complex, ComplexesResponse } from "../../interfaces/complexes";
import { NewFootballField } from "../../interfaces/FootballFields";
import { ComplexSchedule } from "../../interfaces/ComplexesSchedules";

// Define a type for the slice state
export interface OwnerComplexesState {
  ownerComplexes: Complex[];
  loading: boolean;
}

// Define the initial state using that type
const initialState: OwnerComplexesState = { ownerComplexes: [], loading: true };

export const ownerComplexesSlice = createSlice({
  name: "ownerComplexes",
  initialState,
  reducers: {
    setOwnerComplexes: (state, action: PayloadAction<Complex[]>) => {
      console.log("action", JSON.stringify(action, null, 4));
      return {
        ownerComplexes: [...state.ownerComplexes, ...action.payload],
        loading: false,
      };
    },
    removeOwnerComplex: (state, action: PayloadAction<string>) => {
      state.ownerComplexes = state.ownerComplexes.filter(
        (complex) => complex._id !== action.payload
      );
    },
    updateOwnerComplexFields: (
      state,
      action: PayloadAction<{
        complexId: string;
        footballFields: NewFootballField[];
      }>
    ) => {
      state.ownerComplexes = state.ownerComplexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.FootballFields = action.payload.footballFields;
        }
        return complex;
      });
    },
    updateOwnerComplexSchedules: (
      state,
      action: PayloadAction<{
        complexId: string;
        complexSchedules: ComplexSchedule[];
      }>
    ) => {
      state.ownerComplexes = state.ownerComplexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.ComplexSchedules = action.payload.complexSchedules;
        }
        return complex;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOwnerComplexes,
  removeOwnerComplex,
  updateOwnerComplexFields,
  updateOwnerComplexSchedules,
} = ownerComplexesSlice.actions;

export const getOwnerComplexes =
  (ownerId: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { ownerId };
      const resp = await axios.get<ComplexesResponse>(
        "http://localhost:3000/complexes",
        { params }
      );
      console.log("resp", JSON.stringify(resp, null, 4));
      dispatch(setOwnerComplexes(resp.data.complexes));
    } catch (error) {
      console.log({ error });
    }
  };

export const selectOwnerComplexes = (state: RootState) => state.ownerComplexes;

export default ownerComplexesSlice.reducer;
