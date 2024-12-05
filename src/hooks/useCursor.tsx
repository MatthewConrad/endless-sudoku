import { KeyboardEventHandler, useState } from "react";
import { ARROW_DIFFS } from "../logic/constants";
import { addCells } from "../logic/helpers";
import { GridCursor } from "../types/grid";

export const useCursor = () => {
  const [cursor, setCursor] = useState<GridCursor>({
    rowIndex: 0,
    columnIndex: 0,
    isCandidateMode: false,
  });

  const onCellClick = (rowIndex: number, columnIndex: number) =>
    setCursor((prev) => ({ ...prev, rowIndex, columnIndex }));

  const onKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    switch (e.key) {
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
      case "Tab":
        e.preventDefault();
        e.stopPropagation();
        break;
      default:
        break;
    }
  };

  const onKeyUp: KeyboardEventHandler<HTMLElement> = (e) => {
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

  return { cursor, onCellClick, onKeyDown, onKeyUp };
};
