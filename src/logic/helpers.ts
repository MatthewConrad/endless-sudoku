import { GridCell, PuzzleGrid } from "../types/grid";
import { MAX_INDEX } from "./constants";

export const addCells = (a: GridCell, b: GridCell): GridCell => ({
  rowIndex: Math.min(Math.max(0, a.rowIndex + b.rowIndex), MAX_INDEX),
  columnIndex: Math.min(Math.max(0, a.columnIndex + b.columnIndex), MAX_INDEX),
});

export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];

  shuffled.forEach((_, index) => {
    const swapIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  });

  return shuffled;
};

export const getRandomIndex = (): number => Math.floor(Math.random() * 9);

export const getRandomCell = (): GridCell => ({
  rowIndex: getRandomIndex(),
  columnIndex: getRandomIndex(),
});

export const cloneGrid = (puzzleGrid: PuzzleGrid): PuzzleGrid => {
  return puzzleGrid.map((row) => [...row]);
};
