import { GridCell, GridCellState, GridState, PuzzleGrid } from "../types/grid";
import { BLANK_GRID } from "./constants";

/**
 * GRID GENERATION
 */

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

export const filterByEmptyGridCell = (
  cellState: GridCellState,
  predicate: (cellState: GridCellState) => boolean
): boolean => {
  if (cellState.isPrefilled || cellState.isConfirmed || cellState.userValue) {
    return false;
  }

  return predicate(cellState);
};

export const findEmptyGridCell = (
  gridState: GridState,
  predicate: (cellState: GridCellState) => boolean
): GridCell | undefined => {
  const foundCell: GridCell = { rowIndex: -1, columnIndex: -1 };

  foundCell.rowIndex = Object.values(gridState).findIndex((row) => {
    const columnIndex = Object.values(row).findIndex((cellState) =>
      filterByEmptyGridCell(cellState, predicate)
    );

    foundCell.columnIndex = columnIndex;
    return columnIndex > -1;
  });

  if (foundCell.rowIndex > -1 && foundCell.columnIndex > -1) {
    return foundCell;
  }

  return;
};

export const filterEmptyGridCells = (
  gridState: GridState,
  predicate: (cellState: GridCellState) => boolean
): GridCellState[] => {
  return Object.values(gridState).reduce<GridCellState[]>(
    (matchedCells, row) => {
      const columnMatches = Object.values(row).reduce<GridCellState[]>(
        (colMatchedCells, cellState) => {
          if (filterByEmptyGridCell(cellState, predicate)) {
            return [...colMatchedCells, cellState];
          }

          return colMatchedCells;
        },
        []
      );
      return [...matchedCells, ...columnMatches];
    },
    []
  );
};

export const cloneGrid = (puzzleGrid: PuzzleGrid): PuzzleGrid => {
  return puzzleGrid.map((row) => [...row]);
};

export const areGridsEqual = (a: PuzzleGrid, b: PuzzleGrid): boolean => {
  return !a.some((columns, rowIndex) =>
    columns.some((cell, colIndex) => cell !== b[rowIndex][colIndex])
  );
};

const getBoxStartIndex = (index: number) => index - (index % 3);
const getBoxStartCell = ({ rowIndex, columnIndex }: GridCell): GridCell => ({
  rowIndex: getBoxStartIndex(rowIndex),
  columnIndex: getBoxStartIndex(columnIndex),
});

export const getRelatedCrossCells = (
  { rowIndex, columnIndex }: GridCell,
  direction?: "row" | "column"
): GridCell[] => {
  return Array(9)
    .fill(null)
    .reduce<GridCell[]>((crosses, _, index) => {
      const related = [];
      if (index !== columnIndex && direction !== "column") {
        related.push({ rowIndex, columnIndex: index });
      }

      if (index !== rowIndex && direction !== "row") {
        related.push({ rowIndex: index, columnIndex });
      }

      return [...crosses, ...related];
    }, []);
};

export const getRelatedBoxCells = (
  { rowIndex, columnIndex }: GridCell,
  includeCrosses?: boolean
): GridCell[] => {
  const boxStartCell = getBoxStartCell({ rowIndex, columnIndex });
  return [0, 1, 2].reduce<GridCell[]>((box, rowOffset) => {
    const rowCells = [0, 1, 2].reduce<GridCell[]>((row, colOffset) => {
      const boxRowIndex = boxStartCell.rowIndex + rowOffset;
      const boxColumnIndex = boxStartCell.columnIndex + colOffset;

      if (
        !includeCrosses &&
        (boxRowIndex === rowIndex || boxColumnIndex === columnIndex)
      ) {
        return [...row];
      }

      return [
        ...row,
        {
          rowIndex: boxRowIndex,
          columnIndex: boxColumnIndex,
        },
      ];
    }, []);
    return [...box, ...rowCells];
  }, []);
};

export const getRelatedCells = ({
  rowIndex,
  columnIndex,
}: GridCell): GridCell[] => {
  const crossCells = getRelatedCrossCells({ rowIndex, columnIndex });
  const boxCells = getRelatedBoxCells({ rowIndex, columnIndex });

  return [...crossCells, ...boxCells];
};

export const getCandidateCount = ({ candidates }: GridCellState) =>
  Object.values(candidates).filter(Boolean).length;

export const getSeedGrid = (lastGrid: PuzzleGrid, side: "top" | "bottom") => {
  const initialGrid = cloneGrid(BLANK_GRID);

  const sourceRowIndexes = side === "top" ? [0, 1, 2] : [6, 7, 8];

  sourceRowIndexes.forEach((sourceRowIndex) => {
    [6, 7, 8].forEach((sourceColumnIndex) => {
      const rowDiff = side === "top" ? -6 : 6;
      const rowIndex = sourceRowIndex - rowDiff;
      const columnIndex = sourceColumnIndex - 6;

      initialGrid[rowIndex][columnIndex] =
        lastGrid[sourceRowIndex][sourceColumnIndex];
    });
  });

  return initialGrid;
};
