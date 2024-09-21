import { useRef } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";
import { useCursor } from "./hooks/useCursor";
import { Cell } from "./components/Cell";

function App() {
  const { playableGrid } = createNewGrid();
  const grid = useRef<PuzzleGrid>(playableGrid);

  const { cursor, onCellClick, onKeyDown, onKeyUp } = useCursor();

  return (
    <>
      <div>Candidate mode: {`${cursor.isCandidateMode}`}</div>
      <div
        className="grid"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      >
        {grid.current.map((row, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`} className="row">
              {row.map((val, colIndex) => {
                const isCurrentRow = cursor.rowIndex === rowIndex;
                const isCurrentColumn = cursor.columnIndex === colIndex;

                const isCellActive = isCurrentRow && isCurrentColumn;

                return (
                  <Cell
                    key={`${rowIndex},${colIndex}`}
                    grid={grid.current}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    value={val}
                    rowIndex={rowIndex}
                    columnIndex={colIndex}
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
