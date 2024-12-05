import { useState } from "react";
import { CellValue, GridCell, GridState, PuzzleGrid } from "../types/grid";
import {
  clearCellStateCandidates,
  getCellState,
  getCheckedCellState,
  getGridStateWithUpdatedCell,
  getInitialGridState,
  getPuzzleGridFromState,
  getRevealedCellState,
  setCellStateUserValue,
  toggleCellStateCandidate,
  updateAllCells,
} from "../logic/helpers";

interface UseGridStateArgs {
  initialGrid: PuzzleGrid;
  solvedGrid: PuzzleGrid;
}

export const useGridState = ({ initialGrid, solvedGrid }: UseGridStateArgs) => {
  const [gridState, setGridState] = useState<GridState>(
    getInitialGridState(initialGrid, solvedGrid)
  );

  const currentGrid = getPuzzleGridFromState(gridState);

  const toggleCellCandidate = (candidateValue: CellValue, cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        toggleCellStateCandidate(candidateValue, getCellState(gs, cell))
      )
    );

  const clearCellCandidates = (cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        clearCellStateCandidates(getCellState(gs, cell))
      )
    );

  const setCellUserValue = (newValue: CellValue, cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        setCellStateUserValue(newValue, getCellState(gs, cell), currentGrid)
      )
    );

  const checkCell = (cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        getCheckedCellState(getCellState(gs, cell))
      )
    );

  const revealCell = (cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        getRevealedCellState(getCellState(gs, cell))
      )
    );

  const checkGrid = () =>
    setGridState((gs) => updateAllCells(gs, getCheckedCellState));

  const revealGrid = () =>
    setGridState((gs) => updateAllCells(gs, getRevealedCellState));

  const resetGrid = () =>
    setGridState(getInitialGridState(initialGrid, solvedGrid));

  return {
    gridState,
    toggleCellCandidate,
    toggleCellStateCandidate,
    clearCellCandidates,
    setCellUserValue,
    checkCell,
    revealCell,
    checkGrid,
    revealGrid,
    resetGrid,
  };
};
