import React, { useEffect, useRef, useState } from "react";
import { Chess, PieceSymbol, Square } from "chess.js";
import { FiX } from "react-icons/fi";
import { getOsTheme } from "../../theme/osTheme";

interface ChessGameProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
}

const WHITE_GLYPHS: Record<PieceSymbol, string> = { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" };
const BLACK_GLYPHS: Record<PieceSymbol, string> = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
const PROMOTION_CHOICES: { piece: PieceSymbol; label: string }[] = [
  { piece: "q", label: "Queen" },
  { piece: "r", label: "Rook" },
  { piece: "b", label: "Bishop" },
  { piece: "n", label: "Knight" },
];

interface PendingPromotion {
  from: Square;
  to: Square;
  color: "w" | "b";
}

const ChessGame: React.FC<ChessGameProps> = ({ darkMode, open, onClose }) => {
  const theme = getOsTheme(darkMode);
  const chessRef = useRef(new Chess());
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const [selected, setSelected] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

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

  // Clear any in-progress selection/promotion when the dialog closes, but
  // keep the board position itself — reopening resumes the same game.
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setPendingPromotion(null);
    }
  }, [open]);

  const chess = chessRef.current;
  const board = chess.board();
  const turn = chess.turn();
  const legalTargets = selected ? chess.moves({ square: selected, verbose: true }) : [];

  if (!open) return null;

  const newGame = () => {
    chess.reset();
    setSelected(null);
    setPendingPromotion(null);
    refresh();
  };

  const undo = () => {
    chess.undo();
    setSelected(null);
    setPendingPromotion(null);
    refresh();
  };

  const finishMove = (from: Square, to: Square, promotion?: PieceSymbol) => {
    chess.move({ from, to, promotion });
    setSelected(null);
    setPendingPromotion(null);
    refresh();
  };

  const onSquareClick = (square: Square) => {
    if (pendingPromotion) return;

    if (selected) {
      if (square === selected) {
        setSelected(null);
        return;
      }
      const match = legalTargets.find((m) => m.to === square);
      if (match) {
        if (match.promotion) {
          setPendingPromotion({ from: selected, to: square, color: turn });
          setSelected(null);
        } else {
          finishMove(selected, square);
        }
        return;
      }
      const piece = chess.get(square);
      setSelected(piece && piece.color === turn ? square : null);
      return;
    }

    const piece = chess.get(square);
    if (piece && piece.color === turn) setSelected(square);
  };

  const turnLabel = turn === "w" ? "White" : "Black";
  let status: string;
  if (chess.isCheckmate()) status = `Checkmate — ${turnLabel === "White" ? "Black" : "White"} wins`;
  else if (chess.isStalemate()) status = "Stalemate — draw";
  else if (chess.isDraw()) status = "Draw";
  else if (chess.isCheck()) status = `${turnLabel} to move — check`;
  else status = `${turnLabel} to move`;

  return (
    <div role="dialog" aria-modal="true" aria-label="Chess" className="fixed inset-0 z-50 flex flex-col" style={{ background: theme.bg }}>
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 52, borderBottom: `1px solid ${theme.border}`, background: theme.menubar }}
      >
        <div className="flex items-center gap-2">
          <span className="os-mono text-sm font-semibold" style={{ color: theme.text }}>
            chess.app
          </span>
          <span
            className="os-mono text-[10px] px-1.5 py-0.5"
            style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.textMuted }}
          >
            {status}
          </span>
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
            disabled={chess.history().length === 0}
            className="os-mono text-xs px-2.5 h-8 border disabled:opacity-40"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            Undo
          </button>
          <button
            type="button"
            aria-label="Close chess"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.text }}
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-4">
        <div
          className="grid shrink-0"
          style={{
            width: "min(92vw, calc(100vh - 220px), 560px)",
            aspectRatio: "1 / 1",
            gridTemplateColumns: "repeat(8, 1fr)",
            gridTemplateRows: "repeat(8, 1fr)",
            border: `1px solid ${theme.borderStrong}`,
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const square = cell?.square ?? (`${"abcdefgh"[colIndex]}${8 - rowIndex}` as Square);
              const isLight = (rowIndex + colIndex) % 2 === 0;
              const isSelected = selected === square;
              const target = legalTargets.find((m) => m.to === square);
              const glyph = cell ? (cell.color === "w" ? WHITE_GLYPHS[cell.type] : BLACK_GLYPHS[cell.type]) : null;

              return (
                <button
                  type="button"
                  key={square}
                  onClick={() => onSquareClick(square)}
                  aria-label={cell ? `${square}, ${cell.color === "w" ? "white" : "black"} ${cell.type}` : square}
                  className="relative flex items-center justify-center"
                  style={{
                    background: isSelected ? theme.accentSoft : isLight ? theme.surfaceAlt : theme.bg,
                    boxShadow: isSelected ? `inset 0 0 0 2px ${theme.accent}` : undefined,
                  }}
                >
                  {glyph && (
                    <span
                      aria-hidden="true"
                      style={{
                        fontSize: "min(6vw, 34px)",
                        lineHeight: 1,
                        color: cell?.color === "w" ? theme.text : theme.textMuted,
                      }}
                    >
                      {glyph}
                    </span>
                  )}
                  {target && !cell && (
                    <span
                      aria-hidden="true"
                      className="absolute rounded-full"
                      style={{ width: "22%", height: "22%", background: theme.accent, opacity: 0.55 }}
                    />
                  )}
                  {target && cell && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{ boxShadow: `inset 0 0 0 3px ${theme.accent}`, opacity: 0.65 }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>

        {pendingPromotion && (
          <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ background: `${theme.bg}CC` }}>
            <div className="flex flex-col items-center gap-3 p-5" style={{ background: theme.panel, border: `1px solid ${theme.borderStrong}` }}>
              <span className="os-mono text-xs" style={{ color: theme.textMuted }}>
                Promote to
              </span>
              <div className="flex gap-2">
                {PROMOTION_CHOICES.map(({ piece, label }) => (
                  <button
                    key={piece}
                    type="button"
                    aria-label={label}
                    onClick={() => finishMove(pendingPromotion.from, pendingPromotion.to, piece)}
                    className="flex h-12 w-12 items-center justify-center border"
                    style={{ borderColor: theme.border, color: theme.text }}
                  >
                    <span style={{ fontSize: 28, lineHeight: 1 }}>
                      {pendingPromotion.color === "w" ? WHITE_GLYPHS[piece] : BLACK_GLYPHS[piece]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 os-mono text-[11px] shrink-0" style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}>
        Local two-player — pass the device to play the other side.
      </div>
    </div>
  );
};

export default ChessGame;
