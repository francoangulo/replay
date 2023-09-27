import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch, RootState } from "../store";
import {
  Complex,
  ComplexesResponse,
  DeleteComplexResponse,
  PostComplexBody,
  PostComplexResponse,
} from "../../interfaces/complexes";
import {
  removeOwnerComplex,
  setOwnerComplexes,
  updateOwnerComplexFields,
  updateOwnerComplexSchedules,
} from "./ownerComplexesSlice";
import {
  NewFootballField,
  PostMultipleFieldsResponse,
} from "../../interfaces/FootballFields";
import {
  ComplexSchedule,
  PostMultipleSchedulesResponse,
} from "../../interfaces/ComplexesSchedules";

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
    removeComplex: (state, action: PayloadAction<string>) => {
      state.complexes = state.complexes.filter(
        (complex) => complex._id !== action.payload
      );
    },
    updateComplexFields: (
      state,
      action: PayloadAction<{
        complexId: string;
        footballFields: NewFootballField[];
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
  },
});
const {
  setComplexes,
  removeComplex,
  updateComplexFields,
  updateComplexSchedules,
} = complexesSlice.actions;

export const getComplexes = () => async (dispatch: AppDispatch) => {
  try {
    const resp = await axios.get<ComplexesResponse>(
      "http://192.168.100.178:3000/complexes"
    );
    dispatch(setComplexes(resp.data.complexes));
  } catch (error) {
    console.log({ error });
  }
};

interface PostComplexProps {
  body: PostComplexBody;
  callback: (complexId: string) => void;
}

export const postComplex =
  ({ body, callback = () => {} }: PostComplexProps) =>
  async (dispatch: AppDispatch) => {
    console.log("franco body", JSON.stringify(body, null, 4));
    try {
      const resp = await axios.post<PostComplexResponse>(
        "http://192.168.100.178:3000/complexes",
        body
      );
      dispatch(setComplexes([resp.data.newComplex]));
      dispatch(setOwnerComplexes([resp.data.newComplex]));
      callback(resp.data.newComplex._id);
    } catch (error) {
      console.log({ error });
    }
  };

export const deleteComplex =
  (complexId: string, callback: () => void = () => {}) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await axios.delete<DeleteComplexResponse>(
        "http://192.168.100.178:3000/complexes",
        { data: { complexId } }
      );
      console.log("response", JSON.stringify(resp.data, null, 4));

      dispatch(removeComplex(complexId));
      dispatch(removeOwnerComplex(complexId));
      callback();
    } catch (error) {
      console.log({ error });
    }
  };

interface PostFootballFieldsProps {
  body: {
    fieldsAmount: number;
    complexId: string;
  };
  callback?: () => void;
}

export const postFootballFields =
  ({ body, callback = () => {} }: PostFootballFieldsProps) =>
  async (dispatch: AppDispatch) => {
    console.log("franco body", JSON.stringify(body, null, 4));
    try {
      const resp = await axios.post<PostMultipleFieldsResponse>(
        "http://192.168.100.178:3000/football-fields/by-number",
        body
      );
      dispatch(
        updateComplexFields({
          complexId: body.complexId,
          footballFields: resp.data.newFootballFields,
        })
      );
      dispatch(
        updateOwnerComplexFields({
          complexId: body.complexId,
          footballFields: resp.data.newFootballFields,
        })
      );
      callback();
    } catch (error) {
      console.log({ error });
    }
  };

export interface ScheduleParsed {
  openingTime: string;
  closingTime: string;
  weekDays: number[];
  sport: string;
}

interface PostComplexSchedulesProps {
  body: {
    schedules: ScheduleParsed[];
    complexId: string;
  };
  callback?: () => void;
}

export const postComplexSchedules =
  ({ body, callback = () => {} }: PostComplexSchedulesProps) =>
  async (dispatch: AppDispatch) => {
    console.log("franco body", JSON.stringify(body, null, 4));

    try {
      const resp = await axios.post<PostMultipleSchedulesResponse>(
        "http://192.168.100.178:3000/complexes-schedules/multiple",
        body
      );
      dispatch(
        updateComplexSchedules({
          complexId: body.complexId,
          complexSchedules: resp.data.newComplexSchedules,
        })
      );
      dispatch(
        updateOwnerComplexSchedules({
          complexId: body.complexId,
          complexSchedules: resp.data.newComplexSchedules,
        })
      );
      callback();
    } catch (error) {
      console.log({ error });
    }
  };

export const selectComplexes = (state: RootState) => state.complexes;

// Action creators are generated for each case reducer function
export const {} = complexesSlice.actions;

export default complexesSlice.reducer;
