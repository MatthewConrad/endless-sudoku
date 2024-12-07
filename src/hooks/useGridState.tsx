import { useMemo, useState } from "react";
import { CellValue, GridCell, GridState, PuzzleGrid } from "../types/grid";
import {
  clearCellState,
  getCellState,
  getCheckedCellState,
  getGridStateWithUpdatedCell,
  getInitialGridState,
  getPuzzleGridFromState,
  getRevealedCellState,
  setCellStateCandidates,
  setCellStateUserValue,
  toggleCellStateUserCandidate,
  updateAllCells,
  updateRelatedCells,
} from "../logic/state";
import { areGridsEqual } from "../logic/helpers";

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

  const toggleCellUserCandidate = (candidateValue: CellValue, cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        toggleCellStateUserCandidate(candidateValue, getCellState(gs, cell))
      )
    );

  const setCellUserValue = (newValue: number, cell: GridCell) =>
    setGridState((gs) => {
      const gridWithUpdatedCellValue = getGridStateWithUpdatedCell(
        gs,
        cell,
        setCellStateUserValue(newValue, getCellState(gs, cell))
      );

      return updateRelatedCells(cell, gridWithUpdatedCellValue, (cellState) =>
        setCellStateCandidates(
          cellState,
          getPuzzleGridFromState(gridWithUpdatedCellValue)
        )
      );
    });

  const checkCell = (cell: GridCell) =>
    setGridState((gs) =>
      getGridStateWithUpdatedCell(
        gs,
        cell,
        getCheckedCellState(getCellState(gs, cell))
      )
    );

  const revealCell = (cell: GridCell) =>
    setGridState((gs) => {
      const gridWithUpdatedCellValue = getGridStateWithUpdatedCell(
        gs,
        cell,
        getRevealedCellState(getCellState(gs, cell))
      );

      return updateRelatedCells(cell, gridWithUpdatedCellValue, (cellState) =>
        setCellStateCandidates(
          cellState,
          getPuzzleGridFromState(gridWithUpdatedCellValue)
        )
      );
    });

  const clearCell = (cell: GridCell) =>
    setGridState((gs) => {
      const gridWithUpdatedCellValue = getGridStateWithUpdatedCell(
        gs,
        cell,
        clearCellState(getCellState(gs, cell))
      );

      return updateRelatedCells(cell, gridWithUpdatedCellValue, (cellState) =>
        setCellStateCandidates(
          cellState,
          getPuzzleGridFromState(gridWithUpdatedCellValue)
        )
      );
    });

  const checkGrid = () =>
    setGridState((gs) => updateAllCells(gs, getCheckedCellState));

  const revealGrid = () =>
    setGridState((gs) => updateAllCells(gs, getRevealedCellState));

  const resetGrid = () => setGridState(initialState);

  return {
    gridState,
    currentGrid,
    isSolved,
    toggleCellUserCandidate,
    setCellUserValue,
    checkCell,
    revealCell,
    clearCell,
    checkGrid,
    revealGrid,
    resetGrid,
  };
};
