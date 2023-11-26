import { GridCell, PuzzleGrid } from "../types/grid";

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
