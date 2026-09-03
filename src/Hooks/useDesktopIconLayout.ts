import { useCallback, useEffect, useState } from "react";
import { MENU_BAR_HEIGHT, TASKBAR_HEIGHT } from "../Components/os/constants";

export interface IconPosition {
  x: number;
  y: number;
}

interface Bounds {
  width: number;
  height: number;
}

const STORAGE_KEY = "marvinmosicoos-desktop-icons";
const HIDDEN_STORAGE_KEY = "marvinmosicoos-desktop-hidden";

// Approximate footprint of one rail icon (40px box + label), used only to
// keep a dragged icon fully on-screen — doesn't need to be pixel-exact.
const ICON_WIDTH = 64;
const ICON_HEIGHT = 68;

const RAIL_LEFT = 32;
const RAIL_TOP = MENU_BAR_HEIGHT + 48;

// Icons snap to a fixed grid (like a real desktop's icon grid) so two icons
// can never land on the same spot — a cell is always wide/tall enough to fit
// one icon's footprint plus a gutter.
const GRID_CELL_WIDTH = 84;
const GRID_CELL_HEIGHT = 77;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function clampPosition(pos: IconPosition, bounds: Bounds): IconPosition {
  return {
    x: clamp(pos.x, 0, Math.max(0, bounds.width - ICON_WIDTH)),
    y: clamp(pos.y, MENU_BAR_HEIGHT, Math.max(MENU_BAR_HEIGHT, bounds.height - TASKBAR_HEIGHT - ICON_HEIGHT)),
  };
}

function snapToGrid(pos: IconPosition, bounds: Bounds): IconPosition {
  const col = Math.round((pos.x - RAIL_LEFT) / GRID_CELL_WIDTH);
  const row = Math.round((pos.y - RAIL_TOP) / GRID_CELL_HEIGHT);
  return clampPosition({ x: RAIL_LEFT + col * GRID_CELL_WIDTH, y: RAIL_TOP + row * GRID_CELL_HEIGHT }, bounds);
}

function samePosition(a: IconPosition, b: IconPosition): boolean {
  return a.x === b.x && a.y === b.y;
}

function defaultPosition(index: number): IconPosition {
  return { x: RAIL_LEFT, y: RAIL_TOP + index * GRID_CELL_HEIGHT };
}

function loadStored(): Record<string, IconPosition> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persist(positions: Record<string, IconPosition>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // storage unavailable — layout just won't survive a reload
  }
}

function loadHidden(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HIDDEN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistHidden(hidden: string[]) {
  try {
    window.localStorage.setItem(HIDDEN_STORAGE_KEY, JSON.stringify(hidden));
  } catch {
    // storage unavailable — removed icons just won't survive a reload
  }
}

// Freely-draggable, grid-snapped desktop-icon positions, keyed by an
// arbitrary string id. Mirrors useWindowLayout's persist-on-drag-end
// pattern, but for a single grid cell per icon instead of a full rect.
export function useDesktopIconLayout<K extends string>(keys: readonly K[]) {
  const [positions, setPositions] = useState<Record<string, IconPosition>>(loadStored);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(loadHidden()));
  const [bounds, setBounds] = useState<Bounds>({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => setBounds({ width: window.innerWidth, height: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const rawPosition = useCallback(
    (key: K, from: Record<string, IconPosition>) => from[key] ?? defaultPosition(keys.indexOf(key)),
    [keys]
  );

  const getPosition = useCallback(
    (key: K): IconPosition => {
      const stored = rawPosition(key, positions);
      return bounds.width > 0 ? clampPosition(stored, bounds) : stored;
    },
    [positions, bounds, rawPosition]
  );

  // Preview where a live drag would land if dropped right now — used to
  // render the drop-target box while dragging, before the move commits.
  const previewPosition = useCallback(
    (pos: IconPosition): IconPosition => (bounds.width > 0 ? snapToGrid(pos, bounds) : pos),
    [bounds]
  );

  const commitPosition = useCallback(
    (key: K, pos: IconPosition) => {
      setPositions((prev) => {
        const target = bounds.width > 0 ? snapToGrid(pos, bounds) : pos;
        const previousOwnPos = rawPosition(key, prev);
        const next = { ...prev, [key]: target };

        // Another icon already sitting on the target cell swaps into this
        // icon's old spot, so icons never end up stacked on top of each other.
        const occupant = keys.find((other) => other !== key && samePosition(rawPosition(other, prev), target));
        if (occupant) next[occupant] = previousOwnPos;

        persist(next);
        return next;
      });
    },
    [bounds, keys, rawPosition]
  );

  // keep icons on-screen when the viewport resizes
  useEffect(() => {
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setPositions((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        const current = next[key];
        const fitted = clampPosition(current, bounds);
        if (fitted.x !== current.x || fitted.y !== current.y) {
          changed = true;
          next[key] = fitted;
        }
      });
      if (!changed) return prev;
      persist(next);
      return next;
    });
  }, [bounds]);

  const isHidden = useCallback((key: K) => hidden.has(key), [hidden]);

  const hideIcon = useCallback((key: K) => {
    setHidden((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      persistHidden(Array.from(next));
      return next;
    });
  }, []);

  const restoreAll = useCallback(() => {
    setHidden(new Set());
    persistHidden([]);
  }, []);

  const resetPositions = useCallback(() => {
    setPositions({});
    persist({});
  }, []);

  return {
    getPosition,
    commitPosition,
    previewPosition,
    isHidden,
    hideIcon,
    restoreAll,
    resetPositions,
    hiddenCount: hidden.size,
  };
}
