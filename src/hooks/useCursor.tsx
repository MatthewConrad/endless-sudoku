import { useState } from "react";
import { ARROW_DIFFS, MAX_INDEX } from "../logic/constants";
import { CellValue, GridCell, GridCursor } from "../types/grid";

interface UseCursorArgs {
  onToggleCandidate: (candidateValue: CellValue, cell: GridCell) => void;
  onSetCellValue: (newValue: number, cell: GridCell) => void;
  onClearCell: (cell: GridCell) => void;
}

const getDigitFromEvent = (e: KeyboardEvent) => {
  const { code } = e;

  const [_, intDigit] = code.toLowerCase().split("digit");

  return intDigit;
};

const addCells = (a: GridCell, b: GridCell): GridCell => ({
  rowIndex: Math.min(Math.max(0, a.rowIndex + b.rowIndex), MAX_INDEX),
  columnIndex: Math.min(Math.max(0, a.columnIndex + b.columnIndex), MAX_INDEX),
});

export const useCursor = ({
  onToggleCandidate,
  onSetCellValue,
  onClearCell,
}: UseCursorArgs) => {
  const [cursor, setCursor] = useState<GridCursor>({
    rowIndex: 0,
    columnIndex: 0,
    isCandidateMode: false,
  });

  const onToggleCandidateMode = () =>
    setCursor((c) => ({ ...c, isCandidateMode: !c.isCandidateMode }));

  const onCellClick = (rowIndex: number, columnIndex: number) =>
    setCursor((prev) => ({ ...prev, rowIndex, columnIndex }));

  const onKeyDown = (e: KeyboardEvent) => {
    console.log("on keydown");
    const rawKey = e.key;
    const shiftedKey = getDigitFromEvent(e);

    const key = e.shiftKey && shiftedKey ? shiftedKey : rawKey;

    switch (key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        setCursor((prev) => {
          const cellChange = ARROW_DIFFS[e.key];

          return {
            ...prev,
            ...addCells(prev, cellChange),
          };
        });
        break;
      case " ":
      case "Spacebar":
      case "Shift":
        e.preventDefault();
        e.stopPropagation();
        setCursor((prev) => ({
          ...prev,
          isCandidateMode: !prev.isCandidateMode,
        }));
        break;
      case "Backspace":
        onClearCell(cursor);
        break;
      default:
        const keyInt = Number.parseInt(key);
        if (keyInt && !isNaN(keyInt)) {
          const keyValue = keyInt as CellValue;

          if (cursor.isCandidateMode) {
            onToggleCandidate(keyValue, cursor);
          } else {
            onSetCellValue(keyValue, cursor);
          }
        }
        break;
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Shift":
        e.preventDefault();
        e.stopPropagation();
        setCursor((prev) => ({
          ...prev,
          isCandidateMode: !prev.isCandidateMode,
        }));
        break;
      default:
        break;
    }
  };

  return { cursor, onToggleCandidateMode, onCellClick, onKeyDown, onKeyUp };
};
