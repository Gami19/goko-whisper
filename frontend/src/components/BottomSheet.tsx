import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

export type SheetLevel = "collapsed" | "half";

type BottomSheetProps = {
  level: SheetLevel;
  onLevel: (level: SheetLevel) => void;
  children: ReactNode;
};

export function BottomSheet({ level, onLevel, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    event.stopPropagation();
    dragRef.current = {
      startY: event.clientY,
      startHeight: sheet.getBoundingClientRect().height,
    };
    sheet.classList.add("bottom-sheet--dragging");
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // 実ポインタ以外でも、要素上の移動で高さを変える。
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const sheet = sheetRef.current;
    const parent = sheet?.parentElement;
    if (!drag || !sheet || !parent) return;
    const parentHeight = parent.getBoundingClientRect().height;
    const next = drag.startHeight + (drag.startY - event.clientY);
    const min = parentHeight * 0.18;
    const max = parentHeight * 0.45;
    sheet.style.height = `${Math.min(max, Math.max(min, next))}px`;
  };

  const onPointerUp = () => {
    const sheet = sheetRef.current;
    const parent = sheet?.parentElement;
    const drag = dragRef.current;
    dragRef.current = null;
    if (!sheet || !parent || !drag) return;
    sheet.classList.remove("bottom-sheet--dragging");
    const ratio = sheet.getBoundingClientRect().height / parent.getBoundingClientRect().height;
    sheet.style.height = "";
    onLevel(ratio >= 0.31 ? "half" : "collapsed");
  };

  return (
    <section
      ref={sheetRef}
      className={`bottom-sheet bottom-sheet--${level}`}
      aria-label="手帳"
    >
      <button
        type="button"
        className="bottom-sheet__handle"
        aria-label={level === "half" ? "手帳を折りたたむ" : "手帳を開く"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <div className="bottom-sheet__body">{children}</div>
    </section>
  );
}
