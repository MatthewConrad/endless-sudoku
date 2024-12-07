import { GridCell, PuzzleGrid } from "../types/grid";
import { getRelatedCells } from "./helpers";

interface ValidityArgs {
  puzzleGrid: PuzzleGrid;
  gridCell: GridCell;
  value: number;
}

export const isCellValueValid = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs) => {
  const relatedCells = getRelatedCells(gridCell);

  return !relatedCells.some(({ rowIndex, columnIndex }) => {
    const gridValue = puzzleGrid[rowIndex][columnIndex];

    return gridValue === value;
  });
};
