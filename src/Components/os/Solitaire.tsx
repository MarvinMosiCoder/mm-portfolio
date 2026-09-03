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
// Reuses the same red already used for form-error text elsewhere, so card
// suits stay inside the app's existing palette instead of a one-off color.
const RED = "#e05d5d";

const CARD_W = 56;
const CARD_H = 78;
const STACK_OFFSET = 24;
const BOARD_WIDTH = CARD_W * 7 + 12 * 6;

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
  card: Card;
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}> = ({ theme, card, selected, onClick, style }) => {
  const isRed = RED_SUITS.has(card.suit);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={card.faceUp ? `${rankLabel(card.rank)} of ${card.suit}` : "face-down card"}
      className="flex flex-col items-start p-1 text-left"
      style={{
        position: "absolute",
        width: CARD_W,
        height: CARD_H,
        background: card.faceUp ? theme.panel : theme.borderStrong,
        border: `1px solid ${selected ? theme.accent : theme.borderStrong}`,
        boxShadow: selected ? `0 0 0 2px ${theme.accent}` : undefined,
        ...style,
      }}
    >
      {card.faceUp && (
        <>
          <span className="os-mono text-[11px] leading-none" style={{ color: isRed ? RED : theme.text }}>
            {rankLabel(card.rank)}
            {SUIT_GLYPH[card.suit]}
          </span>
          <span className="flex flex-1 w-full items-center justify-center" style={{ color: isRed ? RED : theme.text, fontSize: 20 }}>
            {SUIT_GLYPH[card.suit]}
          </span>
        </>
      )}
    </button>
  );
};

const SlotView: React.FC<{
  theme: OsTheme;
  card?: Card;
  faceDown?: boolean;
  placeholder?: string;
  selected?: boolean;
  onClick: () => void;
  ariaLabel: string;
}> = ({ theme, card, faceDown, placeholder, selected, onClick, ariaLabel }) => {
  const isRed = card && RED_SUITS.has(card.suit);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex shrink-0 items-center justify-center"
      style={{
        width: CARD_W,
        height: CARD_H,
        border: `1px solid ${selected ? theme.accent : theme.border}`,
        background: card ? (faceDown ? theme.borderStrong : theme.panel) : "transparent",
        boxShadow: selected ? `0 0 0 2px ${theme.accent}` : undefined,
      }}
    >
      {card && !faceDown && (
        <span className="os-mono" style={{ color: isRed ? RED : theme.text, fontSize: 18 }}>
          {rankLabel(card.rank)}
          {SUIT_GLYPH[card.suit]}
        </span>
      )}
      {!card && placeholder && (
        <span className="os-mono text-lg" style={{ color: theme.textDim }}>
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
        <div className="flex items-center gap-2">
          <span className="os-mono text-sm font-semibold" style={{ color: theme.text }}>
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={newGame}
            className="os-mono text-xs px-2.5 h-8 border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            New game
          </button>
          <button
            type="button"
            onClick={undo}
            disabled={history.length === 0}
            className="os-mono text-xs px-2.5 h-8 border disabled:opacity-40"
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
        <div className="mx-auto" style={{ width: BOARD_WIDTH }}>
          <div className="flex gap-3 mb-6">
            <SlotView
              theme={theme}
              card={state.stock[state.stock.length - 1]}
              faceDown
              placeholder={state.stock.length === 0 ? "↺" : undefined}
              onClick={drawStock}
              ariaLabel={state.stock.length > 0 ? "Draw a card" : "Recycle waste pile"}
            />
            <SlotView
              theme={theme}
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
                card={state.foundations[suit][state.foundations[suit].length - 1]}
                placeholder={SUIT_GLYPH[suit]}
                onClick={() => onFoundationClick(suit)}
                ariaLabel={`${suit} foundation`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {state.tableau.map((col, ci) => (
              <div
                key={ci}
                role="button"
                tabIndex={-1}
                onClick={() => onColumnClick(ci, null)}
                style={{
                  width: CARD_W,
                  position: "relative",
                  height: CARD_H + Math.max(0, col.length - 1) * STACK_OFFSET,
                }}
              >
                {col.length === 0 && (
                  <div
                    className="absolute"
                    style={{ width: CARD_W, height: CARD_H, border: `1px dashed ${theme.border}` }}
                    aria-hidden="true"
                  />
                )}
                {col.map((card, idx) => (
                  <CardView
                    key={card.id}
                    theme={theme}
                    card={card}
                    selected={isRunSelected(ci, idx)}
                    style={{ top: idx * STACK_OFFSET }}
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
