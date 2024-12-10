import { useState } from "react";

import { PuzzleGrid } from "../types/grid";
import { isCellValueValid } from "../logic/validity";
import { useCursor } from "../hooks/useCursor";
import { useGridState } from "../hooks/useGridState";
import { Cell } from "../components/Cell";

interface GameGridProps {
  initialGrid: PuzzleGrid;
  solvedGrid: PuzzleGrid;
  onStartNewGrid: (isSolved: boolean) => void;
}

export const GameGrid = ({
  initialGrid,
  solvedGrid,
  onStartNewGrid,
}: GameGridProps) => {
  const {
    gridState,
    currentGrid,
    isSolved,
    toggleCellUserCandidate,
    setCellUserValue,
    checkCell,
    revealCell,
    clearCell,
    checkGrid,
    revealGrid,
    resetGrid,
  } = useGridState({
    initialGrid,
    solvedGrid,
  });

  const { cursor, onToggleCandidateMode, onCellClick, onKeyDown, onKeyUp } =
    useCursor({
      onToggleCandidate: toggleCellUserCandidate,
      onSetCellValue: setCellUserValue,
      onClearCell: clearCell,
    });

  const [isAutoCandidate, setIsAutoCandidate] = useState(false);

  return (
    <>
      <div>Is solved: {`${isSolved}`}</div>
      <div>Candidate mode: {`${cursor.isCandidateMode}`}</div>
      <button onClick={onToggleCandidateMode}>Toggle candidate mode</button>
      <button onClick={() => setIsAutoCandidate((a) => !a)}>
        Toggle auto-candidate
      </button>
      <button onClick={() => checkCell(cursor)}>Check current cell</button>
      <button onClick={() => revealCell(cursor)}>Reveal current cell</button>
      <button onClick={checkGrid}>Check grid</button>
      <button onClick={revealGrid}>Reveal grid</button>
      <button onClick={resetGrid}>Reset grid</button>
      <button onClick={() => onStartNewGrid(isSolved)}>Start new</button>
      <div
        className="grid"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        {Object.entries(gridState).map(([rowIndex, rowState]) => {
          return (
            <div key={`row-${rowIndex}`} className="row">
              {Object.entries(rowState).map(([colIndex, cellState]) => {
                const isCurrentRow = cursor.rowIndex === +rowIndex;
                const isCurrentColumn = cursor.columnIndex === +colIndex;

                const isCellActive = isCurrentRow && isCurrentColumn;

                const isCellInvalid = !!(
                  cellState.userValue &&
                  !isCellValueValid({
                    puzzleGrid: currentGrid,
                    gridCell: cellState,
                    value: cellState.userValue,
                  })
                );

                return (
                  <Cell
                    key={`${rowIndex},${colIndex}`}
                    {...cellState}
                    onCellClick={() => onCellClick(+rowIndex, +colIndex)}
                    onCandidateClick={(candidateValue) =>
                      toggleCellUserCandidate(candidateValue, cellState)
                    }
                    rowIndex={+rowIndex}
                    columnIndex={+colIndex}
                    isActive={isCellActive}
                    isInvalid={isCellInvalid}
                    isAutoCandidate={isAutoCandidate}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
