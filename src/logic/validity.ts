import { GridCell, PuzzleGrid } from "../types/grid";

interface ValidityArgs {
  puzzleGrid: PuzzleGrid;
  gridCell: GridCell;
  value: number;
}

export const canPlaceValueInRow = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  return puzzleGrid[gridCell.rowIndex].indexOf(value) === -1;
};

export const isValueValidInRow = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  if (!value) {
    return true;
  }

  return !puzzleGrid[gridCell.rowIndex].some(
    (cellVal, columnIndex) =>
      gridCell.columnIndex !== columnIndex && value === cellVal
  );
};

export const canPlaceValueInColumn = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  return !puzzleGrid.some((row) => row[gridCell.columnIndex] === value);
};

export const isValueValidInColumn = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  if (!value) {
    return true;
  }

  return !puzzleGrid.some(
    (row, rowIndex) =>
      gridCell.rowIndex !== rowIndex && value === row[gridCell.columnIndex]
  );
};

const getBoxCoordinate = (index: number) => index - (index % 3);

export const canPlaceValueInBox = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  const boxStart: GridCell = {
    rowIndex: getBoxCoordinate(gridCell.rowIndex),
    columnIndex: getBoxCoordinate(gridCell.columnIndex),
  };

  return [0, 1, 2].every((rowOffset) => {
    return ![0, 1, 2].some((colOffset) => {
      const boxRowIndex = boxStart.rowIndex + rowOffset;
      const boxColumnIndex = boxStart.columnIndex + colOffset;

      const boxValue = puzzleGrid[boxRowIndex][boxColumnIndex];

      return boxValue === value;
    });
  });
};

export const isValueValidInBox = ({
  puzzleGrid,
  gridCell,
  value,
}: ValidityArgs): boolean => {
  if (!value) {
    return true;
  }
  const boxStart: GridCell = {
    rowIndex: getBoxCoordinate(gridCell.rowIndex),
    columnIndex: getBoxCoordinate(gridCell.columnIndex),
  };

  return [0, 1, 2].every((rowOffset) => {
    return ![0, 1, 2].some((colOffset) => {
      const boxRowIndex = boxStart.rowIndex + rowOffset;
      const boxColumnIndex = boxStart.columnIndex + colOffset;

      const isSameCell =
        gridCell.rowIndex === boxRowIndex &&
        gridCell.columnIndex === boxColumnIndex;

      const boxValue = puzzleGrid[boxRowIndex][boxColumnIndex];

      return !isSameCell && boxValue === value;
    });
  });
};

export const canPlaceValue = (args: ValidityArgs) =>
  canPlaceValueInRow(args) &&
  canPlaceValueInColumn(args) &&
  canPlaceValueInBox(args);

export const isValueValid = (args: ValidityArgs) =>
  isValueValidInRow(args) &&
  isValueValidInColumn(args) &&
  isValueValidInBox(args);
