import React from "react";
import { FiFolder, FiList, FiMail, FiUser } from "react-icons/fi";
import { SectionKey } from "./constants";

export const LogoMark: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
    <rect x="0.5" y="0.5" width="15" height="15" stroke="currentColor" strokeWidth="1" fill="none" />
    <path
      d="M4 11V5l4 4 4-4v6"
      stroke="currentColor"
      strokeWidth="1.3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface WinControlsProps {
  dim?: boolean;
  onClose?: () => void;
  closeLabel?: string;
  onMinimize?: () => void;
  minimized?: boolean;
  minimizeLabel?: string;
  onMaximize?: () => void;
  maximized?: boolean;
  maximizeLabel?: string;
}

export const WinControls: React.FC<WinControlsProps> = ({
  dim,
  onClose,
  closeLabel = "Close window",
  onMinimize,
  minimized,
  minimizeLabel = "Minimize window",
  onMaximize,
  maximized,
  maximizeLabel = "Maximize window",
}) => {
  const boxCls = (pressed?: boolean) =>
    `flex h-[18px] w-[18px] items-center justify-center border transition-colors ${
      dim ? "border-current opacity-40" : pressed ? "border-current bg-current/10 opacity-100" : "border-current opacity-70"
    }`;

  return (
    <div className="flex items-center gap-1.5">
      {onMinimize ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          aria-label={minimizeLabel}
          aria-pressed={minimized}
          className={`${boxCls(minimized)} hover:opacity-100`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      ) : (
        <span className={boxCls()} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1" y1="4" x2="7" y2="4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      )}

      {onMaximize ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          aria-label={maximizeLabel}
          aria-pressed={maximized}
          className={`${boxCls(maximized)} hover:opacity-100`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
      ) : (
        <span className={boxCls()} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </span>
      )}

      {onClose ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={closeLabel}
          className={`${boxCls()} hover:border-current hover:opacity-100 hover:text-[#e05d5d]`}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1.2" />
            <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      ) : (
        <span className={boxCls()} aria-hidden="true">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1.2" />
            <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      )}
    </div>
  );
};

export const GridIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0" width="5" height="5" />
    <rect x="7" y="0" width="5" height="5" />
    <rect x="0" y="7" width="5" height="5" />
    <rect x="7" y="7" width="5" height="5" />
  </svg>
);

export const CloseGlyph: React.FC<{ size?: number }> = ({ size = 8 }) => (
  <svg width={size} height={size} viewBox="0 0 8 8" aria-hidden="true">
    <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1.1" />
    <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ size?: number }>> = {
  about: FiUser,
  experience: FiList,
  projects: FiFolder,
  contact: FiMail,
};

export const SectionIcon: React.FC<{ section: SectionKey; size?: number }> = ({ section, size = 16 }) => {
  const Icon = SECTION_ICONS[section];
  return <Icon size={size} />;
};
