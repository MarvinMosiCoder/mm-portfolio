import React, { useState } from "react";
import { getOsTheme } from "../../theme/osTheme";
import { WinControls } from "./OsIcons";

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
}

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
}) => {
  const theme = getOsTheme(darkMode);
  const [maximized, setMaximized] = useState(false);

  const handleMaximize = () => setMaximized((v) => !v);

  return (
    <div
      className={
        maximized
          ? "relative left-1/2 w-[calc(100vw_-_var(--sbw,0px))] max-w-[calc(100vw_-_var(--sbw,0px))] -translate-x-1/2 px-4 transition-all duration-300 sm:px-8 2xl:pl-40 2xl:pr-10"
          : "w-full transition-all duration-300"
      }
    >
      <div
        className="overflow-hidden transition-colors duration-500"
        data-aos={aos}
        data-aos-delay={aosDelay}
        style={{
          background: theme.panel,
          border: `1px solid ${theme.borderStrong}`,
          borderTop: `2px solid ${active ? theme.accent : theme.border}`,
          boxShadow: `0 24px 50px -20px ${theme.shadow}`,
        }}
      >
        <div
          className="flex h-9 items-center justify-between px-3"
          style={{
            background: active ? theme.titlebarActive : theme.titlebar,
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <div className="flex items-center gap-2.5" style={{ color: active ? theme.textMuted : theme.textDim }}>
            <WinControls
              dim={!active}
              onMinimize={onMinimize}
              minimizeLabel={`Minimize ${title}`}
              onMaximize={handleMaximize}
              maximized={maximized}
              maximizeLabel={`${maximized ? "Restore" : "Maximize"} ${title}`}
              onClose={onClose}
              closeLabel={`Close ${title}`}
            />
            <span className="os-mono text-xs" style={{ color: active ? theme.text : theme.textDim }}>
              {title}
            </span>
          </div>
          {active && (
            <span className="os-mono text-[10px] tracking-wider" style={{ color: theme.accent }}>
              ACTIVE
            </span>
          )}
        </div>
        <div className={bodyClassName ?? "p-5 sm:p-7"}>{children}</div>
      </div>
    </div>
  );
};

export default WindowChrome;
