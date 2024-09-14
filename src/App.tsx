import { useRef } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";
import { useCursor } from "./hooks/useCursor";

function App() {
  const { playableGrid } = createNewGrid();
  const grid = useRef<PuzzleGrid>(playableGrid);

  const { cursor, onCellClick, onKeyDown } = useCursor();

  console.log(cursor);
  return (
    <div className="grid" tabIndex={0} onKeyDown={onKeyDown}>
      {grid.current.map((row, rowIndex) => {
        return (
          <div key={`row-${rowIndex}`} className="row">
            {row.map((val, colIndex) => {
              const isCurrentRow = cursor.rowIndex === rowIndex;
              const isRowActive = isCurrentRow && cursor.isHorizontal;

              const isCurrentColumn = cursor.columnIndex === colIndex;
              const isColumnActive = isCurrentColumn && !cursor.isHorizontal;

              const isCellActive = isCurrentRow && isCurrentColumn;
              const isCellSecondary = isRowActive || isColumnActive;

              const classModifier = isCellActive
                ? "active"
                : isCellSecondary
                ? "secondary"
                : "";

              return (
                <div
                  key={`${rowIndex},${colIndex}`}
                  className={`cell ${classModifier}`.trim()}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                >
                  {val || ""}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default App;
