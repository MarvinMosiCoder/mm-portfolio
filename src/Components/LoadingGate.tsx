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
          {/* Circular monogram M */}
            <svg
                className="logo"
                viewBox="0 0 180 180"
                width="180"
                height="180"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="mGradient" x1="12%" y1="88%" x2="88%" y2="12%">
                        <stop offset="0%" stopColor="var(--grad-from)" />
                        <stop offset="44%" stopColor="var(--grad-via)" />
                        <stop offset="100%" stopColor="var(--grad-to)" />
                    </linearGradient>
                    <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="48%" stopColor="rgba(255,255,255,0.9)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                </defs>

                <circle
                    className="ring ring-soft"
                    cx="90"
                    cy="90"
                    r="67"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                />
                <circle
                    className="ring"
                    cx="90"
                    cy="90"
                    r="60"
                    pathLength={1}
                    vectorEffect="non-scaling-stroke"
                />
                <path
                    d="M49 119 L49 61 L90 116 L131 61 L131 119"
                    pathLength={1}
                    className="monogram-shadow"
                    vectorEffect="non-scaling-stroke"
                />
                <path
                    d="M50 119 L50 61 L90 116 L130 61 L130 119"
                    pathLength={1}
                    className="monogram"
                    vectorEffect="non-scaling-stroke"
                />
                <path
                    d="M60 48 C76 38 104 38 120 48"
                    pathLength={1}
                    className="shine"
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
  min-height: 100dvh;
  width: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.16), transparent 18rem),
    #070b14;

  --grad-from: #14b8a6;
  --grad-via:  #67e8f9;
  --grad-to:   #f0abfc;

  @media (prefers-color-scheme: dark) {
    --grad-from: #14b8a6;
    --grad-via:  #67e8f9;
    --grad-to:   #f0abfc;
  }

  :where(.dark) & {
    --grad-from: #14b8a6;
    --grad-via:  #67e8f9;
    --grad-to:   #f0abfc;
  }

  .stage {
    display: grid;
    place-items: center;
    padding: 3rem;
  }

  .logo {
    display: block;
    width: min(52vw, 180px);
    height: auto;
    overflow: visible;
  }

  .ring,
  .monogram,
  .monogram-shadow,
  .shine {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .ring {
    stroke: url(#mGradient);
    stroke-width: 3.5;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0.9;
    animation: draw 0.85s cubic-bezier(0.65, 0, 0.35, 1) forwards,
      glow 2.8s ease-in-out 1s infinite;
    filter:
      drop-shadow(0 0 10px rgba(20, 184, 166, 0.26))
      drop-shadow(0 0 22px rgba(240, 171, 252, 0.13));
  }

  .ring-soft {
    stroke: rgba(255, 255, 255, 0.08);
    stroke-width: 11;
    animation-delay: 0.05s, 1s;
    filter: blur(0.2px);
  }

  .monogram-shadow {
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 16;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 0.9s ease-out 0.18s forwards;
  }

  .monogram {
    stroke: url(#mGradient);
    stroke-width: 10;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: draw 0.95s cubic-bezier(0.65, 0, 0.35, 1) 0.22s forwards,
      glow 2.8s ease-in-out 1.15s infinite;
    filter:
      drop-shadow(0 0 10px rgba(20, 184, 166, 0.28))
      drop-shadow(0 0 24px rgba(240, 171, 252, 0.16));
  }

  .shine {
    stroke: url(#shineGradient);
    stroke-width: 5;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    opacity: 0;
    animation: glint 1.2s ease 0.95s forwards;
  }

  @keyframes draw {
    to { stroke-dashoffset: 0; }
  }

  @keyframes glow {
    0%, 100% {
      filter:
        drop-shadow(0 0 10px rgba(20, 184, 166, 0.24))
        drop-shadow(0 0 24px rgba(240, 171, 252, 0.14));
    }
    50% {
      filter:
        drop-shadow(0 0 18px rgba(103, 232, 249, 0.35))
        drop-shadow(0 0 34px rgba(240, 171, 252, 0.22));
    }
  }

  @keyframes glint {
    0% {
      opacity: 0;
      stroke-dashoffset: 1;
    }
    35%, 70% {
      opacity: 0.9;
    }
    100% {
      opacity: 0;
      stroke-dashoffset: 0;
    }
  }
`;

export default LoadingGate;
