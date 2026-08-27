import React, { useEffect, useState } from "react";
import { getOsTheme } from "../../theme/osTheme";

export interface GhostRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface MinimizeGhostProps {
  darkMode: boolean;
  label: string;
  from: GhostRect;
  to: GhostRect;
  onDone: () => void;
}

const TRANSITION_MS = 380;

const MinimizeGhost: React.FC<MinimizeGhostProps> = ({ darkMode, label, from, to, onDone }) => {
  const theme = getOsTheme(darkMode);
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    // paint at `from` first, then flip to `to` on the next frame so the
    // transition actually has a starting point to animate away from.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlying(true));
    });
    const timeout = window.setTimeout(onDone, TRANSITION_MS + 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
    };
  }, [onDone]);

  const rect = flying ? to : from;

  return (
    <div
      aria-hidden="true"
      className="fixed z-[70] pointer-events-none overflow-hidden"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        opacity: flying ? 0 : 1,
        transform: flying ? "scale(0.85)" : "scale(1)",
        transformOrigin: "top left",
        transition: `left ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.7,0.2), top ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.7,0.2), width ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.7,0.2), height ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.7,0.2), opacity ${TRANSITION_MS}ms ease-in, transform ${TRANSITION_MS}ms ease-in`,
        background: theme.panel,
        border: `1px solid ${theme.accent}`,
        boxShadow: `0 16px 34px -12px ${theme.shadow}`,
      }}
    >
      <div
        className="os-mono flex h-9 items-center px-3 text-xs"
        style={{ color: theme.text, background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}
      >
        {label}
      </div>
    </div>
  );
};

export default MinimizeGhost;
