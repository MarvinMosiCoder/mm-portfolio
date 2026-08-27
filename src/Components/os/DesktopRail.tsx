import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FiFileText, FiFolder, FiList, FiMail, FiUser } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";
import { MENU_BAR_HEIGHT, SECTIONS, SECTION_META, SectionKey } from "./constants";

interface DesktopRailProps {
  darkMode: boolean;
  activeIndex: number;
  closedSections: Set<SectionKey>;
  minimizedSections: Set<SectionKey>;
  onNavigateSection: (section: SectionKey) => void;
}

const ICONS: Record<SectionKey, React.ReactNode> = {
  about: <FiUser size={17} />,
  experience: <FiList size={17} />,
  projects: <FiFolder size={17} />,
  contact: <FiMail size={17} />,
};

const DesktopRail: React.FC<DesktopRailProps> = ({
  darkMode,
  activeIndex,
  closedSections,
  minimizedSections,
  onNavigateSection,
}) => {
  const theme = getOsTheme(darkMode);

  const iconBox = (isActive: boolean, isClosed: boolean): React.CSSProperties => ({
    width: 40,
    height: 40,
    border: `1px solid ${isActive ? theme.accent : theme.border}`,
    background: isActive ? theme.accentSoft : "transparent",
    color: isActive ? theme.text : theme.textMuted,
    opacity: isClosed ? 0.5 : 1,
  });

  return (
    <div className="hidden 2xl:flex fixed left-8 z-30 flex-col gap-5" style={{ top: MENU_BAR_HEIGHT + 48 }}>
      {SECTIONS.map((section, index) => {
        const isClosed = closedSections.has(section) || minimizedSections.has(section);
        return (
          <button
            key={section}
            type="button"
            onClick={() => onNavigateSection(section)}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center transition-colors" style={iconBox(activeIndex === index, isClosed)}>
              {ICONS[section]}
            </div>
            <span
              className="os-mono text-[9px] tracking-wide"
              style={{ color: activeIndex === index ? theme.text : theme.textDim }}
            >
              {SECTION_META[section].file}
            </span>
          </button>
        );
      })}

      <RouterLink to="/resume">
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="flex items-center justify-center transition-colors" style={iconBox(false, false)}>
            <FiFileText size={17} />
          </div>
          <span className="os-mono text-[9px] tracking-wide" style={{ color: theme.textDim }}>
            resume.pdf
          </span>
        </div>
      </RouterLink>
    </div>
  );
};

export default DesktopRail;
