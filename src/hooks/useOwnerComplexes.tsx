import { useEffect, useState } from "react";
import { Complex, ComplexesResponse } from "../interfaces/complexes";
import replayAPI from "../api/api";

export const useOwnerComplexes = (ownerId: string) => {
  const [ownerComplexes, setOwnerComplexes] = useState<Complex[]>();
  const [isLoading, setIsLoading] = useState(true);
  const getComplexes = async () => {
    const response = await replayAPI.get<ComplexesResponse>("/complexes", {
      params: { ownerId },
    });
    setOwnerComplexes(response.data.complexes);
    setIsLoading(false);
  };
  useEffect(() => {
    getComplexes();
  }, []);

  return { ownerComplexes, isLoading };
};
