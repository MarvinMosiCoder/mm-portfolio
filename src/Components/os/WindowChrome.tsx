import React, { useEffect, useRef, useState } from "react";
import { getOsTheme } from "../../theme/osTheme";
import { WinControls } from "./OsIcons";
import { clampRect, WindowRect } from "../../Hooks/useWindowLayout";

interface FloatingProps {
  rect: WindowRect;
  zIndex: number;
  maximized: boolean;
  bounds: { width: number; height: number };
  taskbarHeight: number;
  onRectChange: (rect: WindowRect) => void;
  onToggleMaximize: () => void;
}

// Above the menu bar, taskbar, and desktop rail (all z-40/z-30) so a fullscreen
// window actually covers them, but below the modal overlays (task switcher,
// mobile nav panel at z-50) and the minimize-ghost animation (z-[70]).
const MAXIMIZED_Z_INDEX = 45;

interface WindowChromeProps {
  darkMode: boolean;
  title: string;
  active?: boolean;
  children: React.ReactNode;
  bodyClassName?: string;
  aos?: string;
  aosDelay?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  sectionKey?: string;
  floating?: FloatingProps;
  reducedMotion?: boolean;
}

type ResizeEdges = { n?: boolean; s?: boolean; e?: boolean; w?: boolean };

interface Gesture {
  kind: "drag" | "resize";
  edges?: ResizeEdges;
  startX: number;
  startY: number;
  startRect: WindowRect;
}

const RESIZE_HANDLES: { edges: ResizeEdges; cursor: string; style: React.CSSProperties }[] = [
  { edges: { n: true }, cursor: "ns-resize", style: { top: -4, left: 10, right: 10, height: 8 } },
  { edges: { s: true }, cursor: "ns-resize", style: { bottom: -4, left: 10, right: 10, height: 8 } },
  { edges: { e: true }, cursor: "ew-resize", style: { right: -4, top: 10, bottom: 10, width: 8 } },
  { edges: { w: true }, cursor: "ew-resize", style: { left: -4, top: 10, bottom: 10, width: 8 } },
  { edges: { n: true, e: true }, cursor: "nesw-resize", style: { top: -5, right: -5, width: 16, height: 16 } },
  { edges: { n: true, w: true }, cursor: "nwse-resize", style: { top: -5, left: -5, width: 16, height: 16 } },
  { edges: { s: true, e: true }, cursor: "nwse-resize", style: { bottom: -5, right: -5, width: 16, height: 16 } },
  { edges: { s: true, w: true }, cursor: "nesw-resize", style: { bottom: -5, left: -5, width: 16, height: 16 } },
];

const WindowChrome: React.FC<WindowChromeProps> = ({
  darkMode,
  title,
  active = true,
  children,
  bodyClassName,
  aos,
  aosDelay,
  onClose,
  onMinimize,
  onFocus,
  sectionKey,
  floating,
  reducedMotion,
}) => {
  const theme = getOsTheme(darkMode);
  const [maximizedLocal, setMaximizedLocal] = useState(false);
  const [liveRect, setLiveRect] = useState<WindowRect | null>(null);
  const gestureRef = useRef<Gesture | null>(null);

  const maximized = floating ? floating.maximized : maximizedLocal;
  const interacting = liveRect !== null;
  const rect = floating ? liveRect ?? floating.rect : null;

  const handleMaximize = () => {
    if (floating) floating.onToggleMaximize();
    else setMaximizedLocal((v) => !v);
  };

  useEffect(() => {
    if (!floating) return;
    const onMove = (e: PointerEvent) => {
      const gesture = gestureRef.current;
      if (!gesture) return;
      const dx = e.clientX - gesture.startX;
      const dy = e.clientY - gesture.startY;
      let next: WindowRect;
      if (gesture.kind === "drag") {
        next = { ...gesture.startRect, x: gesture.startRect.x + dx, y: gesture.startRect.y + dy };
      } else {
        const edges = gesture.edges ?? {};
        let { x, y, width, height } = gesture.startRect;
        if (edges.e) width = gesture.startRect.width + dx;
        if (edges.s) height = gesture.startRect.height + dy;
        if (edges.w) {
          width = gesture.startRect.width - dx;
          x = gesture.startRect.x + dx;
        }
        if (edges.n) {
          height = gesture.startRect.height - dy;
          y = gesture.startRect.y + dy;
        }
        next = { x, y, width, height };
      }
      setLiveRect(clampRect(next, floating.bounds));
    };
    const endGesture = () => {
      if (!gestureRef.current) return;
      gestureRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setLiveRect((current) => {
        if (current) floating.onRectChange(current);
        return null;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endGesture);
    window.addEventListener("pointercancel", endGesture);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endGesture);
      window.removeEventListener("pointercancel", endGesture);
    };
  }, [floating]);

  const beginDrag = (e: React.PointerEvent) => {
    if (!floating || floating.maximized) return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    gestureRef.current = { kind: "drag", startX: e.clientX, startY: e.clientY, startRect: floating.rect };
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const beginResize = (edges: ResizeEdges) => (e: React.PointerEvent) => {
    if (!floating || floating.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    gestureRef.current = { kind: "resize", edges, startX: e.clientX, startY: e.clientY, startRect: floating.rect };
    document.body.style.userSelect = "none";
  };

  const positionTransition =
    !interacting && !reducedMotion ? "left 0.2s ease, top 0.2s ease, width 0.2s ease, height 0.2s ease" : "none";

  return (
    <div
      className={
        floating
          ? undefined
          : maximized
          ? "relative left-1/2 w-[calc(100vw_-_var(--sbw,0px))] max-w-[calc(100vw_-_var(--sbw,0px))] -translate-x-1/2 px-4 transition-all duration-300 sm:px-8 2xl:pl-40 2xl:pr-10"
          : "w-full transition-all duration-300"
      }
      style={
        floating
          ? floating.maximized
            ? {
                // True fullscreen: escape the desktop canvas entirely and cover
                // the whole viewport — including the menu bar and rail — down to
                // just above the taskbar, which stays reachable.
                position: "fixed",
                left: 0,
                top: 0,
                right: 0,
                bottom: floating.taskbarHeight,
                zIndex: MAXIMIZED_Z_INDEX,
                transition: positionTransition,
              }
            : {
                position: "absolute",
                left: rect!.x,
                top: rect!.y,
                width: rect!.width,
                height: rect!.height,
                zIndex: floating.zIndex,
                transition: positionTransition,
              }
          : undefined
      }
      data-section={floating ? sectionKey : undefined}
      onPointerDownCapture={floating && onFocus ? () => onFocus() : undefined}
    >
      <div
        className={
          floating
            ? "flex h-full flex-col overflow-hidden transition-colors duration-500"
            : "overflow-hidden transition-colors duration-500"
        }
        data-aos={floating ? undefined : aos}
        data-aos-delay={floating ? undefined : aosDelay}
        style={{
          background: theme.panel,
          border: `1px solid ${theme.borderStrong}`,
          borderTop: `2px solid ${active ? theme.accent : theme.border}`,
          boxShadow: `0 24px 50px -20px ${theme.shadow}`,
        }}
      >
        <div
          className="flex h-9 shrink-0 items-center justify-between px-3"
          style={{
            background: active ? theme.titlebarActive : theme.titlebar,
            borderBottom: `1px solid ${theme.border}`,
            cursor: floating && !floating.maximized ? "grab" : undefined,
            touchAction: floating ? "none" : undefined,
          }}
          onPointerDown={beginDrag}
          onDoubleClick={floating ? handleMaximize : undefined}
        >
          {active ? (
            <span className="os-mono text-[10px] tracking-wider" style={{ color: theme.accent }}>
              ACTIVE
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
          <div className="flex items-center gap-2.5" style={{ color: active ? theme.textMuted : theme.textDim }}>
            <span className="os-mono text-xs" style={{ color: active ? theme.text : theme.textDim }}>
              {title}
            </span>
            <WinControls
              dim={!active}
              dangerColor={theme.danger}
              onMinimize={onMinimize}
              minimizeLabel={`Minimize ${title}`}
              onMaximize={handleMaximize}
              maximized={maximized}
              maximizeLabel={`${maximized ? "Restore" : "Maximize"} ${title}`}
              onClose={onClose}
              closeLabel={`Close ${title}`}
            />
          </div>
        </div>
        <div className={bodyClassName ?? "p-5 sm:p-7"} style={floating ? { flex: 1, overflow: "auto" } : undefined}>
          {children}
        </div>
      </div>

      {floating && !floating.maximized && (
        <>
          {RESIZE_HANDLES.map((handle, i) => (
            <div
              key={i}
              aria-hidden="true"
              onPointerDown={beginResize(handle.edges)}
              style={{ position: "absolute", cursor: handle.cursor, touchAction: "none", ...handle.style }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default WindowChrome;
