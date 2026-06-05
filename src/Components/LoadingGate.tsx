import React, { ReactNode, useEffect, useState } from "react";
import styled from "styled-components";

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
      <StyledWrapper>
        <div className="stage" role="status" aria-live="polite" aria-label="Loading">
          {/* Line-drawn M */}
            <svg
                className="logo"
                viewBox="0 0 160 140"
                width="160"
                height="140"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="mGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--grad-from)" />
                    <stop offset="50%" stopColor="var(--grad-via)" />
                    <stop offset="100%" stopColor="var(--grad-to)" />
                    </linearGradient>
                </defs>

                <path
                    d="M20 120 L20 20 L80 120 L140 20 L140 120"
                    pathLength={1}
                    className="stroke"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>
        </div>
      </StyledWrapper>
    );
  }

  return <>{children}</>;
};

const StyledWrapper = styled.div`
  /* Dark background and centering */
  min-height: 100dvh;
  width: 100%;
  display: grid;
  place-items: center;
  background: #0b1120; /* dark slate */

  /* Tailwind-like gradient as CSS variables */
  --grad-from: #2563eb; /* blue-600 */
  --grad-via:  #6366f1; /* indigo-500 */
  --grad-to:   #9333ea; /* purple-600 */

  @media (prefers-color-scheme: dark) {
    --grad-from: #22d3ee; /* cyan-400 */
    --grad-via:  #60a5fa; /* blue-400 */
    --grad-to:   #f472b6; /* pink-400 */
  }

  /* Also support a root class */
  :where(.dark) & {
    --grad-from: #22d3ee;
    --grad-via:  #60a5fa;
    --grad-to:   #f472b6;
  }

  .stage {
    display: grid;
    place-items: center;
    padding: 3rem;
  }

  .logo {
    display: block;
  }

  /* Common stroke style */
  .stroke {
    fill: none;
    stroke: url(#mGradient);
    stroke-width: 10;
    stroke-linecap: round;
    stroke-linejoin: round;

    /* line-draw animation via dashoffset */
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 1s ease forwards, glow 2.8s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.25));
  }

  /* Stagger the strokes so the M draws in sequence */
    .s1 { animation-delay: 0s, 0s; }
    .s2 { animation-delay: 0.10s, 0s; }
    .s3 { animation-delay: 0.20s, 0s; }
    .s4 { animation-delay: 0.30s, 0s; }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(147, 51, 234, 0.20)); }
    50%      { filter: drop-shadow(0 0 16px rgba(99, 102, 241, 0.30)); }
  }
`;

export default LoadingGate;
