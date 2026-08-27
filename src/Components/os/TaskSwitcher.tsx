import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { FiFileText, FiFolder, FiList, FiMail, FiMoon, FiSun, FiUser, FiX } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";
import { useWindowThumbnails } from "../../Hooks/useWindowThumbnails";
import { CloseGlyph } from "./OsIcons";
import { SECTIONS, SECTION_META, SectionKey } from "./constants";

interface TaskSwitcherProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  onClose: () => void;
  activeSection: SectionKey;
  closedSections: Set<SectionKey>;
  minimizedSections: Set<SectionKey>;
  onNavigateSection: (section: SectionKey) => void;
  onCloseSection: (section: SectionKey) => void;
}

const ICONS: Record<SectionKey, React.ReactNode> = {
  about: <FiUser size={22} />,
  experience: <FiList size={22} />,
  projects: <FiFolder size={22} />,
  contact: <FiMail size={22} />,
};

const TaskSwitcher: React.FC<TaskSwitcherProps> = ({
  darkMode,
  setDarkMode,
  open,
  onClose,
  activeSection,
  closedSections,
  minimizedSections,
  onNavigateSection,
  onCloseSection,
}) => {
  const theme = getOsTheme(darkMode);
  const { ensure: ensureThumbnail, get: getThumbnail, loadingSection } = useWindowThumbnails(darkMode);

  const openCount = SECTIONS.filter((s) => !closedSections.has(s)).length;

  useEffect(() => {
    if (!open) return;
    SECTIONS.forEach((s) => {
      if (!closedSections.has(s) && !minimizedSections.has(s)) void ensureThumbnail(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Window switcher"
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: theme.bg }}
    >
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${theme.border}`, background: theme.menubar }}
      >
        <div className="flex items-center gap-2">
          <span className="os-mono text-sm font-semibold" style={{ color: theme.text }}>
            windows
          </span>
          <span
            className="os-mono text-[10px] px-1.5 py-0.5"
            style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.textMuted }}
          >
            {openCount} open
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setDarkMode((v) => !v)}
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            {darkMode ? <FiSun size={14} /> : <FiMoon size={14} />}
          </button>
          <button
            type="button"
            aria-label="Close window switcher"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {SECTIONS.map((section) => {
            const isClosed = closedSections.has(section);
            const isMinimized = minimizedSections.has(section);
            const isActive = activeSection === section && !isClosed && !isMinimized;
            const thumb = !isClosed && !isMinimized ? getThumbnail(section) : null;
            const statusLabel = isClosed ? "CLOSED" : isMinimized ? "MINIMIZED" : isActive ? "ACTIVE" : null;

            const activate = () => {
              onNavigateSection(section);
              onClose();
            };

            return (
              <div
                key={section}
                role="button"
                tabIndex={0}
                aria-label={`Open ${SECTION_META[section].file}`}
                onClick={activate}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    activate();
                  }
                }}
                className="flex cursor-pointer flex-col overflow-hidden text-left transition-colors"
                style={{
                  background: theme.panel,
                  border: `1px solid ${isActive ? theme.accent : theme.borderStrong}`,
                }}
              >
                <div
                  className="flex items-center justify-between px-2.5 py-2"
                  style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}
                >
                  <span className="os-mono text-xs truncate" style={{ color: theme.text }}>
                    {SECTION_META[section].file}
                  </span>
                  {!isClosed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseSection(section);
                      }}
                      aria-label={`Close ${SECTION_META[section].file}`}
                      className="flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ color: theme.textMuted }}
                    >
                      <CloseGlyph />
                    </button>
                  )}
                </div>

                <div
                  className="flex flex-1 items-center justify-center"
                  style={{ height: 108, background: theme.bg }}
                >
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover object-top" />
                  ) : (
                    <span style={{ color: isClosed ? theme.textDim : theme.textMuted, opacity: isClosed ? 0.5 : 1 }}>
                      {loadingSection === section ? (
                        <span className="os-mono text-[10px]" style={{ color: theme.textDim }}>
                          loading...
                        </span>
                      ) : (
                        ICONS[section]
                      )}
                    </span>
                  )}
                </div>

                {statusLabel && (
                  <div
                    className="os-mono px-2.5 py-1.5 text-[10px] tracking-wide"
                    style={{
                      color: isActive ? theme.accent : theme.textDim,
                      borderTop: `1px solid ${theme.border}`,
                    }}
                  >
                    {statusLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <RouterLink
          to="/resume"
          onClick={onClose}
          className="mt-3 flex items-center gap-3 px-3 py-3"
          style={{ background: theme.panel, border: `1px solid ${theme.borderStrong}` }}
        >
          <span className="flex h-8 w-8 items-center justify-center" style={{ color: theme.textMuted }}>
            <FiFileText size={16} />
          </span>
          <span className="os-mono text-sm" style={{ color: theme.text }}>
            resume.pdf
          </span>
        </RouterLink>
      </div>

      <div
        className="px-4 py-3 os-mono text-[11px] shrink-0"
        style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}
      >
        © {new Date().getFullYear()} Marvin Mosico
      </div>
    </div>
  );
};

export default TaskSwitcher;
