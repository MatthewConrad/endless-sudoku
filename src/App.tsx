import { useRef } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";

function App() {
  const { playableGrid } = createNewGrid();
  const grid = useRef<PuzzleGrid>(playableGrid);

  return (
    <div className="grid">
      {grid.current.map((row, rowIndex) => {
        return (
          <div key={`row-${rowIndex}`} className="row">
            {row.map((val, colIndex) => {
              return (
                <div key={`${rowIndex},${colIndex}`} className="cell">
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
