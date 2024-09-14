import { useState } from "react";
import { CellCandidates, CellValue } from "../types/grid";
import { DEFAULT_CANDIDATES } from "../logic/constants";

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<CellCandidates>({
    ...DEFAULT_CANDIDATES,
  });

  const toggleCandidate = (value: CellValue) =>
    setCandidates((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));

  const clearCandidates = () => setCandidates({ ...DEFAULT_CANDIDATES });

  return {
    candidates,
    toggleCandidate,
    clearCandidates,
  };
};
