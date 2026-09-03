import { useCallback, useEffect, useRef, useState } from "react";
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, SECTIONS, SectionKey } from "../Components/os/constants";

export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Bounds {
  width: number;
  height: number;
}

const STORAGE_KEY = "marvinmosicoos-window-layout";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function clampRect(rect: WindowRect, bounds: Bounds): WindowRect {
  const width = clamp(rect.width, MIN_WINDOW_WIDTH, Math.max(bounds.width, MIN_WINDOW_WIDTH));
  const height = clamp(rect.height, MIN_WINDOW_HEIGHT, Math.max(bounds.height, MIN_WINDOW_HEIGHT));
  const x = clamp(rect.x, 0, Math.max(0, bounds.width - width));
  const y = clamp(rect.y, 0, Math.max(0, bounds.height - height));
  return { x, y, width, height };
}

function defaultRect(index: number, bounds: Bounds): WindowRect {
  const width = clamp(Math.round(bounds.width * 0.46), MIN_WINDOW_WIDTH, 640);
  const height = clamp(Math.round(bounds.height * 0.72), MIN_WINDOW_HEIGHT, 620);
  const cascade = index * 34;
  return clampRect({ x: 56 + cascade, y: 40 + cascade, width, height }, bounds);
}

function loadStored(): Partial<Record<SectionKey, WindowRect>> {
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

function persist(rects: Partial<Record<SectionKey, WindowRect>>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rects));
  } catch {
    // storage unavailable — layout just won't survive a reload
  }
}

export function useWindowLayout(bounds: Bounds) {
  const [rects, setRects] = useState<Partial<Record<SectionKey, WindowRect>>>(loadStored);
  const [order, setOrder] = useState<SectionKey[]>(() => [...SECTIONS].reverse());
  const [maximized, setMaximized] = useState<Set<SectionKey>>(new Set());
  const preMaximizeRef = useRef<Partial<Record<SectionKey, WindowRect>>>({});

  const getRect = useCallback(
    (section: SectionKey): WindowRect => rects[section] ?? defaultRect(SECTIONS.indexOf(section), bounds),
    [rects, bounds]
  );

  const commitRect = useCallback(
    (section: SectionKey, rect: WindowRect) => {
      setRects((prev) => {
        const next = { ...prev, [section]: clampRect(rect, bounds) };
        persist(next);
        return next;
      });
    },
    [bounds]
  );

  const bringToFront = useCallback((section: SectionKey) => {
    setOrder((prev) => (prev[prev.length - 1] === section ? prev : [...prev.filter((s) => s !== section), section]));
  }, []);

  const zIndexOf = useCallback((section: SectionKey) => order.indexOf(section) + 1, [order]);

  const isMaximized = useCallback((section: SectionKey) => maximized.has(section), [maximized]);

  const toggleMaximize = useCallback(
    (section: SectionKey) => {
      setMaximized((prev) => {
        const next = new Set(prev);
        if (next.has(section)) {
          next.delete(section);
          const restored = preMaximizeRef.current[section];
          if (restored) commitRect(section, restored);
        } else {
          next.add(section);
          preMaximizeRef.current[section] = getRect(section);
          commitRect(section, { x: 0, y: 0, width: bounds.width, height: bounds.height });
        }
        return next;
      });
    },
    [bounds, commitRect, getRect]
  );

  // keep every rect inside the desktop when the viewport (or a maximized window) resizes
  useEffect(() => {
    if (bounds.width <= 0 || bounds.height <= 0) return;
    setRects((prev) => {
      let changed = false;
      const next = { ...prev };
      (Object.keys(next) as SectionKey[]).forEach((key) => {
        const current = next[key]!;
        const target = maximized.has(key) ? { x: 0, y: 0, width: bounds.width, height: bounds.height } : current;
        const fitted = clampRect(target, bounds);
        if (
          fitted.x !== current.x ||
          fitted.y !== current.y ||
          fitted.width !== current.width ||
          fitted.height !== current.height
        ) {
          changed = true;
          next[key] = fitted;
        }
      });
      if (!changed) return prev;
      persist(next);
      return next;
    });
  }, [bounds, maximized]);

  return { getRect, commitRect, bringToFront, zIndexOf, isMaximized, toggleMaximize };
}
