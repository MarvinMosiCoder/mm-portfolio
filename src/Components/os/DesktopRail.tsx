import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import { getOsTheme, OsTheme } from "../../theme/osTheme";
import { ChessIcon, PinballIcon, SectionIcon, SolitaireIcon } from "./OsIcons";
import ContextMenu from "./ContextMenu";
import { SECTIONS, SECTION_META, SectionKey } from "./constants";
import { IconPosition, useDesktopIconLayout } from "../../Hooks/useDesktopIconLayout";

interface DesktopRailProps {
  darkMode: boolean;
  activeIndex: number;
  closedSections: Set<SectionKey>;
  minimizedSections: Set<SectionKey>;
  onNavigateSection: (section: SectionKey) => void;
  onOpenChess: () => void;
  onOpenSolitaire: () => void;
  onOpenPinball: () => void;
  desktopMenuAt: { x: number; y: number } | null;
  onCloseDesktopMenu: () => void;
}

type ExtraKey = "resume" | "chess" | "solitaire" | "pinball";
type IconKey = SectionKey | ExtraKey;

const ICON_KEYS: readonly IconKey[] = [...SECTIONS, "resume", "chess", "solitaire", "pinball"];

// A single drag-to-reposition threshold, in px, below which a pointer-down +
// pointer-up is treated as a click (navigate) rather than a drag (move).
const DRAG_THRESHOLD = 4;

interface DraggableIconProps {
  theme: OsTheme;
  position: IconPosition;
  onPositionChange: (pos: IconPosition) => void;
  previewPosition: (pos: IconPosition) => IconPosition;
  onActivate: () => void;
  onContextMenu: (x: number, y: number) => void;
  boxStyle: React.CSSProperties;
  label: string;
  labelColor: string;
  icon: React.ReactNode;
}

interface DragState {
  startX: number;
  startY: number;
  startPos: IconPosition;
  moved: boolean;
}

const DraggableIcon: React.FC<DraggableIconProps> = ({
  theme,
  position,
  onPositionChange,
  previewPosition,
  onActivate,
  onContextMenu,
  boxStyle,
  label,
  labelColor,
  icon,
}) => {
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [live, setLive] = useState<IconPosition | null>(null);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const state = dragRef.current;
      if (!state) return;
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      if (!state.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) state.moved = true;
      if (state.moved) setLive({ x: state.startPos.x + dx, y: state.startPos.y + dy });
    };
    const endDrag = () => {
      const state = dragRef.current;
      if (!state) return;
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      if (state.moved) {
        suppressClickRef.current = true;
        setLive((current) => {
          if (current) onPositionChange(current);
          return null;
        });
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [onPositionChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPos: position, moved: false };
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };

  const handleClick = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      return;
    }
    onActivate();
  };

  const dragging = live !== null;
  const current = live ?? position;
  // Where the icon will actually land if dropped right now — rendered as an
  // outline "drop target" box, like dragging an icon on a real desktop.
  const dropTarget = dragging ? previewPosition(current) : null;

  return (
    <>
      {dropTarget && (
        <div
          aria-hidden="true"
          className="fixed z-20 pointer-events-none"
          style={{
            left: dropTarget.x,
            top: dropTarget.y,
            width: 40,
            height: 40,
            border: `1px dashed ${theme.accent}`,
            background: theme.accentSoft,
          }}
        />
      )}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onContextMenu(e.clientX, e.clientY);
        }}
        className="fixed z-30 flex flex-col items-center gap-1.5 cursor-grab active:cursor-grabbing group"
        style={{
          left: current.x,
          top: current.y,
          // Fixed to the box's own width so the anchor point (and the drop-
          // target box, which shares these coordinates) always lines up with
          // the icon square — a longer label just overflows centered below
          // it instead of widening/shifting the box.
          width: 40,
          touchAction: "none",
          opacity: dragging ? 0.85 : 1,
          transform: dragging ? "scale(1.06)" : undefined,
          filter: dragging ? `drop-shadow(0 12px 20px ${theme.shadow})` : undefined,
        }}
      >
        <div className="flex items-center justify-center transition-colors" style={boxStyle}>
          {icon}
        </div>
        <span className="os-mono text-[9px] tracking-wide whitespace-nowrap" style={{ color: labelColor }}>
          {label}
        </span>
      </button>
    </>
  );
};

const DesktopRail: React.FC<DesktopRailProps> = ({
  darkMode,
  activeIndex,
  closedSections,
  minimizedSections,
  onNavigateSection,
  onOpenChess,
  onOpenSolitaire,
  onOpenPinball,
  desktopMenuAt,
  onCloseDesktopMenu,
}) => {
  const theme = getOsTheme(darkMode);
  const navigate = useNavigate();
  const { getPosition, commitPosition, previewPosition, isHidden, hideIcon, restoreAll, resetPositions, hiddenCount } =
    useDesktopIconLayout(ICON_KEYS);
  const [iconMenu, setIconMenu] = useState<{ x: number; y: number; key: IconKey } | null>(null);

  const iconBox = (isActive: boolean, isClosed: boolean): React.CSSProperties => ({
    width: 40,
    height: 40,
    border: `1px solid ${isActive ? theme.accent : theme.borderStrong}`,
    background: isActive ? theme.accentSoft : "transparent",
    color: isActive ? theme.text : theme.textMuted,
    opacity: isClosed ? 0.5 : 1,
  });

  const extraIcons: { key: ExtraKey; icon: React.ReactNode; label: string; onActivate: () => void }[] = [
    { key: "resume", icon: <FiFileText size={17} />, label: "resume.pdf", onActivate: () => navigate("/resume") },
    { key: "chess", icon: <ChessIcon size={19} />, label: "chess.app", onActivate: onOpenChess },
    { key: "solitaire", icon: <SolitaireIcon size={19} />, label: "solitaire.app", onActivate: onOpenSolitaire },
    { key: "pinball", icon: <PinballIcon size={19} />, label: "pinball.app", onActivate: onOpenPinball },
  ];

  return (
    <div className="hidden 2xl:block">
      {SECTIONS.map((section, index) => {
        if (isHidden(section)) return null;
        const isClosed = closedSections.has(section) || minimizedSections.has(section);
        return (
          <DraggableIcon
            key={section}
            theme={theme}
            position={getPosition(section)}
            onPositionChange={(pos) => commitPosition(section, pos)}
            previewPosition={previewPosition}
            onActivate={() => onNavigateSection(section)}
            onContextMenu={(x, y) => setIconMenu({ x, y, key: section })}
            boxStyle={iconBox(activeIndex === index, isClosed)}
            icon={<SectionIcon section={section} size={17} />}
            label={SECTION_META[section].file}
            labelColor={activeIndex === index ? theme.text : theme.textMuted}
          />
        );
      })}

      {extraIcons
        .filter((item) => !isHidden(item.key))
        .map((item) => (
          <DraggableIcon
            key={item.key}
            theme={theme}
            position={getPosition(item.key)}
            onPositionChange={(pos) => commitPosition(item.key, pos)}
            previewPosition={previewPosition}
            onActivate={item.onActivate}
            onContextMenu={(x, y) => setIconMenu({ x, y, key: item.key })}
            boxStyle={iconBox(false, false)}
            icon={item.icon}
            label={item.label}
            labelColor={theme.textMuted}
          />
        ))}

      {desktopMenuAt && (
        <ContextMenu
          darkMode={darkMode}
          x={desktopMenuAt.x}
          y={desktopMenuAt.y}
          onClose={onCloseDesktopMenu}
          items={[
            { label: "Reset icon positions", onSelect: resetPositions },
            {
              label: hiddenCount > 0 ? `Restore removed apps (${hiddenCount})` : "Restore removed apps",
              onSelect: restoreAll,
              disabled: hiddenCount === 0,
            },
          ]}
        />
      )}
      {iconMenu && (
        <ContextMenu
          darkMode={darkMode}
          x={iconMenu.x}
          y={iconMenu.y}
          onClose={() => setIconMenu(null)}
          items={[{ label: "Remove from desktop", onSelect: () => hideIcon(iconMenu.key) }]}
        />
      )}
    </div>
  );
};

export default DesktopRail;
