import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./redux";

import { selectComplexes } from "../redux/slices/complexesSlice";
import { getComplexMainPicture } from "../redux/actions/complexes";

interface HookParams {
  complexId: string;
  mainPictureKey: string;
}

export const useComplexMainPicture = ({
  complexId,
  mainPictureKey,
}: HookParams) => {
  const [complexMainPicture, setComplexMainPicture] = useState<string>("");
  const dispatch = useAppDispatch();
  const { complexes } = useAppSelector(selectComplexes);

  const wantedComplex = complexes.find((complex) => complex._id === complexId);

  useEffect(() => {
    if (wantedComplex?.mainPictureURL) {
      console.log("entering here...");
      console.log(
        "franco the mainPictureURL --> ",
        JSON.stringify(wantedComplex.mainPictureURL, null, 4)
      );

      setComplexMainPicture(wantedComplex.mainPictureURL.imageURL);
    } else {
      dispatch(getComplexMainPicture({ complexId, mainPictureKey }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wantedComplex]);

  return {
    complexMainPicture,
  };
};
