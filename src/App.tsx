import { useRef } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";
import { useCursor } from "./hooks/useCursor";
import { Cell } from "./components/Cell";
import { useGridState } from "./hooks/useGridState";

function App() {
  const { playableGrid, filledGrid } = createNewGrid();
  const initialGrid = useRef<PuzzleGrid>(playableGrid);
  const solvedGrid = useRef<PuzzleGrid>(filledGrid);

  const { gridState, toggleCellCandidate, setCellUserValue } = useGridState({
    initialGrid: initialGrid.current,
    solvedGrid: solvedGrid.current,
  });
  const { cursor, onCellClick, onKeyDown, onKeyUp } = useCursor({
    onToggleCandidate: toggleCellCandidate,
    onSetCellValue: setCellUserValue,
  });

  return (
    <>
      <div>Candidate mode: {`${cursor.isCandidateMode}`}</div>
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
                    isCellActive={isCellActive}
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
