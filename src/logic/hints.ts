import { CellValue, GridCell, GridState } from "../types/grid";
import { VALUES } from "./constants";
import {
  filterEmptyGridCells,
  findEmptyGridCell,
  getCandidateCount,
  getRelatedBoxCells,
  getRelatedCrossCells,
} from "./helpers";

type GetGridCellFn = (gs: GridState) => GridCell | undefined;

export const getNakedSingleCell: GetGridCellFn = (gridState) =>
  findEmptyGridCell(gridState, (cellState) => {
    return Object.values(cellState.candidates).filter(Boolean).length === 1;
  });

const cellIncludesCandidate = (
  { rowIndex, columnIndex }: GridCell,
  gridState: GridState,
  candidateValue: CellValue
) => {
  const { isPrefilled, isConfirmed, userValue, candidates } =
    gridState[rowIndex][columnIndex];
  if (isPrefilled || isConfirmed || userValue) {
    return false;
  }
  return candidates[candidateValue];
};

export const getHiddenSingleCell: GetGridCellFn = (gridState) => {
  const hiddenSingles = [
    ...filterEmptyGridCells(gridState, (cellState) => {
      const rowCells = getRelatedCrossCells(cellState, "row");
      const columnCells = getRelatedCrossCells(cellState, "column");
      const boxCells = getRelatedBoxCells(cellState, true);

      return VALUES.some((val) => {
        if (!cellState.candidates[val]) {
          return false;
        }

        const predicate = (cell: GridCell) =>
          cellIncludesCandidate(cell, gridState, val);

        return (
          !rowCells.some(predicate) ||
          !columnCells.some(predicate) ||
          !boxCells.some(predicate)
        );
      });
    }),
  ];

  if (hiddenSingles.length === 0) {
    return;
  } else if (hiddenSingles.length === 1) {
    return hiddenSingles[0];
  }

  const sorted = [...hiddenSingles].sort(
    (a, b) => getCandidateCount(a) - getCandidateCount(b)
  );

  return sorted[0];
};

export const getHint: GetGridCellFn = (gridState) => {
  return getNakedSingleCell(gridState) || getHiddenSingleCell(gridState);
};
