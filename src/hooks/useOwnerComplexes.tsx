import { useEffect, useState } from "react";
import { Complex, ComplexesResponse } from "../interfaces/complexes";
import axios from "axios";

export const useOwnerComplexes = (ownerId: string) => {
  const [ownerComplexes, setOwnerComplexes] = useState<Complex[]>();
  const [isLoading, setIsLoading] = useState(true);
  const getComplexes = async () => {
    const response = await axios.get<ComplexesResponse>(
      "http://192.168.100.178:3000/complexes",
      { params: { ownerId } }
    );
    setOwnerComplexes(response.data.complexes);
    setIsLoading(false);
  };
  useEffect(() => {
    getComplexes();
  }, []);

  return { ownerComplexes, isLoading };
};
