import React, { useEffect, useRef } from "react";
import { getOsTheme } from "../../theme/osTheme";

export interface ContextMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  darkMode: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const MENU_WIDTH = 200;
const ITEM_HEIGHT = 33;

const ContextMenu: React.FC<ContextMenuProps> = ({ darkMode, x, y, items, onClose }) => {
  const theme = getOsTheme(darkMode);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onClose);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onClose);
    };
  }, [onClose]);

  const left = Math.max(8, Math.min(x, window.innerWidth - MENU_WIDTH - 8));
  const top = Math.max(8, Math.min(y, window.innerHeight - items.length * ITEM_HEIGHT - 16));

  return (
    <div
      ref={ref}
      role="menu"
      className="fixed z-50 os-mono text-xs"
      style={{
        left,
        top,
        width: MENU_WIDTH,
        background: theme.panel,
        border: `1px solid ${theme.borderStrong}`,
        boxShadow: `0 16px 40px -12px ${theme.shadow}`,
      }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          className="flex w-full items-center px-3 text-left transition-colors disabled:opacity-40"
          style={{
            height: ITEM_HEIGHT,
            color: theme.textMuted,
            borderBottom: i < items.length - 1 ? `1px solid ${theme.border}` : undefined,
          }}
          onMouseEnter={(e) => {
            if (!item.disabled) e.currentTarget.style.background = theme.accentSoft;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
