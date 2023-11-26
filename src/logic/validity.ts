import { GridCell, PuzzleGrid } from "../types/grid";
import { VALUES } from "./constants";

interface ValidityArgs {
  puzzleGrid: PuzzleGrid;
  emptyCell: GridCell;
  value: number;
}

export const isValidRow = ({
  puzzleGrid,
  emptyCell,
  value,
}: ValidityArgs): boolean => {
  return puzzleGrid[emptyCell.rowIndex].indexOf(value) === -1;
};

export const isValidColumn = ({
  puzzleGrid,
  emptyCell,
  value,
}: ValidityArgs): boolean => {
  return !puzzleGrid.some((row) => row[emptyCell.columnIndex] === value);
};

const getBoxCoordinate = (index: number) => index - (index % 3);

export const isValidBox = ({
  puzzleGrid,
  emptyCell,
  value,
}: ValidityArgs): boolean => {
  const boxStart: GridCell = {
    rowIndex: getBoxCoordinate(emptyCell.rowIndex),
    columnIndex: getBoxCoordinate(emptyCell.columnIndex),
  };

  return [0, 1, 2].every((rowOffset) => {
    return ![0, 1, 2].some((colOffset) => {
      return (
        puzzleGrid[boxStart.rowIndex + rowOffset][
          boxStart.columnIndex + colOffset
        ] === value
      );
    });
  });
};

export const isValid = (args: ValidityArgs) => {
  return isValidRow(args) && isValidColumn(args) && isValidBox(args);
};

export const getValidCellValues = (
  puzzleGrid: PuzzleGrid,
  emptyCell: GridCell
) => {
  return VALUES.reduce<number[]>((valid, value) => {
    if (isValid({ puzzleGrid, emptyCell, value })) {
      return [...valid, value];
    }

    return valid;
  }, []);
};
