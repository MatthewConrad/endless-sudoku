export type CellValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type PuzzleGrid = number[][];

export interface GridCell {
  rowIndex: number;
  columnIndex: number;
}

export interface PopulatedCell extends GridCell {
  value: number;
}

export type CellCandidates = Record<CellValue, boolean>;
