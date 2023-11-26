import { PuzzleGrid } from "../types/grid";

export const BLANK_ROW = Array(9).fill(0);
export const BLANK_GRID: PuzzleGrid = Array(9)
  .fill(0)
  .map((_) => [...BLANK_ROW]);

export const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const FILL_LIMIT = 20000000;
export const POKE_LIMIT = 60000000;
