import React from "react";
import { FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";
import { LogoMark } from "./OsIcons";
import { MENU_BAR_HEIGHT } from "./constants";

interface MenuBarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenMobileMenu: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ darkMode, setDarkMode, onOpenMobileMenu }) => {
  const theme = getOsTheme(darkMode);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 sm:px-6"
      style={{ height: MENU_BAR_HEIGHT, background: theme.menubar, borderBottom: `1px solid ${theme.border}` }}
    >
      <div className="flex items-center gap-2 shrink-0" style={{ color: theme.text }}>
        <LogoMark />
        <span className="os-mono text-xs font-semibold tracking-wide hidden xs:inline">MARVINMOSICO.OS</span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />
          <span className="os-mono text-[11px] tracking-wide" style={{ color: theme.textMuted }}>
            AVAILABLE FOR WORK
          </span>
        </div>
        <span className="sm:hidden h-1.5 w-1.5 rounded-full" style={{ background: theme.accent }} />

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setDarkMode((v) => !v)}
          className="flex h-[22px] w-[22px] items-center justify-center border transition"
          style={{ borderColor: theme.border, color: theme.textMuted }}
        >
          {darkMode ? <FiSun size={12} /> : <FiMoon size={12} />}
        </button>

        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMobileMenu}
          className="md:hidden flex h-[22px] w-[22px] items-center justify-center"
          style={{ color: theme.text }}
        >
          <FiMenu size={16} />
        </button>
      </div>
    </header>
  );
};

export default MenuBar;
