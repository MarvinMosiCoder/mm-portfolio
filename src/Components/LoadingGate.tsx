import React, { ReactNode, useEffect, useState } from "react";
import { getOsTheme } from "../theme/osTheme";

interface LoadingGateProps {
  children: ReactNode;
  loader?: () => Promise<void>;
  minDurationMs?: number;
}

const LoadingGate: React.FC<LoadingGateProps> = ({
  children,
  loader,
  minDurationMs = 600,
}) => {
  const [ready, setReady] = useState(false);
  const [darkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const theme = getOsTheme(darkMode);

  useEffect(() => {
    const start = performance.now();
    (async () => {
      try {
        if (loader) await loader();
        else await new Promise((r) => setTimeout(r, 800));
      } finally {
        const elapsed = performance.now() - start;
        const remaining = Math.max(0, minDurationMs - elapsed);
        setTimeout(() => setReady(true), remaining);
      }
    })();
  }, [loader, minDurationMs]);

  if (!ready) {
    return (
      <div
        className="min-h-[100dvh] w-full flex items-center justify-center"
        style={{ background: theme.bg }}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center">
          <svg width="64" height="64" viewBox="0 0 16 16" aria-hidden="true">
            <rect
              x="0.5"
              y="0.5"
              width="15"
              height="15"
              stroke={theme.borderStrong}
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M4 11V5l4 4 4-4v6"
              className="os-loading-mark"
              pathLength={1}
              stroke={theme.accent}
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="os-mono mt-4 text-xs tracking-widest" style={{ color: theme.textMuted }}>
            MARVINMOSICO.OS
          </div>
          <div className="os-mono mt-1.5 text-[11px]" style={{ color: theme.textDim }}>
            &gt; booting<span className="os-cursor inline-block h-3 w-[6px] ml-1 align-middle" style={{ background: theme.textDim }} />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingGate;
