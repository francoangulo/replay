import { useEffect, useState } from "react";
import { Complex, ComplexesResponse } from "../interfaces/complexes";
import axios from "axios";

export const useComplexes = () => {
  const [complexes, setComplexes] = useState<Complex[]>();
  const getComplexes = async () => {
    const response = await axios.get<ComplexesResponse>(
      "http://192.168.100.178:3000/complexes"
    );
    setComplexes(response.data.complexes);
  };
  useEffect(() => {
    getComplexes();
  }, []);

  return { complexes };
};
