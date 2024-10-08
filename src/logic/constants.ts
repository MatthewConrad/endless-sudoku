import { CellCandidates, CellValue, GridCell, PuzzleGrid } from "../types/grid";

export const BLANK_ROW = Array(9).fill(0);
export const BLANK_GRID: PuzzleGrid = Array(9)
  .fill(0)
  .map((_) => [...BLANK_ROW]);

export const MAX_INDEX = 8;

export const VALUES: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const FILL_LIMIT = 20000000;
export const POKE_LIMIT = 60000000;

export const DEFAULT_CANDIDATES: CellCandidates = VALUES.reduce<
  Record<number, boolean>
>((candidates, val) => ({ ...candidates, [val]: false }), {}) as CellCandidates;

export const ARROW_DIFFS: Record<string, GridCell> = {
  ArrowUp: { rowIndex: -1, columnIndex: 0 },
  ArrowDown: { rowIndex: 1, columnIndex: 0 },
  ArrowLeft: { rowIndex: 0, columnIndex: -1 },
  ArrowRight: { rowIndex: 0, columnIndex: 1 },
};
