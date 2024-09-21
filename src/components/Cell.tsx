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

  const candidates = getValidCellValues(grid, { rowIndex, columnIndex });

  return (
    <div
      key={`${rowIndex},${columnIndex}`}
      className={`cell ${classModifier}`.trim()}
      onClick={() => onClick(rowIndex, columnIndex)}
    >
      {value ? (
        <div>{value}</div>
      ) : (
        <div className="candidates">
          {VALUES.map((v) => {
            const isCandidate = candidates.includes(v);

            return <div>{isCandidate ? v : ""}</div>;
          })}
        </div>
      )}
    </div>
  );
};
