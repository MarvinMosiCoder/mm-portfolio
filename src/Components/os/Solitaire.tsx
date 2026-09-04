import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { getOsTheme, OsTheme } from "../../theme/osTheme";

interface SolitaireProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
}

type Suit = "spades" | "hearts" | "diamonds" | "clubs";
interface Card {
  id: string;
  suit: Suit;
  rank: number; // 1 = Ace ... 13 = King
  faceUp: boolean;
}
interface GameState {
  stock: Card[];
  waste: Card[];
  foundations: Record<Suit, Card[]>;
  tableau: Card[][];
}
type Source = { zone: "tableau"; col: number; index: number } | { zone: "waste" };
type Dest = { zone: "tableau"; col: number } | { zone: "foundation"; suit: Suit };

const SUITS: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
const SUIT_GLYPH: Record<Suit, string> = { spades: "♠", hearts: "♥", diamonds: "♦", clubs: "♣" };
const RED_SUITS = new Set<Suit>(["hearts", "diamonds"]);
const RANK_LABEL: Record<number, string> = { 1: "A", 11: "J", 12: "Q", 13: "K" };
const rankLabel = (rank: number) => RANK_LABEL[rank] ?? String(rank);

// A Klondike board is seven columns wide and can't wrap, so on a phone the
// only choices are "scroll sideways for every move" or "shrink the cards".
// These are the full-size desktop numbers; `metricsFor` scales them down to
// whatever width is actually available and never past it.
const CARD_W = 56;
const CARD_ASPECT = 78 / 56;
const BOARD_PADDING = 32;

interface Metrics {
  cardW: number;
  cardH: number;
  gap: number;
  stackOffset: number;
  boardWidth: number;
  rankFont: number;
  suitFont: number;
  slotFont: number;
}

function metricsFor(viewportWidth: number): Metrics {
  const available = Math.max(224, viewportWidth - BOARD_PADDING);
  const gap = available < 420 ? 6 : 12;
  const cardW = Math.min(CARD_W, Math.floor((available - gap * 6) / 7));
  const cardH = Math.round(cardW * CARD_ASPECT);
  return {
    cardW,
    cardH,
    gap,
    // How far each stacked card peeks out from under the one above it. Tied
    // to card height so a shrunken column stays proportional instead of
    // turning into a solid block of overlapping cards.
    stackOffset: Math.max(13, Math.round(cardH * 0.31)),
    boardWidth: cardW * 7 + gap * 6,
    rankFont: Math.max(9, Math.round(cardW * 0.2)),
    suitFont: Math.max(13, Math.round(cardW * 0.36)),
    slotFont: Math.max(12, Math.round(cardW * 0.32)),
  };
}

function shuffledDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) deck.push({ id: `${suit}-${rank}`, suit, rank, faceUp: false });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function newGameState(): GameState {
  const deck = shuffledDeck();
  const tableau: Card[][] = [[], [], [], [], [], [], []];
  let i = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck[i++];
      tableau[col].push({ ...card, faceUp: row === col });
    }
  }
  const stock = deck.slice(i).map((c) => ({ ...c, faceUp: false }));
  return { stock, waste: [], foundations: { spades: [], hearts: [], diamonds: [], clubs: [] }, tableau };
}

function cloneState(state: GameState): GameState {
  return {
    stock: state.stock.map((c) => ({ ...c })),
    waste: state.waste.map((c) => ({ ...c })),
    foundations: {
      spades: state.foundations.spades.map((c) => ({ ...c })),
      hearts: state.foundations.hearts.map((c) => ({ ...c })),
      diamonds: state.foundations.diamonds.map((c) => ({ ...c })),
      clubs: state.foundations.clubs.map((c) => ({ ...c })),
    },
    tableau: state.tableau.map((col) => col.map((c) => ({ ...c }))),
  };
}

function canStackTableau(moving: Card, onto: Card | null): boolean {
  if (!onto) return moving.rank === 13;
  return onto.faceUp && onto.rank === moving.rank + 1 && RED_SUITS.has(onto.suit) !== RED_SUITS.has(moving.suit);
}

function canStackFoundation(moving: Card, pile: Card[]): boolean {
  if (pile.length === 0) return moving.rank === 1;
  const top = pile[pile.length - 1];
  return top.suit === moving.suit && top.rank === moving.rank - 1;
}

const CardView: React.FC<{
  theme: OsTheme;
  metrics: Metrics;
  card: Card;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}> = ({ theme, metrics, card, selected, onClick, style }) => {
  const isRed = RED_SUITS.has(card.suit);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={card.faceUp ? `${rankLabel(card.rank)} of ${card.suit}` : "face-down card"}
      className="flex flex-col items-start p-1 text-left"
      style={{
        position: "absolute",
        width: metrics.cardW,
        height: metrics.cardH,
        background: card.faceUp ? theme.panel : theme.borderStrong,
        border: `1px solid ${selected ? theme.accent : theme.borderStrong}`,
        boxShadow: selected ? `0 0 0 2px ${theme.accent}` : undefined,
        ...style,
      }}
    >
      {card.faceUp && (
        <>
          <span
            className="os-mono leading-none"
            style={{ color: isRed ? theme.danger : theme.text, fontSize: metrics.rankFont }}
          >
            {rankLabel(card.rank)}
            {SUIT_GLYPH[card.suit]}
          </span>
          <span
            className="flex w-full flex-1 items-center justify-center"
            style={{ color: isRed ? theme.danger : theme.text, fontSize: metrics.suitFont }}
          >
            {SUIT_GLYPH[card.suit]}
          </span>
        </>
      )}
    </button>
  );
};

const SlotView: React.FC<{
  theme: OsTheme;
  metrics: Metrics;
  card?: Card;
  faceDown?: boolean;
  placeholder?: string;
  selected?: boolean;
  onClick: () => void;
  ariaLabel: string;
}> = ({ theme, metrics, card, faceDown, placeholder, selected, onClick, ariaLabel }) => {
  const isRed = card && RED_SUITS.has(card.suit);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex shrink-0 items-center justify-center"
      style={{
        width: metrics.cardW,
        height: metrics.cardH,
        border: `1px solid ${selected ? theme.accent : theme.border}`,
        background: card ? (faceDown ? theme.borderStrong : theme.panel) : "transparent",
        boxShadow: selected ? `0 0 0 2px ${theme.accent}` : undefined,
      }}
    >
      {card && !faceDown && (
        <span
          className="os-mono"
          style={{ color: isRed ? theme.danger : theme.text, fontSize: metrics.slotFont }}
        >
          {rankLabel(card.rank)}
          {SUIT_GLYPH[card.suit]}
        </span>
      )}
      {!card && placeholder && (
        <span className="os-mono" style={{ color: theme.textDim, fontSize: metrics.slotFont }}>
          {placeholder}
        </span>
      )}
    </button>
  );
};

const Solitaire: React.FC<SolitaireProps> = ({ darkMode, open, onClose }) => {
  const theme = getOsTheme(darkMode);
  const [state, setState] = useState<GameState>(() => newGameState());
  const [history, setHistory] = useState<GameState[]>([]);
  const [selected, setSelected] = useState<Source | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth
  );
  const metrics = metricsFor(viewportWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  if (!open) return null;

  const newGame = () => {
    setState(newGameState());
    setHistory([]);
    setSelected(null);
  };

  const undo = () => {
    if (history.length === 0) return;
    setState(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setSelected(null);
  };

  const drawStock = () => {
    setHistory((h) => [...h, cloneState(state)]);
    setState((s) => {
      if (s.stock.length === 0) {
        const recycled = [...s.waste].reverse().map((c) => ({ ...c, faceUp: false }));
        return { ...s, stock: recycled, waste: [] };
      }
      const nextStock = [...s.stock];
      const card = { ...nextStock.pop()!, faceUp: true };
      return { ...s, stock: nextStock, waste: [...s.waste, card] };
    });
    setSelected(null);
  };

  const getRun = (source: Source): Card[] => {
    if (source.zone === "waste") {
      const top = state.waste[state.waste.length - 1];
      return top ? [top] : [];
    }
    return state.tableau[source.col].slice(source.index);
  };

  const tryMoveTo = (dest: Dest): boolean => {
    if (!selected) return false;
    const run = getRun(selected);
    if (run.length === 0) return false;
    const mover = run[0];

    if (dest.zone === "foundation") {
      if (run.length !== 1 || !canStackFoundation(mover, state.foundations[dest.suit])) return false;
    } else {
      if (selected.zone === "tableau" && selected.col === dest.col) return false;
      const col = state.tableau[dest.col];
      const top = col.length ? col[col.length - 1] : null;
      if (!canStackTableau(mover, top)) return false;
    }

    setHistory((h) => [...h, cloneState(state)]);
    setState((s) => {
      const next = cloneState(s);
      let moving: Card[];
      if (selected.zone === "waste") {
        moving = [next.waste.pop()!];
      } else {
        moving = next.tableau[selected.col].splice(selected.index);
        const exposed = next.tableau[selected.col];
        if (exposed.length > 0) exposed[exposed.length - 1].faceUp = true;
      }
      if (dest.zone === "foundation") next.foundations[dest.suit].push(...moving);
      else next.tableau[dest.col].push(...moving);
      return next;
    });
    setSelected(null);
    return true;
  };

  const onWasteClick = () => {
    if (!selected) {
      if (state.waste.length > 0) setSelected({ zone: "waste" });
      return;
    }
    if (selected.zone === "waste") {
      setSelected(null);
      return;
    }
    setSelected(state.waste.length > 0 ? { zone: "waste" } : null);
  };

  const onFoundationClick = (suit: Suit) => {
    if (!selected) return;
    tryMoveTo({ zone: "foundation", suit });
  };

  const onColumnClick = (col: number, clickedIndex: number | null) => {
    const canSelectHere = clickedIndex !== null && state.tableau[col][clickedIndex].faceUp;

    if (!selected) {
      if (canSelectHere) setSelected({ zone: "tableau", col, index: clickedIndex as number });
      return;
    }
    if (selected.zone === "tableau" && selected.col === col && selected.index === clickedIndex) {
      setSelected(null);
      return;
    }
    const moved = tryMoveTo({ zone: "tableau", col });
    if (moved) return;
    if (canSelectHere) setSelected({ zone: "tableau", col, index: clickedIndex as number });
    else setSelected(null);
  };

  const isRunSelected = (col: number, index: number) =>
    selected?.zone === "tableau" && selected.col === col && index >= selected.index;

  const won = SUITS.every((s) => state.foundations[s].length === 13);

  return (
    <div role="dialog" aria-modal="true" aria-label="Solitaire" className="fixed inset-0 z-50 flex flex-col" style={{ background: theme.bg }}>
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${theme.border}`, background: theme.menubar }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="os-mono truncate text-sm font-semibold" style={{ color: theme.text }}>
            solitaire.app
          </span>
          {won && (
            <span
              className="os-mono text-[10px] px-1.5 py-0.5"
              style={{ background: theme.accentSoft, border: `1px solid ${theme.accent}`, color: theme.accent }}
            >
              You win!
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={newGame}
            className="os-mono text-xs px-2 sm:px-2.5 h-8 border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            New game
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={history.length === 0}
            className="os-mono text-xs px-2 sm:px-2.5 h-8 border disabled:opacity-40"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            Undo
          </button>
          <button
            type="button"
            aria-label="Close solitaire"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto" style={{ width: metrics.boardWidth }}>
          <div className="flex mb-6" style={{ gap: metrics.gap }}>
            <SlotView
              theme={theme}
              metrics={metrics}
              card={state.stock[state.stock.length - 1]}
              faceDown
              placeholder={state.stock.length === 0 ? "↺" : undefined}
              onClick={drawStock}
              ariaLabel={state.stock.length > 0 ? "Draw a card" : "Recycle waste pile"}
            />
            <SlotView
              theme={theme}
              metrics={metrics}
              card={state.waste[state.waste.length - 1]}
              selected={selected?.zone === "waste"}
              onClick={onWasteClick}
              ariaLabel="Waste pile"
            />
            <div className="flex-1" />
            {SUITS.map((suit) => (
              <SlotView
                key={suit}
                theme={theme}
                metrics={metrics}
                card={state.foundations[suit][state.foundations[suit].length - 1]}
                placeholder={SUIT_GLYPH[suit]}
                onClick={() => onFoundationClick(suit)}
                ariaLabel={`${suit} foundation`}
              />
            ))}
          </div>

          <div className="flex" style={{ gap: metrics.gap }}>
            {state.tableau.map((col, ci) => (
              <div
                key={ci}
                role="button"
                tabIndex={-1}
                onClick={() => onColumnClick(ci, null)}
                style={{
                  width: metrics.cardW,
                  position: "relative",
                  height: metrics.cardH + Math.max(0, col.length - 1) * metrics.stackOffset,
                }}
              >
                {col.length === 0 && (
                  <div
                    className="absolute"
                    style={{ width: metrics.cardW, height: metrics.cardH, border: `1px dashed ${theme.border}` }}
                    aria-hidden="true"
                  />
                )}
                {col.map((card, idx) => (
                  <CardView
                    key={card.id}
                    theme={theme}
                    metrics={metrics}
                    card={card}
                    selected={isRunSelected(ci, idx)}
                    style={{ top: idx * metrics.stackOffset }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColumnClick(ci, idx);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 os-mono text-[11px] shrink-0" style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}>
        Click a card, then click where it should go.
      </div>
    </div>
  );
};

export default Solitaire;
