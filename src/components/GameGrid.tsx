import { useState } from "react";

import { PuzzleGrid } from "../types/grid";
import { isCellValueValid } from "../logic/validity";
import { useCursor } from "../hooks/useCursor";
import { useGridState } from "../hooks/useGridState";
import { Cell } from "../components/Cell";
import { GameControls } from "./GameControls";
import { getHint } from "../logic/hints";

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
    <div onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
      <div>
        <button onClick={() => checkCell(cursor)}>Check current cell</button>
        <button onClick={() => revealCell(cursor)}>Reveal current cell</button>
        <button onClick={checkGrid}>Check grid</button>
        <button onClick={revealGrid}>Reveal grid</button>
        <button onClick={resetGrid}>Reset grid</button>
        <button onClick={() => onStartNewGrid(isSolved)}>Start new</button>
        <button
          onClick={() => {
            const hintCell = getHint(gridState);
            if (hintCell) {
              onCellClick(hintCell.rowIndex, hintCell.columnIndex);
            }
          }}
        >
          Hint
        </button>
      </div>
      <div className="grid" tabIndex={0}>
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
      <GameControls
        isCandidateMode={cursor.isCandidateMode}
        onToggleCandidateMode={onToggleCandidateMode}
        isAutoCondidate={isAutoCandidate}
        onToggleAutoCandidate={() => setIsAutoCandidate((a) => !a)}
        onClickValue={(v) => {
          if (cursor.isCandidateMode) {
            toggleCellUserCandidate(v, cursor);
          } else {
            setCellUserValue(v, cursor);
          }
        }}
      />
    </div>
  );
};
