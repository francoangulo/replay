import replayAPI from "../../api/api";
import {
  ComplexesResponse,
  DeleteComplexResponse,
  GetComplexExtraPicturesResponse,
  GetComplexImageResponse,
  PostComplexBody,
  PostComplexResponse,
  PutComplexResponse,
} from "../../interfaces/complexes";
import {
  DeleteScheduleResponse,
  PostMultipleSchedulesResponse,
  PutMultipleSchedulesResponse,
} from "../../interfaces/ComplexesSchedules";
import { PostMultipleFieldsResponse } from "../../interfaces/FootballFields";
import { BuiltImage } from "../../utils/utils";
import {
  removeComplex,
  setComplexes,
  addComplexExtraPicturesKeys,
  addComplexExtraPicturesURLs,
  updateComplexFields,
  updateComplexMainPicture,
  updateComplexSchedules,
  removeComplexExtraPicturesKeys,
  removeComplexExtraPicturesURLs,
  removeComplexSchedules,
} from "../slices/complexesSlice";
import { AppDispatch } from "../store";

export const getComplexes =
  (ownerId?: string) => async (dispatch: AppDispatch) => {
    try {
      const params = { ownerId };
      const resp = await replayAPI.get<ComplexesResponse>("/complexes", {
        params,
      });
      dispatch(setComplexes(resp.data.complexes));
    } catch (error) {
      console.error({ error });
    }
  };

interface PostComplexProps {
  body: PostComplexBody;
  callback: (complexId: string) => void;
}

export const postComplex =
  ({ body, callback = () => {} }: PostComplexProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const formData = new FormData();
      formData.append("complexPicture", body.complexPicture);
      formData.append("address", body.address);
      formData.append("latitude", body.latitude);
      formData.append("longitude", body.longitude);
      formData.append("name", body.name);
      formData.append("ownerId", body.ownerId);

      const resp = await replayAPI.post<PostComplexResponse>(
        "/complexes",
        body
      );
      dispatch(setComplexes([resp.data.newComplex]));
      callback(resp.data.newComplex._id);
    } catch (error) {
      console.error({ error });
    }
  };

interface GetMainPictureProps {
  complexId: string;
  mainPictureKey: string;
}
export const getComplexMainPicture =
  ({ complexId, mainPictureKey }: GetMainPictureProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await replayAPI.get<GetComplexImageResponse>(
        "complexes/image",
        { params: { imageKey: mainPictureKey } }
      );
      dispatch(
        updateComplexMainPicture({
          complexId,
          mainPictureURL: response.data.imageURL,
        })
      );
    } catch (error) {
      console.error("Error getting complex image URL", error);
    }
  };

interface GetExtraPictureProps {
  complexId: string;
  extraPicturesKeys: string[];
}
export const getComplexExtraPictures =
  ({ complexId, extraPicturesKeys }: GetExtraPictureProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const queryString = extraPicturesKeys
        .map((key) => `extraPicturesKeys=${encodeURIComponent(key)}`)
        .join("&");

      const response = await replayAPI.get<GetComplexExtraPicturesResponse>(
        `complexes/image?${queryString}`
      );

      dispatch(
        addComplexExtraPicturesURLs({
          complexId,
          extraPicturesURLs: response.data.extraPicturesURLs,
        })
      );
    } catch (error) {
      console.error("Error getting complex image URL", error);
    }
  };

interface PutExtraPictureProps {
  body: { complexExtraPictures: BuiltImage[]; complexId: string };
  callback: () => void;
}

export const uploadComplexExtraPicture =
  ({ body, callback = () => {} }: PutExtraPictureProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const formData = new FormData();
      formData.append("complexExtraPictures", body.complexExtraPictures);
      formData.append("complexId", body.complexId);

      const resp = await replayAPI.put<PutComplexResponse>(
        "/complexes/extra-pictures",
        body
      );

      dispatch(
        addComplexExtraPicturesKeys({
          complexId: resp.data.updatedComplex?._id,
          extraPicturesKeys: resp.data.updatedComplex?.extraPicturesKeys ?? [],
        })
      );
      callback();
    } catch (error) {
      console.error({ error });
    }
  };

interface DeleteExtraPictureProps {
  body: { complexExtraPicturesKeys: string[]; complexId: string };
  callback: () => void;
}

export const deleteComplexExtraPicturesKeys =
  ({ body, callback = () => {} }: DeleteExtraPictureProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const formData = new FormData();
      formData.append("complexExtraPictures", body.complexExtraPicturesKeys);
      formData.append("complexId", body.complexId);

      const queryString = body.complexExtraPicturesKeys
        .map((key) => `complexExtraPicturesKeys=${encodeURIComponent(key)}`)
        .join("&");

      const resp = await replayAPI.delete<any>(
        `/complexes/extra-pictures?${queryString}&complexId=${body.complexId}`
      );

      dispatch(
        removeComplexExtraPicturesKeys({
          complexId: resp.data.updatedComplex?._id,
          keysToRemove: body.complexExtraPicturesKeys,
        })
      );
      dispatch(
        removeComplexExtraPicturesURLs({
          complexId: resp.data.updatedComplex?._id,
          keysToRemove: body.complexExtraPicturesKeys,
        })
      );
      callback();
    } catch (error) {
      console.error({ error });
    }
  };

export const deleteComplex =
  (complexId: string, callback: () => void = () => {}) =>
  async (dispatch: AppDispatch) => {
    try {
      await replayAPI.delete<DeleteComplexResponse>("/complexes", {
        data: { complexId },
      });

      dispatch(removeComplex(complexId));
      callback();
    } catch (error) {
      console.error({ error });
    }
  };

interface PostFootballFieldsProps {
  body: {
    fieldsAmounts: {
      five: {
        playersAmount: number;
        fieldsAmount: number;
      };
      seven: {
        playersAmount: number;
        fieldsAmount: number;
      };
      nine: {
        playersAmount: number;
        fieldsAmount: number;
      };
      eleven: {
        playersAmount: number;
        fieldsAmount: number;
      };
    };
    complexId: string;
  };
  callback?: () => void;
}

export const postFootballFields =
  ({ body, callback = () => {} }: PostFootballFieldsProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.post<PostMultipleFieldsResponse>(
        "/football-fields/by-number",
        body
      );
      dispatch(
        updateComplexFields({
          complexId: body.complexId,
          footballFields: resp.data.newFootballFields,
        })
      );

      callback();
    } catch (error) {
      console.error({ error });
    }
  };

export interface ScheduleParsed {
  _id?: string;
  closingTime: string;
  openingTime: string;
  sport: string;
  weekDays: number[];
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
    try {
      const resp = await replayAPI.post<PostMultipleSchedulesResponse>(
        "/complexes-schedules/multiple",
        body
      );
      dispatch(
        updateComplexSchedules({
          complexId: body.complexId,
          complexSchedules: resp.data.newComplexSchedules,
        })
      );

      callback();
    } catch (error) {
      console.error({ error });
    }
  };

export const putComplexSchedules =
  ({ body, callback = () => {} }: PostComplexSchedulesProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.put<PutMultipleSchedulesResponse>(
        "/complexes-schedules/multiple",
        body
      );
      dispatch(
        updateComplexSchedules({
          complexId: body.complexId,
          complexSchedules: resp.data.updatedComplexSchedules,
        })
      );

      callback();
    } catch (error) {
      console.error({ error });
    }
  };

interface DeleteComplexSchedulesProps {
  body: {
    complexId: string;
    schedulesIds: string[];
  };
  callback?: () => void;
}

export const deleteComplexSchedule =
  ({ body, callback = () => {} }: DeleteComplexSchedulesProps) =>
  async (dispatch: AppDispatch) => {
    try {
      const resp = await replayAPI.delete<DeleteScheduleResponse>(
        `/complexes-schedules?schedulesIds=${body.schedulesIds}`
      );

      dispatch(
        removeComplexSchedules({
          complexId: body.complexId,
          schedulesIds: resp.data.removedSchedules,
        })
      );

      callback();
    } catch (error) {
      console.error({ error });
    }
  };
