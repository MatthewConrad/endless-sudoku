import { GridCell, PopulatedCell, PuzzleGrid } from "../types/grid";
import { BLANK_GRID, FILL_LIMIT, VALUES } from "./constants";
import { cloneGrid, getRandomCell, shuffle } from "./helpers";
import { canPlaceValue } from "./validity";

export const getBlankGrid = () => cloneGrid(BLANK_GRID);

export const getNextEmptyCell = (puzzleGrid: PuzzleGrid) => {
  const emptyCell: GridCell = { rowIndex: -1, columnIndex: -1 };

  emptyCell.rowIndex = puzzleGrid.findIndex((row) => {
    const columnIndex = row.findIndex((val) => val === 0);

    emptyCell.columnIndex = columnIndex;
    return columnIndex > -1;
  });

  return emptyCell;
};

let counter = 0;
export const fillGrid = (puzzleGrid: PuzzleGrid): PuzzleGrid | undefined => {
  const emptyCell = getNextEmptyCell(puzzleGrid);
  const { rowIndex, columnIndex } = emptyCell;

  if (columnIndex === -1 && rowIndex === -1) {
    return puzzleGrid;
  }

  const initialGrid = cloneGrid(puzzleGrid);

  for (const value of shuffle(VALUES)) {
    counter++;

    if (counter > FILL_LIMIT) {
      throw new Error("Timeout while filling grid.");
    }

    if (
      canPlaceValue({ puzzleGrid: initialGrid, gridCell: emptyCell, value })
    ) {
      initialGrid[rowIndex][columnIndex] = value;

      const nextGrid = fillGrid(initialGrid);
      if (nextGrid) {
        return nextGrid;
      } else {
        initialGrid[rowIndex][columnIndex] = 0;
      }
    }
  }

  return undefined;
};

export const makeGridPlayable = (
  puzzleGrid: PuzzleGrid,
  numEmptyCells: number
) => {
  const removedCells: PopulatedCell[] = [];
  const playableGrid = cloneGrid(puzzleGrid);

  while (removedCells.length < numEmptyCells) {
    const { rowIndex, columnIndex } = getRandomCell();

    if (playableGrid[rowIndex][columnIndex] !== 0) {
      const value = playableGrid[rowIndex][columnIndex];
      removedCells.push({ rowIndex, columnIndex, value });

      playableGrid[rowIndex][columnIndex] = 0;

      if (!fillGrid(playableGrid)) {
        removedCells.pop();
        playableGrid[rowIndex][columnIndex] = value;
      }
    }
  }

  return { playableGrid, removedCells };
};

export const createNewGrid = (): {
  playableGrid: PuzzleGrid;
  removedCells: PopulatedCell[];
  filledGrid: PuzzleGrid;
} => {
  counter = 0;

  try {
    const filledGrid = fillGrid(getBlankGrid());

    if (filledGrid) {
      return { ...makeGridPlayable(filledGrid, 50), filledGrid };
    } else {
      throw new Error("Failed to make filled grid.");
    }
  } catch (_e) {
    return createNewGrid();
  }
};
