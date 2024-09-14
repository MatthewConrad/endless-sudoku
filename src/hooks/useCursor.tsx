import { KeyboardEventHandler, useState } from "react";
import { GridCell } from "../types/grid";
import { MAX_INDEX } from "../logic/constants";

interface GridCursor extends GridCell {
  isHorizontal?: boolean;
}

export const useCursor = () => {
  const [cursor, setCursor] = useState<GridCursor>({
    rowIndex: 0,
    columnIndex: 0,
    isHorizontal: true,
  });

  const onCellClick = (rowIndex: number, columnIndex: number) =>
    setCursor((prev) => ({ ...prev, rowIndex, columnIndex }));

  const onKeyDown: KeyboardEventHandler<HTMLElement> = (e) => {
    switch (e.key) {
      case "ArrowUp":
        setCursor((prev) => {
          if (!prev.isHorizontal) {
            return {
              ...prev,
              rowIndex: Math.max(0, prev.rowIndex - 1),
            };
          }

          return {
            ...prev,
            isHorizontal: false,
          };
        });
        break;
      case "ArrowDown":
        setCursor((prev) => {
          if (!prev.isHorizontal) {
            return {
              ...prev,
              rowIndex: Math.min(MAX_INDEX, prev.rowIndex + 1),
            };
          }

          return {
            ...prev,
            isHorizontal: false,
          };
        });
        break;
      case "ArrowLeft":
        setCursor((prev) => {
          if (prev.isHorizontal) {
            return {
              ...prev,
              columnIndex: Math.max(0, prev.columnIndex - 1),
            };
          }

          return {
            ...prev,
            isHorizontal: true,
          };
        });
        break;
      case "ArrowRight":
        setCursor((prev) => {
          if (prev.isHorizontal) {
            return {
              ...prev,
              columnIndex: Math.min(MAX_INDEX, prev.columnIndex + 1),
            };
          }

          return {
            ...prev,
            isHorizontal: true,
          };
        });
        break;

      case "Tab":
        e.preventDefault();
        e.stopPropagation();
        setCursor((prev) => ({ ...prev, isHorizontal: !prev.isHorizontal }));
        break;
      default:
        break;
    }
  };

  return { cursor, onCellClick, onKeyDown };
};
