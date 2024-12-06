export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type PuzzleGrid = number[][];

export interface GridCell {
  rowIndex: number;
  columnIndex: number;
}

export interface GridCursor extends GridCell {
  isCandidateMode: boolean;
}

export interface PopulatedCell extends GridCell {
  value: number;
}

export type CellCandidates = Record<CellValue, boolean>;

export interface GridCellState extends PopulatedCell {
  userValue: number;
  candidates: CellCandidates;
  userCandidates: CellCandidates;
  isPrefilled: boolean;
  isConfirmed: boolean;
  isIncorrect: boolean;
}

export type RowState = Record<number, GridCellState>;
export type GridState = Record<number, RowState>;
