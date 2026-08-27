import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";
import { CloseGlyph } from "./OsIcons";
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
}) => {
  const theme = getOsTheme(darkMode);

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
        className={`fixed right-0 top-0 z-50 h-full w-[82%] max-w-[300px] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ background: theme.panel, borderLeft: `1px solid ${theme.borderStrong}`, boxShadow: `0 0 60px ${theme.shadow}` }}
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

        <nav className="flex flex-col p-3">
          {SECTIONS.map((section, index) => {
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
                className="os-mono flex items-center justify-between text-sm px-3 py-3 cursor-pointer transition-colors duration-300"
                style={{
                  color: isActive ? theme.text : isClosed || isMinimized ? theme.textDim : theme.textMuted,
                  background: isActive ? theme.accentSoft : "transparent",
                  borderLeft: isActive ? `2px solid ${theme.accent}` : "2px solid transparent",
                }}
              >
                <span>{SECTION_META[section].file}</span>
                {(isClosed || isMinimized) && (
                  <span className="os-mono text-[10px] tracking-wide" style={{ color: theme.textDim }}>
                    {isClosed ? "closed" : "minimized"}
                  </span>
                )}
              </button>
            );
          })}
          <RouterLink
            to="/resume"
            onClick={onClose}
            className="os-mono text-sm px-3 py-3"
            style={{ color: theme.textMuted, borderLeft: "2px solid transparent" }}
          >
            resume.pdf
          </RouterLink>
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
