import { VALUES } from "../logic/constants";
import { CellValue } from "../types/grid";

interface GameControlsProps {
  isCandidateMode: boolean;
  onToggleCandidateMode: () => void;
  isAutoCondidate: boolean;
  onToggleAutoCandidate: () => void;
  onClickValue: (value: CellValue) => void;
}

export const GameControls = ({
  isCandidateMode,
  onToggleCandidateMode,
  isAutoCondidate,
  onToggleAutoCandidate,
  onClickValue,
}: GameControlsProps) => {
  return (
    <div className="game-controls">
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="candidate-mode-toggle"
          checked={isCandidateMode}
          onChange={onToggleCandidateMode}
        />
        <label htmlFor="candidate-mode-toggle">Notes entry</label>
      </div>
      <div
        className={`keypad-grid ${!isCandidateMode ? "expanded" : ""}`.trim()}
      >
        {VALUES.map((v) => (
          <div
            key={`controls-val-${v}`}
            className="cell"
            onClick={() => onClickValue(v)}
          >
            {v}
          </div>
        ))}
      </div>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="auto-candidate-toggle"
          checked={isAutoCondidate}
          onChange={onToggleAutoCandidate}
        />
        <label htmlFor="auto-candidate-toggle">Auto-Candidate mode</label>
      </div>
    </div>
  );
};
