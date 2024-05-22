import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { Complex } from "../../interfaces/complexes";
import { FootballField } from "../../interfaces/FootballFields";
import { ComplexSchedule } from "../../interfaces/ComplexesSchedules";

// Define a type for the slice state
export interface ComplexesState {
  complexes: Complex[];
  loading: boolean;
}

// Define the initial state using that type
const initialState: ComplexesState = { complexes: [], loading: true };

export const complexesSlice = createSlice({
  name: "complexes",
  initialState,
  reducers: {
    setComplexes: (state, action: PayloadAction<Complex[]>) => {
      return {
        complexes: [...state.complexes, ...action.payload],
        loading: false,
      };
    },
    updateComplex: (state, action: PayloadAction<Complex>) => {
      return {
        complexes: state.complexes.map((complex) => {
          if (complex._id === action.payload._id) {
            return action.payload;
          } else {
            return { ...complex };
          }
        }),
        loading: false,
      };
    },
    removeComplex: (state, action: PayloadAction<string>) => {
      state.complexes = state.complexes.filter(
        (complex) => complex._id !== action.payload
      );
    },
    updateComplexFields: (
      state,
      action: PayloadAction<{
        complexId: string;
        footballFields: FootballField[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.FootballFields = action.payload.footballFields;
        }
        return complex;
      });
    },
    updateComplexSchedules: (
      state,
      action: PayloadAction<{
        complexId: string;
        complexSchedules: ComplexSchedule[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.ComplexSchedules = action.payload.complexSchedules;
        }
        return complex;
      });
    },
    removeComplexSchedules: (
      state,
      action: PayloadAction<{
        complexId: string;
        schedulesIds: string[];
      }>
    ) => {
      console.log(
        "franco the payload --> ",
        JSON.stringify(action.payload, null, 4)
      );
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.ComplexSchedules = complex.ComplexSchedules.filter(
            (schedule) => {
              console.log("franco the id to compare: ", schedule._id);

              console.log(
                "franco y lo incluye?? ",
                action.payload.schedulesIds.includes(schedule._id)
              );

              if (!action.payload.schedulesIds.includes(schedule._id)) {
                return schedule;
              }
            }
          );
        }
        return complex;
      });
    },
    updateComplexMainPicture: (
      state,
      action: PayloadAction<{
        complexId: string;
        mainPictureURL: { imageURL: string; imageKey: string };
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.mainPictureURL = action.payload.mainPictureURL;
        }
        return { ...complex };
      });
    },
    addComplexExtraPicturesURLs: (
      state,
      action: PayloadAction<{
        complexId: string;
        extraPicturesURLs: { imageURL: string; imageKey: string }[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.extraPicturesURLs = [
            ...(complex?.extraPicturesURLs ?? ""),
            ...action.payload.extraPicturesURLs,
          ];
        }
        return complex;
      });
    },
    removeComplexExtraPicturesURLs: (
      state,
      action: PayloadAction<{
        complexId: string;
        keysToRemove: string[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.extraPicturesURLs = complex.extraPicturesURLs.filter(
            ({ imageKey }) => !action.payload.keysToRemove.includes(imageKey)
          );
        }
        return complex;
      });
    },
    addComplexExtraPicturesKeys: (
      state,
      action: PayloadAction<{
        complexId: string;
        extraPicturesKeys: string[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.extraPicturesKeys = [
            ...(complex?.extraPicturesKeys ?? ""),
            ...action.payload.extraPicturesKeys,
          ];
        }
        return complex;
      });
    },
    removeComplexExtraPicturesKeys: (
      state,
      action: PayloadAction<{
        complexId: string;
        keysToRemove: string[];
      }>
    ) => {
      state.complexes = state.complexes.map((complex) => {
        if (complex._id === action.payload.complexId) {
          complex.extraPicturesKeys = complex.extraPicturesKeys.filter(
            (key) => !action.payload.keysToRemove.includes(key)
          );
        }
        return complex;
      });
    },
  },
});
export const {
  setComplexes,
  updateComplex,
  removeComplex,
  updateComplexFields,
  updateComplexSchedules,
  removeComplexSchedules,
  updateComplexMainPicture,
  addComplexExtraPicturesURLs,
  removeComplexExtraPicturesURLs,
  addComplexExtraPicturesKeys,
  removeComplexExtraPicturesKeys,
} = complexesSlice.actions;

export const selectComplexes = (state: RootState) => state.complexes;

export const selectComplexById = (state: RootState, complexId: string) =>
  state.complexes.complexes.find((complex) => complex._id === complexId);

export default complexesSlice.reducer;
