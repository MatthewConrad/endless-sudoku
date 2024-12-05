import { VALUES } from "../logic/constants";
import { CellValue, GridCellState } from "../types/grid";

interface CellProps extends GridCellState {
  isCellActive?: boolean;
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
  isConfirmed,
  isIncorrect,
  isInvalid,
  isCellActive,
  isAutoCandidate,
  onCellClick,
  onCandidateClick,
}: CellProps) => {
  const classModifiers = [
    isCellActive && "active",
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
    if (!isCellActive) {
      onCellClick(rowIndex, columnIndex);
    }
  };

  const handleCandidateClick = (candidateValue: CellValue) => {
    if (isCellActive) {
      onCandidateClick(candidateValue);
    }
  };

  return (
    <div
      key={`${rowIndex},${columnIndex}`}
      className={`cell ${classModifiers.join(" ")}`.trim()}
      onClick={handleCellClick}
    >
      {userValue ? (
        <div>{userValue}</div>
      ) : (
        <div className="candidates">
          {VALUES.map((v) => {
            const isCandidate = candidatesToDisplay.includes(v);

            return (
              <div
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
