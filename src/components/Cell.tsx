import { VALUES } from "../logic/constants";
import { getValidCellValues } from "../logic/validity";
import { PopulatedCell, PuzzleGrid } from "../types/grid";

interface CellProps extends PopulatedCell {
  grid: PuzzleGrid;
  onClick: (rowIndex: number, columnIndex: number) => void;
  isCellActive?: boolean;
}

export const Cell = ({
  value,
  rowIndex,
  columnIndex,
  grid,
  onClick,
  isCellActive,
}: CellProps) => {
  const classModifier = isCellActive ? "active" : "";

  const autoCandidates = getValidCellValues(grid, { rowIndex, columnIndex });

  const handleCellClick = () => {
    if (!isCellActive) {
      onClick(rowIndex, columnIndex);
    }
  };

  const handleCandidateClick = () => {
    if (isCellActive) {
      console.log("clicked candidate, do something");
    }
  };

  return (
    <div
      key={`${rowIndex},${columnIndex}`}
      className={`cell ${classModifier}`.trim()}
      onClick={handleCellClick}
    >
      {value ? (
        <div>{value}</div>
      ) : (
        <div className="candidates">
          {VALUES.map((v) => {
            const isCandidate = autoCandidates.includes(v);

            return (
              <div
                className={`candidate-option ${
                  isCandidate ? "placed" : ""
                }`.trim()}
                onClick={handleCandidateClick}
              >
                {v}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
