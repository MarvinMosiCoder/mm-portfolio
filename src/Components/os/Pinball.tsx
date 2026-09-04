import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";

interface PinballProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
}

const TABLE_W = 360;
const TABLE_H = 600;
const BALL_RADIUS = 8;

// Low gravity keeps the ball slow and floaty, but a launch still has to carry
// it the full height of the table — those two pull against each other, so the
// numbers below are derived, not guessed. Rise distance for an impulse u under
// gravity g with per-frame damping d is Σuₙ where uₙ₊₁ = d(uₙ - g), so reach
// scales with u²/g: dropping gravity and the launch together holds the reach
// while everything moves slower. Raising DAMPING instead looks like the same
// idea but is not — extra drag bleeds the climb away and the ball stops
// reaching the bumpers at all. g=0.05 is where the launch starts falling short.
const GRAVITY = 0.06;
const MAX_SPEED = 11.5;
// Per-frame velocity multiplier (air/table friction) — makes the ball bleed
// off speed gradually over the course of a shot instead of only losing
// energy at the moment of a bounce.
const DAMPING = 0.992;
const WALL_RESTITUTION = 0.6;
const BUMPER_RESTITUTION = 0.75;
const BUMPER_KICK = 3;
const FLIPPER_RESTITUTION = 0.5;
// Raised alongside the descent cap: a ball now arrives at the flipper slower,
// so more of the return shot has to come from the flipper itself — at the old
// value a good catch no longer carried back up to the bumpers.
const FLIPPER_KICK = 7;
const FLIPPER_EASE = 0.35;
const START_BALLS = 3;

// A falling ball is the only part of a shot the player has to react to, so the
// descent is held to a much lower cap than the rest of the table. Direction is
// untouched — the ball still steers and accelerates normally, it just tops out
// slow enough to be read and caught. Hitting a bumper or a flipper lifts the
// cap for FULL_SPEED_FRAMES so the shot coming off that hit plays at full
// pace; the cap returns as soon as that window ends and the ball is falling
// again. Free fall alone settles near GRAVITY*DAMPING/(1-DAMPING) ≈ 7.4, so
// the cap is what slows an ordinary drop, not only kicked balls.
const DESCENT_MAX_SPEED = 4;
const FULL_SPEED_FRAMES = 40;
// ...but never in the approach to the flippers. Below this line the cap always
// applies to a falling ball, window or not, so a ball is never handed to the
// player at a speed they cannot react to — 125px at the capped speed is a good
// half-second of reaction time.
const REACTION_ZONE_Y = 420;

// Every surface on this table is a zero-thickness segment, and one frame of
// travel at MAX_SPEED (11.5) is longer than the ball's diameter — so a single
// move-then-test step can put the ball clean through a wall, which the
// resolver then settles on the far side: the ball leaves the table. Movement
// is sliced into steps no longer than this instead, so no surface is crossed
// between two tests. A swinging flipper is the same hazard in reverse (it can
// sweep across a resting ball), so its arc is stepped along with the ball.
const MAX_STEP = BALL_RADIUS * 0.6;
const FLIPPER_SWEEP_STEPS = 10;

// Table geometry lives in a fixed 360x600 logical space; the canvas is scaled
// to fit the viewport via CSS, physics always runs in these logical units.
// Laid out like a real table: a plunger lane down the right, angled shoulders
// at the top, pop bumpers in the upper field, and slingshots feeding the
// flippers. Wall endpoints never touch a free-standing deflector's endpoint —
// that forms a concave notch the ball wedges into or stalls against.
// The top-right corner is a 45° deflector on purpose: it converts the ball's
// straight-up launch into level, leftward travel predictably. A steeper wall
// there reflects at a glancing angle instead, which made the exit height swing
// wildly (y 56→136) on tiny launch changes and often dribbled the ball straight
// back down the lane.
const LANE_X = 303;
const WALLS: [number, number, number, number][] = [
  [20, 580, 20, 125], // left wall
  [20, 125, 75, 70], // left shoulder
  [75, 70, 290, 70], // top
  [290, 70, 340, 120], // corner deflector — throws the launched ball into the field
  [340, 120, 340, 580], // right wall (outer edge of the plunger lane)
  [LANE_X, 580, LANE_X, 150], // plunger-lane divider, open at the top
];

// Ball guides: the rails a real table uses to gather a ball rolling down
// either side and feed it onto the flipper, rather than letting it drain past
// the outside. Each runs straight from a side wall down to a flipper pivot,
// meeting the flipper at a shallower angle than its own, so the ball rolls
// from rail onto flipper instead of catching on the join. The corner where a
// guide meets its wall opens upward-into-play, so the two surface normals
// there push the ball out rather than pinching it. With these in, the only
// drain is the gap between the flippers.
const GUIDES: [number, number, number, number][] = [
  [20, 470, 95, 545],
  [LANE_X, 470, 230, 545],
];

// Sited on the arc the ball actually flies after the corner deflector throws
// it left — a centred cluster looks tidier but sits beside that path, so a
// launch sails past without touching anything.
const BUMPERS = [
  { x: 196, y: 172, r: 19 },
  { x: 126, y: 208, r: 19 },
  { x: 170, y: 260, r: 19 },
];

// Flipper tips are kept a constant 64px from their pivot in both states, so
// the flipper reads as a rigid arm swinging rather than one that stretches.
const LEFT_PIVOT = { x: 95, y: 545 };
const LEFT_REST_TIP = { x: 152, y: 574 };
const LEFT_ACTIVE_TIP = { x: 144, y: 504 };

const RIGHT_PIVOT = { x: 230, y: 545 };
const RIGHT_REST_TIP = { x: 173, y: 574 };
const RIGHT_ACTIVE_TIP = { x: 181, y: 504 };

// Centred in the plunger lane with clearance from both its walls, so the ball
// never rests touching a surface and launches straight up without drifting
// into the divider.
const LAUNCH_POS = { x: 321, y: 535 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Point = { x: number; y: number };
const tipAt = (rest: Point, active: Point, frac: number): Point => ({
  x: lerp(rest.x, active.x, frac),
  y: lerp(rest.y, active.y, frac),
});

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function closestPointOnSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const abx = bx - ax;
  const aby = by - ay;
  const lenSq = abx * abx + aby * aby || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * abx + (py - ay) * aby) / lenSq));
  return { x: ax + abx * t, y: ay + aby * t };
}

function collideSegment(ball: Ball, ax: number, ay: number, bx: number, by: number, restitution: number, kick: number): boolean {
  const cp = closestPointOnSegment(ball.x, ball.y, ax, ay, bx, by);
  const dx = ball.x - cp.x;
  const dy = ball.y - cp.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= BALL_RADIUS || dist <= 1e-4) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  ball.x += nx * (BALL_RADIUS - dist);
  ball.y += ny * (BALL_RADIUS - dist);
  const vDotN = ball.vx * nx + ball.vy * ny;
  if (vDotN < 0) {
    ball.vx -= (1 + restitution) * vDotN * nx;
    ball.vy -= (1 + restitution) * vDotN * ny;
  }
  ball.vx += nx * kick;
  ball.vy += ny * kick;
  return true;
}

function collideCircle(ball: Ball, cx: number, cy: number, cr: number, restitution: number, kick: number): boolean {
  const dx = ball.x - cx;
  const dy = ball.y - cy;
  const dist = Math.hypot(dx, dy);
  const minDist = BALL_RADIUS + cr;
  if (dist >= minDist || dist <= 1e-4) return false;
  const nx = dx / dist;
  const ny = dy / dist;
  ball.x += nx * (minDist - dist);
  ball.y += ny * (minDist - dist);
  const vDotN = ball.vx * nx + ball.vy * ny;
  if (vDotN < 0) {
    ball.vx -= (1 + restitution) * vDotN * nx;
    ball.vy -= (1 + restitution) * vDotN * ny;
  }
  ball.vx += nx * kick;
  ball.vy += ny * kick;
  return true;
}

const Pinball: React.FC<PinballProps> = ({ darkMode, open, onClose }) => {
  const theme = getOsTheme(darkMode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballRef = useRef<Ball>({ x: LAUNCH_POS.x, y: LAUNCH_POS.y, vx: 0, vy: 0 });
  const waitingRef = useRef(true);
  const gameOverRef = useRef(false);
  const ballsRef = useRef(START_BALLS);
  const flippersRef = useRef({ leftFrac: 0, rightFrac: 0, leftActive: false, rightActive: false });
  // Frames of unrestricted speed left over from the last bumper/flipper hit.
  const fullSpeedRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState(START_BALLS);
  const [gameOver, setGameOver] = useState(false);

  const reset = useCallback(() => {
    ballRef.current = { x: LAUNCH_POS.x, y: LAUNCH_POS.y, vx: 0, vy: 0 };
    waitingRef.current = true;
    gameOverRef.current = false;
    ballsRef.current = START_BALLS;
    flippersRef.current = { leftFrac: 0, rightFrac: 0, leftActive: false, rightActive: false };
    fullSpeedRef.current = 0;
    setScore(0);
    setBalls(START_BALLS);
    setGameOver(false);
  }, []);

  const launch = useCallback(() => {
    if (!waitingRef.current || gameOverRef.current) return;
    // Dead vertical: any sideways drift puts the ball into the lane divider
    // long before it clears the top, which reads as the launch "bouncing off"
    // instead of firing.
    ballRef.current.vx = 0;
    ballRef.current.vy = -11;
    waitingRef.current = false;
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") flippersRef.current.leftActive = true;
      if (key === "arrowright" || key === "d") flippersRef.current.rightActive = true;
      if (key === " " || key === "arrowup") {
        e.preventDefault();
        launch();
      }
      if (key === "arrowleft" || key === "arrowright" || key === "arrowdown") e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "arrowleft" || key === "a") flippersRef.current.leftActive = false;
      if (key === "arrowright" || key === "d") flippersRef.current.rightActive = false;
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.body.style.overflow = "";
    };
  }, [open, onClose, launch]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const step = () => {
      const ball = ballRef.current;
      const flip = flippersRef.current;

      const prevLeftFrac = flip.leftFrac;
      const prevRightFrac = flip.rightFrac;
      flip.leftFrac += ((flip.leftActive ? 1 : 0) - flip.leftFrac) * FLIPPER_EASE;
      flip.rightFrac += ((flip.rightActive ? 1 : 0) - flip.rightFrac) * FLIPPER_EASE;
      const leftTip = tipAt(LEFT_REST_TIP, LEFT_ACTIVE_TIP, flip.leftFrac);
      const rightTip = tipAt(RIGHT_REST_TIP, RIGHT_ACTIVE_TIP, flip.rightFrac);

      if (!waitingRef.current && !gameOverRef.current) {
        if (fullSpeedRef.current > 0) fullSpeedRef.current -= 1;

        ball.vy += GRAVITY;
        ball.vx *= DAMPING;
        ball.vy *= DAMPING;

        const descending = ball.vy > 0 && (fullSpeedRef.current === 0 || ball.y > REACTION_ZONE_Y);
        const limit = descending ? DESCENT_MAX_SPEED : MAX_SPEED;
        const speed = Math.hypot(ball.vx, ball.vy);
        if (speed > limit) {
          ball.vx = (ball.vx / speed) * limit;
          ball.vy = (ball.vy / speed) * limit;
        }

        const travel = Math.hypot(ball.vx, ball.vy);
        const sweep = Math.abs(flip.leftFrac - prevLeftFrac) + Math.abs(flip.rightFrac - prevRightFrac);
        const substeps = Math.max(1, Math.ceil(travel / MAX_STEP), Math.ceil(sweep * FLIPPER_SWEEP_STEPS));
        // A bumper resolved on two substeps of the same frame is one hit, not
        // two — score it once.
        const scored = new Set<number>();

        for (let i = 0; i < substeps; i += 1) {
          ball.x += ball.vx / substeps;
          ball.y += ball.vy / substeps;

          const t = (i + 1) / substeps;
          const lTip = tipAt(LEFT_REST_TIP, LEFT_ACTIVE_TIP, lerp(prevLeftFrac, flip.leftFrac, t));
          const rTip = tipAt(RIGHT_REST_TIP, RIGHT_ACTIVE_TIP, lerp(prevRightFrac, flip.rightFrac, t));

          for (const [ax, ay, bx, by] of WALLS) collideSegment(ball, ax, ay, bx, by, WALL_RESTITUTION, 0);
          for (const [ax, ay, bx, by] of GUIDES) collideSegment(ball, ax, ay, bx, by, WALL_RESTITUTION, 0);
          if (collideSegment(ball, LEFT_PIVOT.x, LEFT_PIVOT.y, lTip.x, lTip.y, FLIPPER_RESTITUTION, flip.leftActive ? FLIPPER_KICK : 0)) {
            fullSpeedRef.current = FULL_SPEED_FRAMES;
          }
          if (collideSegment(ball, RIGHT_PIVOT.x, RIGHT_PIVOT.y, rTip.x, rTip.y, FLIPPER_RESTITUTION, flip.rightActive ? FLIPPER_KICK : 0)) {
            fullSpeedRef.current = FULL_SPEED_FRAMES;
          }
          for (let b = 0; b < BUMPERS.length; b += 1) {
            const bumper = BUMPERS[b];
            if (collideCircle(ball, bumper.x, bumper.y, bumper.r, BUMPER_RESTITUTION, BUMPER_KICK)) {
              fullSpeedRef.current = FULL_SPEED_FRAMES;
              if (!scored.has(b)) {
                scored.add(b);
                setScore((sc) => sc + 100);
              }
            }
          }
        }

        // Backstop. Substepping stops the ball crossing a surface between
        // tests, but a flipper swinging into a ball already pinned against a
        // wall can still squeeze it out sideways. Keep it on the table rather
        // than letting it sail off and strand the game with no ball in play.
        if (ball.x < BALL_RADIUS) {
          ball.x = BALL_RADIUS;
          ball.vx = Math.abs(ball.vx) * WALL_RESTITUTION;
        } else if (ball.x > TABLE_W - BALL_RADIUS) {
          ball.x = TABLE_W - BALL_RADIUS;
          ball.vx = -Math.abs(ball.vx) * WALL_RESTITUTION;
        }
        if (ball.y < BALL_RADIUS) {
          ball.y = BALL_RADIUS;
          ball.vy = Math.abs(ball.vy) * WALL_RESTITUTION;
        }

        if (ball.y - BALL_RADIUS > TABLE_H) {
          ballsRef.current -= 1;
          setBalls(ballsRef.current);
          fullSpeedRef.current = 0;
          if (ballsRef.current <= 0) {
            gameOverRef.current = true;
            setGameOver(true);
          } else {
            ballRef.current = { x: LAUNCH_POS.x, y: LAUNCH_POS.y, vx: 0, vy: 0 };
            waitingRef.current = true;
          }
        }
      }

      ctx.clearRect(0, 0, TABLE_W, TABLE_H);
      ctx.fillStyle = theme.panel;
      ctx.fillRect(0, 0, TABLE_W, TABLE_H);

      ctx.strokeStyle = theme.borderStrong;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      for (const [ax, ay, bx, by] of WALLS) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Guides read as polished metal rails.
      ctx.strokeStyle = theme.textMuted;
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      for (const [ax, ay, bx, by] of GUIDES) {
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Pop bumpers: skirt ring plus a solid cap, the way a real one reads.
      for (const b of BUMPERS) {
        ctx.fillStyle = theme.accentSoft;
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = theme.accent;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 0.42, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = theme.text;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(LEFT_PIVOT.x, LEFT_PIVOT.y);
      ctx.lineTo(leftTip.x, leftTip.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(RIGHT_PIVOT.x, RIGHT_PIVOT.y);
      ctx.lineTo(rightTip.x, rightTip.y);
      ctx.stroke();

      if (!gameOverRef.current) {
        ctx.fillStyle = theme.text;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      if (waitingRef.current && !gameOverRef.current) {
        ctx.fillStyle = theme.textMuted;
        ctx.font = "12px 'IBM Plex Mono', ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.fillText("press LAUNCH", TABLE_W / 2, TABLE_H - 10);
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, darkMode, theme]);

  if (!open) return null;

  const flipperButtonProps = (side: "leftActive" | "rightActive") => ({
    onPointerDown: () => {
      flippersRef.current[side] = true;
    },
    onPointerUp: () => {
      flippersRef.current[side] = false;
    },
    onPointerLeave: () => {
      flippersRef.current[side] = false;
    },
    onPointerCancel: () => {
      flippersRef.current[side] = false;
    },
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="Pinball" className="fixed inset-0 z-50 flex flex-col" style={{ background: theme.bg }}>
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${theme.border}`, background: theme.menubar }}
      >
        <div className="flex items-center gap-2">
          <span className="os-mono text-sm font-semibold" style={{ color: theme.text }}>
            pinball.app
          </span>
          <span
            className="os-mono text-[10px] px-1.5 py-0.5"
            style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.textMuted }}
          >
            score {score} · balls {balls}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="os-mono text-xs px-2.5 h-8 border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            New game
          </button>
          <button
            type="button"
            aria-label="Close pinball"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto p-4">
        <canvas
          ref={canvasRef}
          width={TABLE_W}
          height={TABLE_H}
          style={{
            width: `min(88vw, calc((100vh - 220px) * ${TABLE_W / TABLE_H}))`,
            aspectRatio: `${TABLE_W} / ${TABLE_H}`,
            border: `1px solid ${theme.borderStrong}`,
            touchAction: "none",
          }}
        />

        <div className="flex select-none items-center gap-3">
          <button
            type="button"
            aria-label="Left flipper"
            {...flipperButtonProps("leftActive")}
            className="os-mono text-xs px-4 h-10 border"
            style={{ borderColor: theme.border, color: theme.textMuted, touchAction: "none" }}
          >
            ◄ LEFT
          </button>
          <button
            type="button"
            onClick={launch}
            className="os-mono text-xs px-4 h-10 border"
            style={{ borderColor: theme.accent, color: theme.text }}
          >
            LAUNCH
          </button>
          <button
            type="button"
            aria-label="Right flipper"
            {...flipperButtonProps("rightActive")}
            className="os-mono text-xs px-4 h-10 border"
            style={{ borderColor: theme.border, color: theme.textMuted, touchAction: "none" }}
          >
            RIGHT ►
          </button>
        </div>
        <p className="os-mono text-[11px]" style={{ color: theme.textDim }}>
          Arrow keys / A,D to flip · Space to launch
        </p>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: `${theme.bg}E6` }}>
            <span className="os-mono text-lg" style={{ color: theme.text }}>
              GAME OVER
            </span>
            <span className="os-mono text-sm" style={{ color: theme.textMuted }}>
              Score: {score}
            </span>
            <button
              type="button"
              onClick={reset}
              className="os-mono text-xs px-3 py-2 border"
              style={{ borderColor: theme.accent, color: theme.text }}
            >
              Play again
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-3 os-mono text-[11px] shrink-0" style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}>
        {START_BALLS} balls per game — hit the bumpers for points.
      </div>
    </div>
  );
};

export default Pinball;
