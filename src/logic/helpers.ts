import { GridCell, PuzzleGrid } from "../types/grid";

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

export const getRelatedCells = ({
  rowIndex,
  columnIndex,
}: GridCell): GridCell[] => {
  const crossCells = Array(9)
    .fill(null)
    .reduce<GridCell[]>((crosses, _, index) => {
      const related = [];
      if (index !== columnIndex) {
        related.push({ rowIndex, columnIndex: index });
      }

      if (index !== rowIndex) {
        related.push({ rowIndex: index, columnIndex });
      }

      return [...crosses, ...related];
    }, []);

  const boxStartCell = getBoxStartCell({ rowIndex, columnIndex });
  const boxCells = [0, 1, 2].reduce<GridCell[]>((box, rowOffset) => {
    const rowCells = [0, 1, 2].reduce<GridCell[]>((row, colOffset) => {
      const boxRowIndex = boxStartCell.rowIndex + rowOffset;
      const boxColumnIndex = boxStartCell.columnIndex + colOffset;

      // already accounted for by crosses
      if (boxRowIndex === rowIndex || boxColumnIndex === columnIndex) {
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

  return [...crossCells, ...boxCells];
};
