import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FiFileText, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";
import { ChessIcon, CloseGlyph, PinballIcon, SectionIcon, SolitaireIcon } from "./OsIcons";
import { SECTIONS, SECTION_META, SectionKey } from "./constants";

interface MobileNavPanelProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onClose: () => void;
  activeIndex: number;
  closedSections: Set<SectionKey>;
  minimizedSections: Set<SectionKey>;
  onNavigateSection: (section: SectionKey) => void;
  onOpenChess: () => void;
  onOpenSolitaire: () => void;
  onOpenPinball: () => void;
}

const MobileNavPanel: React.FC<MobileNavPanelProps> = ({
  darkMode,
  setDarkMode,
  open,
  onClose,
  activeIndex,
  closedSections,
  minimizedSections,
  onNavigateSection,
  onOpenChess,
  onOpenSolitaire,
  onOpenPinball,
}) => {
  const theme = getOsTheme(darkMode);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Drop any in-progress search once the panel closes, so it reopens fresh.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const q = query.trim().toLowerCase();
  const matchesQuery = (label: string, file: string) =>
    q === "" || label.toLowerCase().includes(q) || file.toLowerCase().includes(q);
  const visibleSections = SECTIONS.filter((section) => matchesQuery(SECTION_META[section].label, SECTION_META[section].file));
  const resumeVisible = matchesQuery("Resume", "resume.pdf");
  const extraApps: { key: string; file: string; label: string; icon: React.ReactNode; onOpen: () => void }[] = [
    { key: "chess", file: "chess.app", label: "Chess", icon: <ChessIcon size={15} />, onOpen: onOpenChess },
    { key: "solitaire", file: "solitaire.app", label: "Solitaire", icon: <SolitaireIcon size={15} />, onOpen: onOpenSolitaire },
    { key: "pinball", file: "pinball.app", label: "Pinball", icon: <PinballIcon size={15} />, onOpen: onOpenPinball },
  ];
  const visibleExtraApps = extraApps.filter((app) => matchesQuery(app.label, app.file));
  const hasResults = visibleSections.length > 0 || resumeVisible || visibleExtraApps.length > 0;

  return (
    <>
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px]"
        />
      )}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed left-0 top-0 z-50 h-full w-[82%] max-w-[300px] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: theme.panel, borderRight: `1px solid ${theme.borderStrong}`, boxShadow: `0 0 60px ${theme.shadow}` }}
      >
        <div
          className="flex h-9 items-center justify-between px-3"
          style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}
        >
          <span className="os-mono text-xs" style={{ color: theme.text }}>menu.app</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-[18px] w-[18px] items-center justify-center border"
            style={{ borderColor: theme.borderStrong, color: theme.textMuted }}
          >
            <CloseGlyph />
          </button>
        </div>

        <div className="px-3 pt-3">
          <div
            className="flex items-center gap-2 px-2.5 py-2"
            style={{ border: `1px solid ${theme.border}`, background: theme.bg }}
          >
            <FiSearch size={13} style={{ color: theme.textDim }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search apps..."
              aria-label="Search apps"
              className="os-mono w-full bg-transparent text-sm outline-none placeholder:opacity-40"
              style={{ color: theme.text }}
            />
          </div>
        </div>

        <nav className="flex flex-col p-3">
          {visibleSections.map((section) => {
            const index = SECTIONS.indexOf(section);
            const isActive = activeIndex === index;
            const isClosed = closedSections.has(section);
            const isMinimized = minimizedSections.has(section);
            return (
              <button
                key={section}
                type="button"
                onClick={() => {
                  onNavigateSection(section);
                  onClose();
                }}
                className="os-mono flex items-center gap-2.5 text-sm px-3 py-3 cursor-pointer transition-colors duration-300"
                style={{
                  color: isActive ? theme.text : isClosed || isMinimized ? theme.textDim : theme.textMuted,
                  background: isActive ? theme.accentSoft : "transparent",
                  borderLeft: isActive ? `2px solid ${theme.accent}` : "2px solid transparent",
                }}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center" style={{ color: "inherit" }}>
                  <SectionIcon section={section} size={15} />
                </span>
                <span className="flex-1 text-left">{SECTION_META[section].file}</span>
                {(isClosed || isMinimized) && (
                  <span className="os-mono text-[10px] tracking-wide" style={{ color: theme.textDim }}>
                    {isClosed ? "closed" : "minimized"}
                  </span>
                )}
              </button>
            );
          })}
          {resumeVisible && (
            <RouterLink
              to="/resume"
              onClick={onClose}
              className="os-mono flex items-center gap-2.5 text-sm px-3 py-3"
              style={{ color: theme.textMuted, borderLeft: "2px solid transparent" }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                <FiFileText size={15} />
              </span>
              resume.pdf
            </RouterLink>
          )}
          {visibleExtraApps.map((app) => (
            <button
              key={app.key}
              type="button"
              onClick={() => {
                app.onOpen();
                onClose();
              }}
              className="os-mono flex items-center gap-2.5 text-sm px-3 py-3 cursor-pointer"
              style={{ color: theme.textMuted, borderLeft: "2px solid transparent" }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">{app.icon}</span>
              <span className="flex-1 text-left">{app.file}</span>
            </button>
          ))}
          {!hasResults && (
            <p className="os-mono px-3 py-3 text-xs" style={{ color: theme.textDim }}>
              No apps match "{query}"
            </p>
          )}
        </nav>

        <div className="mt-2 flex items-center justify-between px-3 py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
          <span className="os-mono text-[11px]" style={{ color: theme.textDim }}>THEME</span>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setDarkMode((v) => !v)}
            className="flex h-7 w-7 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            {darkMode ? <FiSun size={13} /> : <FiMoon size={13} />}
          </button>
        </div>

        <div className="absolute bottom-0 w-full px-3 py-3 os-mono text-[11px]" style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}>
          © {new Date().getFullYear()} Marvin Mosico
        </div>
      </aside>
    </>
  );
};

export default MobileNavPanel;
