import {
  CellValue,
  GridCell,
  GridCellState,
  GridState,
  PuzzleGrid,
  RowState,
} from "../types/grid";
import { DEFAULT_CANDIDATES, MAX_INDEX, VALUES } from "./constants";
import { canPlaceValue } from "./validity";

/**
 * GRID GENERATION
 */

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

export const areGridsEqual = (a: PuzzleGrid, b: PuzzleGrid): boolean => {
  return !a.some((columns, rowIndex) =>
    columns.some((cell, colIndex) => cell !== b[rowIndex][colIndex])
  );
};

/**
 * GRID AND CELL STATE
 */

export const getCellCandidates = (
  puzzleGrid: PuzzleGrid,
  gridCell: GridCell
) => {
  return VALUES.reduce((candidates, value) => {
    const isCandidate = canPlaceValue({ puzzleGrid, gridCell, value });

    return { ...candidates, [value]: isCandidate };
  }, DEFAULT_CANDIDATES);
};

export const getInitialGridState = (
  initialGrid: PuzzleGrid,
  solvedGrid: PuzzleGrid
): GridState => {
  return initialGrid.reduce<GridState>((gridState, row, rowIndex) => {
    const rowState = row.reduce<RowState>((rs, initialValue, columnIndex) => {
      const cellState: GridCellState = {
        rowIndex,
        columnIndex,
        value: solvedGrid[rowIndex][columnIndex],
        userValue: initialValue,
        candidates: getCellCandidates(initialGrid, { rowIndex, columnIndex }),
        userCandidates: { ...DEFAULT_CANDIDATES },
        isPrefilled: initialValue !== 0,
        isConfirmed: false,
        isIncorrect: false,
      };
      return {
        ...rs,
        [columnIndex]: cellState,
      };
    }, {});

    return {
      ...gridState,
      [rowIndex]: rowState,
    };
  }, {});
};

export const getPuzzleGridFromState = (gridState: GridState): PuzzleGrid => {
  return Object.values(gridState).map((rowState) =>
    Object.values(rowState).map((cellState) => cellState.userValue)
  );
};

export const getCellState = (
  gridState: GridState,
  { rowIndex, columnIndex }: GridCell
): GridCellState => {
  const rowState = gridState[rowIndex];
  return rowState[columnIndex];
};

export const getGridStateWithUpdatedCell = (
  gridState: GridState,
  { rowIndex, columnIndex }: GridCell,
  updatedCellState: GridCellState
): GridState => ({
  ...gridState,
  [rowIndex]: {
    ...gridState[rowIndex],
    [columnIndex]: { ...updatedCellState },
  },
});

export const toggleCellStateUserCandidate = (
  candidateValue: CellValue,
  { userCandidates, ...cellState }: GridCellState
) => ({
  ...cellState,
  userValue: 0,
  userCandidates: {
    ...userCandidates,
    [candidateValue]: !userCandidates[candidateValue],
  },
});

export const setCellStateCandidates = (
  cellState: GridCellState,
  puzzleGrid: PuzzleGrid
): GridCellState => ({
  ...cellState,
  candidates: getCellCandidates(puzzleGrid, cellState),
});

export const setCellStateUserValue = (
  newValue: number,
  cellState: GridCellState
) => {
  const { isConfirmed, isPrefilled, userValue } = cellState;

  if (isConfirmed || isPrefilled || userValue === newValue) {
    return cellState;
  }

  return {
    ...cellState,
    userValue: newValue,
  };
};

export const getCheckedCellState = (
  cellState: GridCellState
): GridCellState => {
  const { value, userValue, isPrefilled } = cellState;

  if (isPrefilled || !userValue) {
    return cellState;
  }

  const isConfirmed = value === userValue;

  return { ...cellState, isConfirmed, isIncorrect: !isConfirmed };
};

export const getRevealedCellState = ({
  value,
  isPrefilled,
  ...cellState
}: GridCellState): GridCellState => ({
  ...cellState,
  value,
  userValue: value,
  isPrefilled,
  isConfirmed: !isPrefilled && true,
  isIncorrect: false,
});

export const clearCellState = (cellState: GridCellState): GridCellState => {
  const { isPrefilled, isConfirmed } = cellState;

  if (isPrefilled || isConfirmed) {
    return cellState;
  }

  return {
    ...cellState,
    userValue: 0,
    userCandidates: { ...DEFAULT_CANDIDATES },
  };
};

export const updateAllCells = (
  gridState: GridState,
  cellStateUpdateFn: (cellState: GridCellState) => GridCellState
): GridState => {
  return Object.fromEntries(
    Object.entries(gridState).map(([rowIndex, rowState]) => {
      const updatedRowState = Object.fromEntries(
        Object.entries(rowState).map(([columnIndex, cellState]) => {
          return [columnIndex, cellStateUpdateFn(cellState)];
        })
      );

      return [rowIndex, updatedRowState];
    })
  );
};
