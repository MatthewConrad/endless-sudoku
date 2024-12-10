import { VALUES } from "../logic/constants";
import { CellValue, GridCellState } from "../types/grid";

interface CellProps extends GridCellState {
  isActive?: boolean;
  isInvalid?: boolean;
  isAutoCandidate?: boolean;
  onCellClick: (rowIndex: number, columnIndex: number) => void;
  onCandidateClick: (candidateValue: CellValue) => void;
}

export const Cell = ({
  userValue,
  candidates,
  userCandidates,
  rowIndex,
  columnIndex,
  isPrefilled,
  isConfirmed,
  isIncorrect,
  isInvalid,
  isActive,
  isAutoCandidate,
  onCellClick,
  onCandidateClick,
}: CellProps) => {
  const classModifiers = [
    isPrefilled && "prefilled",
    isActive && "active",
    isConfirmed && "confirmed",
    isIncorrect && "incorrect",
    isInvalid && "invalid",
  ].filter(Boolean) as string[];

  const candidatesToUse = isAutoCandidate ? candidates : userCandidates;
  const candidatesToDisplay = Object.entries(candidatesToUse).reduce<
    CellValue[]
  >((placed, [candidate, isPlaced]) => {
    if (isPlaced) {
      return [...placed, +candidate as CellValue];
    }

    return placed;
  }, []);

  const handleCellClick = () => {
    if (!isActive) {
      onCellClick(rowIndex, columnIndex);
    }
  };

  const handleCandidateClick = (candidateValue: CellValue) => {
    if (isActive) {
      onCandidateClick(candidateValue);
    }
  };

  return (
    <div
      key={`${rowIndex},${columnIndex}`}
      className={`cell ${classModifiers.join(" ")}`.trim()}
      onClick={handleCellClick}
      aria-disabled={isPrefilled || undefined}
      aria-invalid={isInvalid || undefined}
    >
      {userValue ? (
        <div>{userValue}</div>
      ) : (
        <div className="candidates">
          {VALUES.map((v) => {
            const isCandidate = candidatesToDisplay.includes(v);

            return (
              <div
                key={`${rowIndex},${columnIndex}-candidate-${v}`}
                className={`candidate-option ${
                  isCandidate ? "placed" : ""
                }`.trim()}
                onClick={() => handleCandidateClick(v)}
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
