import React, { useEffect, useState } from "react";
import { getOsTheme } from "../../theme/osTheme";
import { LogoMark } from "./OsIcons";

const BOOT_LINES = [
  "mounting /system",
  "loading about.sys",
  "indexing projects/ — 9 entries",
  "parsing experience.log",
  "establishing contact channel",
  "applying theme",
];

const SESSION_KEY = "marvinmosicoos-booted";

interface BootScreenProps {
  darkMode: boolean;
}

const BootScreen: React.FC<BootScreenProps> = ({ darkMode }) => {
  const theme = getOsTheme(darkMode);
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });
  const [closing, setClosing] = useState(false);

  const finish = React.useCallback(() => {
    setClosing(true);
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // storage unavailable — still allow the overlay to close
    }
    window.setTimeout(() => setVisible(false), 350);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(finish, 2600);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, finish]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-6 transition-opacity duration-300 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: theme.bg }}
      role="dialog"
      aria-label="Loading MarvinMosico.OS"
    >
      <button
        type="button"
        onClick={finish}
        className="os-mono absolute right-6 top-6 text-xs underline-offset-2 hover:underline"
        style={{ color: theme.textDim }}
      >
        skip intro
      </button>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span style={{ color: theme.accent }}>
            <LogoMark size={28} />
          </span>
          <div>
            <div className="os-mono text-lg font-semibold tracking-wide" style={{ color: theme.text }}>
              MARVINMOSICO//OS
            </div>
            <div className="os-mono text-[10px] tracking-wide" style={{ color: theme.textDim }}>
              WORKSTATION EDITION
            </div>
          </div>
        </div>

        <div className="h-px mb-5" style={{ background: theme.border }} />

        <div className="flex flex-col gap-2 os-mono text-xs">
          {BOOT_LINES.map((line) => (
            <div key={line} className="flex justify-between">
              <span style={{ color: theme.textMuted }}>
                <span style={{ color: theme.success }}>[ok]</span> {line}
              </span>
              <span style={{ color: theme.textDim }}>done</span>
            </div>
          ))}
        </div>

        <div className="mt-5 h-1 w-full" style={{ background: theme.border }}>
          <div className="h-full w-full" style={{ background: theme.accent }} />
        </div>

        <p className="os-mono text-sm mt-6" style={{ color: theme.textMuted }}>
          &gt; welcome, guest.
          <br />
          &gt; full-stack workstation ready.
        </p>

        <button
          type="button"
          onClick={finish}
          className="os-mono mt-6 inline-flex items-center gap-2 border px-5 py-3 text-xs font-semibold tracking-wide transition-colors"
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          [ ENTER DESKTOP ]
          <span className="os-cursor inline-block h-3.5 w-2" style={{ background: theme.accent }} />
        </button>
      </div>
    </div>
  );
};

export default BootScreen;
