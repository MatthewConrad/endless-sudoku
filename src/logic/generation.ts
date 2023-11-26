import { GridCell, PuzzleGrid } from "../types/grid";
import { BLANK_GRID, FILL_LIMIT, VALUES } from "./constants";
import { cloneGrid, shuffle } from "./helpers";
import { isValid } from "./validity";

export const getNewGrid = () => cloneGrid(BLANK_GRID);

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
    console.log(`iteration ${counter} | placing ${value}`);

    if (counter > FILL_LIMIT) {
      throw new Error("Timeout while filling grid.");
    }

    if (isValid({ puzzleGrid: initialGrid, emptyCell, value })) {
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
