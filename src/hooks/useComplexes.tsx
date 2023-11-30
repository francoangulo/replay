import { useEffect, useState } from "react";
import { Complex, ComplexesResponse } from "../interfaces/complexes";
import replayAPI from "../api/api";

export const useComplexes = () => {
  const [complexes, setComplexes] = useState<Complex[]>();
  const getComplexes = async () => {
    const response = await replayAPI.get<ComplexesResponse>("/complexes");
    setComplexes(response.data.complexes);
  };
  useEffect(() => {
    getComplexes();
  }, []);

  return { complexes };
};
