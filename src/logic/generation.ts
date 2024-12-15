import { GridCell, PopulatedCell, PuzzleGrid } from "../types/grid";
import { BLANK_GRID, FILL_LIMIT, VALUES } from "./constants";
import { areGridsEqual, cloneGrid, getRandomCell, shuffle } from "./helpers";
import { isCellValueValid } from "./validity";

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
      isCellValueValid({ puzzleGrid: initialGrid, gridCell: emptyCell, value })
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

      const [possible1, possible2] = [
        fillGrid(playableGrid),
        fillGrid(playableGrid),
      ];

      if (!possible1 || !possible2 || !areGridsEqual(possible1, possible2)) {
        removedCells.pop();
        playableGrid[rowIndex][columnIndex] = value;
      }
    }
  }

  return { playableGrid, removedCells };
};

export const createNewGrid = (
  seed?: PuzzleGrid
): {
  playableGrid: PuzzleGrid;
  removedCells: PopulatedCell[];
  filledGrid: PuzzleGrid;
} => {
  counter = 0;

  try {
    const filledGrid = fillGrid(cloneGrid(seed ?? BLANK_GRID));

    if (filledGrid) {
      return { ...makeGridPlayable(filledGrid, 50), filledGrid };
    } else {
      throw new Error("Failed to make filled grid.");
    }
  } catch (_e) {
    return createNewGrid();
  }
};

// 00 01 02 03 04 05 06 07 08
// 10 11 12 13 14 15 16 17 18
// 20 21 22 23 24 25 26 27 28
// 30 31 32 33 34 35 36 37 38
// 40 41 42 43 44 45 46 47 48
// 50 51 52 53 54 55 56 57 58
// 60 61 62 63 64 65 66 67 68
// 70 71 72 73 74 75 76 77 78
// 80 81 82 83 84 85 86 87 88

// 06 07 08 -> 60 61 62
// 16 17 18 -> 70 71 72
// 26 27 28 -> 80 81 82

// row + 6, column - 6

// 66 67 68 -> 00 01 02
// 76 77 78 -> 10 11 12
// 86 87 88 -> 20 21 22

// row - 6, column - 6
