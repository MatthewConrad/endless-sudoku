import { useLayoutEffect, useState } from "react";
import "./App.css";
import { createNewGrid } from "./logic/generation";
import { PuzzleGrid } from "./types/grid";
import { GameGrid } from "./components/GameGrid";
import { BLANK_GRID } from "./logic/constants";

const App = () => {
  const [baseGrids, setBaseGrids] = useState<{
    initialGrid: PuzzleGrid;
    solvedGrid: PuzzleGrid;
  }>({ initialGrid: [...BLANK_GRID], solvedGrid: [...BLANK_GRID] });

  const handleStartNewGrid = (isSolved: boolean) => {
    if (isSolved || confirm("Are you sure you want to start a new grid?")) {
      const newGrid = createNewGrid();
      setBaseGrids({
        initialGrid: newGrid.playableGrid,
        solvedGrid: newGrid.filledGrid,
      });
    }
  };

  useLayoutEffect(() => {
    const { playableGrid, filledGrid } = createNewGrid();
    setBaseGrids({ initialGrid: playableGrid, solvedGrid: filledGrid });
  }, []);

  return <GameGrid {...baseGrids} onStartNewGrid={handleStartNewGrid} />;
};

export default App;
