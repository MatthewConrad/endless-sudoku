import { useMemo, useState } from "react";
import { CellValue, GridCell, GridState, PuzzleGrid } from "../types/grid";
import {
  areGridsEqual,
  clearCellState,
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
  const initialState = useMemo(
    () => getInitialGridState(initialGrid, solvedGrid),
    [initialGrid, solvedGrid]
  );

  const [gridState, setGridState] = useState<GridState>(initialState);

  const currentGrid = getPuzzleGridFromState(gridState);
  const isSolved = areGridsEqual(currentGrid, solvedGrid);

  const toggleCellCandidate = (candidateValue: CellValue, cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        toggleCellStateCandidate(candidateValue, getCellState(gs, cell))
      )
    );

  const setCellUserValue = (newValue: number, cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        setCellStateUserValue(newValue, getCellState(gs, cell))
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

  const clearCell = (cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        clearCellState(getCellState(gs, cell))
      )
    );

  const checkGrid = () =>
    setGridState((gs) => updateAllCells(gs, getCheckedCellState));

  const revealGrid = () =>
    setGridState((gs) => updateAllCells(gs, getRevealedCellState));

  const resetGrid = () => setGridState(initialState);

  return {
    gridState,
    currentGrid,
    isSolved,
    toggleCellCandidate,
    setCellUserValue,
    checkCell,
    revealCell,
    clearCell,
    checkGrid,
    revealGrid,
    resetGrid,
  };
};
