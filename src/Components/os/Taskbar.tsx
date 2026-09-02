import React, { useEffect, useRef, useState } from "react";
import { getOsTheme } from "../../theme/osTheme";
import { useWindowThumbnails } from "../../Hooks/useWindowThumbnails";
import { CloseGlyph, GridIcon, SectionIcon } from "./OsIcons";
import { SECTIONS, SECTION_META, SectionKey, TASKBAR_HEIGHT } from "./constants";

interface TaskbarProps {
  darkMode: boolean;
  openSections: SectionKey[];
  minimizedSections: Set<SectionKey>;
  activeSection: SectionKey;
  onNavigateSection: (section: SectionKey) => void;
  onCloseSection: (section: SectionKey) => void;
  onOpenMenu: () => void;
  onOpenSwitcher: () => void;
}

const useClock = () => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000 * 30);
    return () => window.clearInterval(id);
  }, []);
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PREVIEW_W = 208;
const PREVIEW_H = 132;
const HOVER_DELAY = 350;

const Taskbar: React.FC<TaskbarProps> = ({
  darkMode,
  openSections,
  minimizedSections,
  activeSection,
  onNavigateSection,
  onCloseSection,
  onOpenMenu,
  onOpenSwitcher,
}) => {
  const theme = getOsTheme(darkMode);
  const time = useClock();
  const { ensure: ensureThumbnail, get: getThumbnail, loadingSection: thumbLoading } = useWindowThumbnails(darkMode);

  const [order, setOrder] = useState<SectionKey[]>([...SECTIONS]);
  const [draggingSection, setDraggingSection] = useState<SectionKey | null>(null);
  const [dragOverSection, setDragOverSection] = useState<SectionKey | null>(null);
  const [hoveredSection, setHoveredSection] = useState<SectionKey | null>(null);

  const tabRefs = useRef<Partial<Record<SectionKey, HTMLDivElement | null>>>({});
  const hoverTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  }, []);

  const visibleOrder = order.filter((s) => openSections.includes(s));

  const scheduleHover = (section: SectionKey) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      setHoveredSection(section);
      void ensureThumbnail(section);
    }, HOVER_DELAY);
  };

  const cancelHover = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    setHoveredSection(null);
  };

  const handleDrop = (targetSection: SectionKey) => {
    const src = draggingSection;
    setDraggingSection(null);
    setDragOverSection(null);
    if (!src || src === targetSection) return;
    setOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(src);
      const to = next.indexOf(targetSection);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, src);
      return next;
    });
  };

  const previewImage = hoveredSection ? getThumbnail(hoveredSection) : null;
  const previewRect = hoveredSection ? tabRefs.current[hoveredSection]?.getBoundingClientRect() : null;

  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between px-3 sm:px-4"
      style={{ height: TASKBAR_HEIGHT, background: theme.taskbar, borderTop: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className="flex items-center gap-2 px-3 py-[7px] shrink-0"
          style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.text }}
        >
          <GridIcon />
          <span className="os-mono text-xs font-semibold">MENU</span>
        </button>

        <span className="hidden sm:block h-5 w-px" style={{ background: theme.border }} />

        <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
          {visibleOrder.map((section) => {
            const isMinimized = minimizedSections.has(section);
            const isActive = activeSection === section && !isMinimized;
            const isDragOver = dragOverSection === section && draggingSection !== section;
            return (
              <div
                key={section}
                data-taskbar-tab={section}
                ref={(el) => {
                  tabRefs.current[section] = el;
                }}
                draggable
                onDragStart={(e) => {
                  setDraggingSection(section);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", section);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragOverSection !== section) setDragOverSection(section);
                }}
                onDragEnd={() => {
                  setDraggingSection(null);
                  setDragOverSection(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(section);
                }}
                onMouseEnter={() => scheduleHover(section)}
                onMouseLeave={cancelHover}
                onClick={() => onNavigateSection(section)}
                title={SECTION_META[section].file}
                aria-label={SECTION_META[section].file}
                className="group relative flex h-8 w-8 select-none cursor-grab items-center justify-center transition-colors duration-200 active:cursor-grabbing"
                style={{
                  color: isActive ? theme.text : isMinimized ? theme.textDim : theme.textMuted,
                  background: isActive ? theme.accentSoft : "transparent",
                  borderTop: isActive ? `2px solid ${theme.accent}` : "2px solid transparent",
                  borderLeft: isDragOver ? `2px solid ${theme.accent}` : "2px solid transparent",
                  opacity: draggingSection === section ? 0.4 : isMinimized ? 0.6 : 1,
                }}
              >
                <SectionIcon section={section} size={15} />
                {isMinimized && (
                  <span
                    className="absolute bottom-[3px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    style={{ background: theme.textDim }}
                  />
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseSection(section);
                  }}
                  aria-label={`Close ${SECTION_META[section].file}`}
                  className="absolute right-0 top-0 hidden h-3 w-3 items-center justify-center group-hover:flex"
                  style={{ background: theme.panel, border: `1px solid ${theme.border}`, color: theme.textMuted }}
                >
                  <CloseGlyph size={6} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="sm:hidden flex items-center gap-2 min-w-0">
          <span className="os-mono text-xs truncate" style={{ color: theme.text }}>
            {SECTION_META[activeSection]?.file}
          </span>
          <button
            type="button"
            onClick={onOpenSwitcher}
            aria-label="Open window switcher"
            className="os-mono text-[10px] px-1.5 py-0.5 shrink-0"
            style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.textMuted }}
          >
            {openSections.length}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
          <span className="hidden xs:inline os-mono text-[11px]" style={{ color: theme.textMuted }}>
            AVAILABLE
          </span>
        </div>
        <span className="h-4 w-px" style={{ background: theme.border }} />
        <span className="os-mono text-xs" style={{ color: theme.text }}>
          {time}
        </span>
      </div>

      {hoveredSection && previewRect && (
        <div
          className="fixed z-50 overflow-hidden pointer-events-none"
          style={{
            left: Math.min(Math.max(8, previewRect.left), window.innerWidth - PREVIEW_W - 8),
            bottom: TASKBAR_HEIGHT + 8,
            width: PREVIEW_W,
            background: theme.panel,
            border: `1px solid ${theme.borderStrong}`,
            boxShadow: `0 16px 40px -12px ${theme.shadow}`,
          }}
        >
          <div
            className="os-mono flex items-center justify-between px-2 py-1 text-[10px]"
            style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}`, color: theme.textMuted }}
          >
            <span>{SECTION_META[hoveredSection].file}</span>
            {activeSection === hoveredSection && <span style={{ color: theme.accent }}>current</span>}
          </div>
          <div
            className="flex items-center justify-center"
            style={{ width: PREVIEW_W, height: PREVIEW_H, background: theme.bg }}
          >
            {previewImage ? (
              <img src={previewImage} alt="" className="h-full w-full object-cover object-top" />
            ) : (
              <span className="os-mono text-[10px]" style={{ color: theme.textDim }}>
                {thumbLoading === hoveredSection ? "capturing preview..." : "preview unavailable"}
              </span>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Taskbar;
