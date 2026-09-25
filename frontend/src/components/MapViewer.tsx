import { useEffect, useRef } from "react";
import type { SheetLevel } from "./BottomSheet";
import { MAP_PINS, type PinId } from "../data/map";

type Camera = { x: number; y: number; zoom: number };

type MapViewerProps = {
  selectedId: PinId | null;
  focusId: PinId | null;
  focusToken: number;
  reached: Record<PinId, boolean>;
  sheetLevel: SheetLevel;
  onSelect: (id: PinId) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function isPinId(value: string | null): value is PinId {
  return value === "spot1" || value === "spot2" || value === "goko";
}

export function MapViewer({
  selectedId,
  focusId,
  focusToken,
  reached,
  sheetLevel,
  onSelect,
}: MapViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<Partial<Record<PinId, HTMLButtonElement>>>({});
  const cameraRef = useRef<Camera>({ x: 0, y: 0, zoom: 1 });
  const centerRef = useRef<((id: PinId) => void) | null>(null);
  const sheetLevelRef = useRef(sheetLevel);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { dist: number; zoom: number } | null = null;
    let moved = false;
    let downPin: PinId | null = null;
    let frame = 0;

    const layout = () => {
      const size = viewport.clientWidth;
      stage.style.width = `${size}px`;
      stage.style.height = `${size}px`;
    };

    const apply = () => {
      const { x, y, zoom } = cameraRef.current;
      stage.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${zoom})`;
      const inverse = 1 / zoom;
      for (const pin of MAP_PINS) {
        const element = pinRefs.current[pin.id];
        if (!element) continue;
        element.style.transform = `translate(-50%, -50%) scale(${inverse})`;
      }
    };

    const clamp = () => {
      const camera = cameraRef.current;
      const mapSize = viewport.clientWidth * camera.zoom;
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      camera.x =
        mapSize <= width
          ? (width - mapSize) / 2
          : Math.min(0, Math.max(width - mapSize, camera.x));
      camera.y =
        mapSize <= height
          ? (height - mapSize) / 2
          : Math.min(0, Math.max(height - mapSize, camera.y));
    };

    const zoomAt = (nextZoom: number, originX: number, originY: number) => {
      const camera = cameraRef.current;
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoom));
      const stageX = (originX - camera.x) / camera.zoom;
      const stageY = (originY - camera.y) / camera.zoom;
      camera.zoom = zoom;
      camera.x = originX - stageX * zoom;
      camera.y = originY - stageY * zoom;
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        clamp();
        apply();
      });
    };

    const centerOn = (id: PinId) => {
      const pin = MAP_PINS.find((item) => item.id === id);
      if (!pin) return;
      layout();
      const camera = cameraRef.current;
      const base = viewport.clientWidth;
      const cover = sheetLevelRef.current === "half" ? 0.45 : 0.18;
      const anchorY = (viewport.clientHeight * (1 - cover)) / 2;
      camera.x = viewport.clientWidth / 2 - (pin.x / 100) * base * camera.zoom;
      camera.y = anchorY - (pin.y / 100) * base * camera.zoom;
      clamp();
      apply();
    };

    centerRef.current = centerOn;
    layout();
    cameraRef.current.zoom = 1.15;
    centerOn("goko");

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        // 実ポインタ以外でも、記録済みの位置から移動量を取る。
      }
      moved = false;
      const pin = (event.target as Element).closest?.("[data-pin]");
      const id = pin?.getAttribute("data-pin") ?? null;
      downPin = isPinId(id) ? id : null;
      if (pointers.size === 2) {
        const [first, second] = [...pointers.values()];
        pinch = {
          dist: Math.hypot(first.x - second.x, first.y - second.y) || 1,
          zoom: cameraRef.current.zoom,
        };
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      if (Math.hypot(dx, dy) > 4) moved = true;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size >= 2 && pinch) {
        const [first, second] = [...pointers.values()];
        const dist = Math.hypot(first.x - second.x, first.y - second.y) || 1;
        const rect = viewport.getBoundingClientRect();
        zoomAt(
          pinch.zoom * (dist / pinch.dist),
          (first.x + second.x) / 2 - rect.left,
          (first.y + second.y) / 2 - rect.top,
        );
        schedule();
        return;
      }

      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      schedule();
    };

    const onPointerUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
      if (!moved && downPin) onSelectRef.current(downPin);
      if (pointers.size === 0) downPin = null;
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = viewport.getBoundingClientRect();
      const factor = event.deltaY < 0 ? 1.08 : 0.92;
      zoomAt(
        cameraRef.current.zoom * factor,
        event.clientX - rect.left,
        event.clientY - rect.top,
      );
      schedule();
    };

    const onResize = () => {
      layout();
      clamp();
      apply();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      centerRef.current = null;
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    sheetLevelRef.current = sheetLevel;
    centerRef.current?.(selectedId ?? "goko");
  }, [selectedId, sheetLevel]);

  useEffect(() => {
    if (focusToken === 0 || !focusId) return;
    centerRef.current?.(focusId);
  }, [focusId, focusToken]);

  return (
    <div
      ref={viewportRef}
      className="map-viewer"
      aria-label="キャンパスの地図"
    >
      <div ref={stageRef} className="map-stage">
        <img
          className="map-image"
          src="/maps/dummy-campus.svg"
          alt=""
          draggable={false}
        />
        {MAP_PINS.map((pin) => {
          const sealed = reached[pin.id];
          const selected = selectedId === pin.id;
          return (
            <button
              key={pin.id}
              type="button"
              data-pin={pin.id}
              ref={(element) => {
                if (element) pinRefs.current[pin.id] = element;
                else delete pinRefs.current[pin.id];
              }}
              className={
                sealed
                  ? "map-pin map-pin--sealed"
                  : "map-pin map-pin--coin"
              }
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              aria-pressed={selected}
              aria-label={sealed ? `${pin.name}、達成` : pin.name}
              onClick={(event) => {
                if (event.detail !== 0) return;
                onSelect(pin.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
