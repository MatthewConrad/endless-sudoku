export type PuzzleGrid = number[][];

export interface GridCell {
  rowIndex: number;
  columnIndex: number;
}

export interface PopulatedCell extends GridCell {
  value: number;
}
