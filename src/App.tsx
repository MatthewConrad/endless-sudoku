import { useRef } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";
import { useCursor } from "./hooks/useCursor";
import { Cell } from "./components/Cell";
import { useGridState } from "./hooks/useGridState";
import { isValueValid } from "./logic/validity";

const { playableGrid, filledGrid } = createNewGrid();

function App() {
  const initialGrid = useRef<PuzzleGrid>(playableGrid);
  const solvedGrid = useRef<PuzzleGrid>(filledGrid);

  const {
    gridState,
    currentGrid,
    isSolved,
    toggleCellCandidate,
    setCellUserValue,
    checkCell,
    revealCell,
    clearCell,
    checkGrid,
    revealGrid,
    resetGrid,
  } = useGridState({
    initialGrid: initialGrid.current,
    solvedGrid: solvedGrid.current,
  });
  const { cursor, onToggleCandidateMode, onCellClick, onKeyDown, onKeyUp } =
    useCursor({
      onToggleCandidate: toggleCellCandidate,
      onSetCellValue: setCellUserValue,
      onClearCell: clearCell,
    });

  return (
    <>
      <div>Is solved: {`${isSolved}`}</div>
      <div>Candidate mode: {`${cursor.isCandidateMode}`}</div>
      <button onClick={onToggleCandidateMode}>Toggle candidate mode</button>
      <button onClick={() => checkCell(cursor)}>Check current cell</button>
      <button onClick={() => revealCell(cursor)}>Reveal current cell</button>
      <button onClick={checkGrid}>Check grid</button>
      <button onClick={revealGrid}>Reveal grid</button>
      <button onClick={resetGrid}>Reset grid</button>
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
                  !isValueValid({
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
                      toggleCellCandidate(candidateValue, cellState)
                    }
                    rowIndex={+rowIndex}
                    columnIndex={+colIndex}
                    isActive={isCellActive}
                    isInvalid={isCellInvalid}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
