import React, { useCallback, useEffect, useRef, useState } from "react";
import { getOsTheme, OsTheme } from "../../theme/osTheme";
import { CloseGlyph } from "./OsIcons";

interface InspectorProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
}

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Computed {
  size: string;
  color: string;
  background: string;
  font: string;
  padding: string;
  margin: string;
  border: string;
  display: string;
}

type Tab = "elements" | "computed";

// Docked to the right like a devtools pane. Capped against the viewport so it
// can't swallow a narrow desktop whole.
const DOCK_WIDTH = "min(380px, 46vw)";
// The panel swallows pointer events while picking, so it needs its own escape
// hatch: anything inside it (and the panel itself) is exempt.
const INSPECTOR_ATTR = "data-os-inspector";
// Never worth walking into: they render nothing, so a tree row for them is
// pure noise.
const SKIPPED_TAGS = new Set(["script", "style", "noscript", "link", "meta", "br"]);

function isOwn(node: EventTarget | null): boolean {
  return node instanceof Element && !!node.closest(`[${INSPECTOR_ATTR}]`);
}

function isRenderable(el: Element): boolean {
  return !SKIPPED_TAGS.has(el.tagName.toLowerCase()) && !isOwn(el);
}

function describe(el: Element): string {
  const id = el.id ? `#${el.id}` : "";
  const classes = Array.from(el.classList)
    .filter((c) => !c.startsWith("aos"))
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join("");
  return `${el.tagName.toLowerCase()}${id}${classes}`;
}

function rectOf(el: Element): Box {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

// getComputedStyle hands back "rgba(0, 0, 0, 0)" for anything unpainted, which
// is noise in a readout — every element in a nested layout would otherwise
// claim a background it never actually draws.
function readColor(value: string): string {
  if (!value || value === "rgba(0, 0, 0, 0)" || value === "transparent") return "none";
  return value;
}

function computedOf(el: Element): Computed {
  const cs = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const family = cs.fontFamily.split(",")[0].replace(/["']/g, "");
  return {
    size: `${Math.round(rect.width)} x ${Math.round(rect.height)}`,
    color: readColor(cs.color),
    background: readColor(cs.backgroundColor),
    font: `${family} ${cs.fontSize} / ${cs.fontWeight}`,
    padding: cs.padding === "0px" ? "0" : cs.padding,
    margin: cs.margin === "0px" ? "0" : cs.margin,
    border: cs.borderWidth === "0px" ? "none" : `${cs.borderWidth} ${cs.borderStyle} ${readColor(cs.borderColor)}`,
    display: cs.display,
  };
}

function ancestorsOf(el: Element | null): Element[] {
  const chain: Element[] = [];
  let node = el?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    chain.unshift(node);
    node = node.parentElement;
  }
  return chain;
}

const PickerIcon: React.FC = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M1 4.5V1h3.5M13 9.5V13H9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 4l5.5 2.4-2.2.9-.9 2.2L5 4z" fill="currentColor" />
  </svg>
);

const Caret: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" style={{ transform: open ? "rotate(90deg)" : undefined }}>
    <path d="M2.5 1.5L6 4l-3.5 2.5z" fill="currentColor" />
  </svg>
);

interface NodeRowProps {
  el: Element;
  depth: number;
  theme: OsTheme;
  selected: Element | null;
  isOpen: (el: Element) => boolean;
  onToggle: (el: Element) => void;
  onSelect: (el: Element) => void;
  onHover: (el: Element | null) => void;
}

const NodeRow: React.FC<NodeRowProps> = ({ el, depth, theme, selected, isOpen, onToggle, onSelect, onHover }) => {
  const children = Array.from(el.children).filter(isRenderable);
  const expandable = children.length > 0;
  const expanded = expandable && isOpen(el);
  const isSelected = selected === el;
  const classes = Array.from(el.classList).filter((c) => !c.startsWith("aos"));
  // Only leaves get a text preview — on a branch the text belongs to the
  // children, and repeating it at every level makes the tree unreadable.
  const text = expandable ? "" : (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 28);

  return (
    <>
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={expandable ? expanded : undefined}
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(el);
        }}
        onMouseEnter={() => onHover(el)}
        onMouseLeave={() => onHover(null)}
        className="os-mono flex cursor-default items-center gap-1 whitespace-nowrap py-[2px] pr-2 text-[10px] leading-4"
        style={{
          paddingLeft: 6 + depth * 10,
          background: isSelected ? theme.accentSoft : undefined,
          color: theme.textMuted,
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (expandable) onToggle(el);
          }}
          className="flex h-3 w-3 shrink-0 items-center justify-center"
          style={{ color: expandable ? theme.textDim : "transparent" }}
        >
          {expandable && <Caret open={expanded} />}
        </span>
        <span style={{ color: theme.textDim }}>&lt;</span>
        <span style={{ color: theme.accent }}>{el.tagName.toLowerCase()}</span>
        {el.id && (
          <span style={{ color: theme.chipText }}>
            <span style={{ color: theme.textDim }}>id=</span>&quot;{el.id}&quot;
          </span>
        )}
        {classes.length > 0 && (
          <span className="truncate" style={{ color: theme.chipText, maxWidth: 150 }}>
            <span style={{ color: theme.textDim }}>class=</span>&quot;{classes.join(" ")}&quot;
          </span>
        )}
        <span style={{ color: theme.textDim }}>&gt;</span>
        {text && <span style={{ color: theme.textDim }}>{text}</span>}
      </div>

      {expanded &&
        children.map((child, i) => (
          <NodeRow
            key={i}
            el={child}
            depth={depth + 1}
            theme={theme}
            selected={selected}
            isOpen={isOpen}
            onToggle={onToggle}
            onSelect={onSelect}
            onHover={onHover}
          />
        ))}
    </>
  );
};

const Inspector: React.FC<InspectorProps> = ({ darkMode, open, onClose }) => {
  const theme = getOsTheme(darkMode);
  const [selected, setSelected] = useState<Element | null>(null);
  const [hovered, setHovered] = useState<Element | null>(null);
  // Starts armed, the way "Inspect element" hands you a live picker. Clicking
  // a target disarms it so the page is usable again — the toolbar button
  // re-arms it.
  const [picking, setPicking] = useState(true);
  const [tab, setTab] = useState<Tab>("elements");
  const [expanded, setExpanded] = useState<Set<Element>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<Element>>(new Set());
  // Rects are read during render, so scrolling or resizing needs a nudge to
  // re-read them; nothing else about the selection has changed.
  const [, setTick] = useState(0);

  const pickingRef = useRef(picking);
  useEffect(() => {
    pickingRef.current = picking;
  }, [picking]);

  useEffect(() => {
    if (open) return;
    setSelected(null);
    setHovered(null);
    setPicking(true);
    setTab("elements");
    setExpanded(new Set());
    setCollapsed(new Set());
  }, [open]);

  const select = useCallback((el: Element) => {
    setSelected(el);
    // Reveal it in the tree: an ancestor the user explicitly collapsed would
    // otherwise hide the node that was just picked.
    const chain = ancestorsOf(el);
    setCollapsed((prev) => {
      if (!chain.some((node) => prev.has(node))) return prev;
      const next = new Set(prev);
      chain.forEach((node) => next.delete(node));
      return next;
    });
  }, []);

  // Picking mode: every pointer gesture belongs to the picker. Without this a
  // click lands on whatever sits underneath and opens a window, starts an icon
  // drag, or follows a link instead of selecting.
  useEffect(() => {
    if (!open || !picking) return;

    const onMove = (e: PointerEvent) => {
      if (isOwn(e.target)) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el === document.documentElement || isOwn(el)) return;
      select(el);
    };

    const swallow = (e: Event) => {
      if (isOwn(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "click") setPicking(false);
      if (e.type === "contextmenu") onClose();
    };

    const swallowed = ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "dblclick", "contextmenu"];
    window.addEventListener("pointermove", onMove, true);
    swallowed.forEach((type) => window.addEventListener(type, swallow, true));

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    return () => {
      window.removeEventListener("pointermove", onMove, true);
      swallowed.forEach((type) => window.removeEventListener(type, swallow, true));
      document.body.style.cursor = previousCursor;
    };
  }, [open, picking, select, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      // Escape belongs to the panel while it's up: without this it would also
      // reach whatever else is listening for it further down.
      e.stopPropagation();
      if (pickingRef.current) setPicking(false);
      else onClose();
    };
    const reflow = () => setTick((t) => t + 1);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", reflow, true);
    window.addEventListener("resize", reflow);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("scroll", reflow, true);
      window.removeEventListener("resize", reflow);
    };
  }, [open, onClose]);

  const isOpenNode = useCallback(
    (el: Element) => {
      if (collapsed.has(el)) return false;
      if (expanded.has(el)) return true;
      // Everything on the path to the selected node is open by default, so a
      // pick always reveals itself without any clicking.
      return selected ? selected === el || el.contains(selected) : false;
    },
    [collapsed, expanded, selected]
  );

  const toggleNode = useCallback(
    (el: Element) => {
      const currentlyOpen = isOpenNode(el);
      setExpanded((prev) => {
        const next = new Set(prev);
        if (currentlyOpen) next.delete(el);
        else next.add(el);
        return next;
      });
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (currentlyOpen) next.add(el);
        else next.delete(el);
        return next;
      });
    },
    [isOpenNode]
  );

  if (!open) return null;

  const attached = (el: Element | null) => (el && document.contains(el) ? el : null);
  const highlightTarget = attached(hovered) ?? attached(selected);
  const box = highlightTarget ? rectOf(highlightTarget) : null;
  const selectedEl = attached(selected);
  const computed = selectedEl ? computedOf(selectedEl) : null;
  const breadcrumb = selectedEl ? [...ancestorsOf(selectedEl), selectedEl] : [];
  // The badge normally rides above the highlight; near the top of the screen
  // there is no room for it, so it flips inside the box instead of clipping.
  const badgeAbove = !!box && box.top > 24;

  const tabStyle = (value: Tab): React.CSSProperties => ({
    color: tab === value ? theme.text : theme.textMuted,
    borderBottom: `2px solid ${tab === value ? theme.accent : "transparent"}`,
  });

  return (
    <>
      {box && (
        <div aria-hidden="true" className="pointer-events-none">
          <div
            className="fixed z-[85]"
            style={{
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
              background: theme.accentSoft,
              outline: `1px solid ${theme.accent}`,
            }}
          />
          <div
            className="os-mono fixed z-[85] whitespace-nowrap px-1.5 py-0.5 text-[10px]"
            style={{
              left: Math.max(4, box.left),
              top: badgeAbove ? box.top - 19 : box.top + 2,
              background: theme.accent,
              // Same accent-on-panel pairing the primary buttons use.
              color: theme.panel,
            }}
          >
            {highlightTarget && describe(highlightTarget)} {Math.round(box.width)}x{Math.round(box.height)}
          </div>
        </div>
      )}

      <aside
        {...{ [INSPECTOR_ATTR]: "panel" }}
        role="dialog"
        aria-label="Element inspector"
        className="fixed inset-y-0 right-0 z-[86] flex flex-col"
        style={{
          width: DOCK_WIDTH,
          background: theme.panel,
          borderLeft: `1px solid ${theme.borderStrong}`,
          boxShadow: `-18px 0 44px -24px ${theme.shadow}`,
        }}
      >
        <div
          className="flex h-9 shrink-0 items-stretch"
          style={{ background: theme.titlebar, borderBottom: `1px solid ${theme.border}` }}
        >
          <button
            type="button"
            onClick={() => setPicking((v) => !v)}
            aria-label="Select an element in the page"
            aria-pressed={picking}
            title="Select an element in the page"
            className="flex w-9 shrink-0 items-center justify-center"
            style={{
              color: picking ? theme.accent : theme.textMuted,
              background: picking ? theme.accentSoft : undefined,
              borderRight: `1px solid ${theme.border}`,
            }}
          >
            <PickerIcon />
          </button>

          <div className="flex min-w-0 flex-1 items-stretch">
            {(["elements", "computed"] as Tab[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className="os-mono px-3 text-[11px] capitalize transition-colors"
                style={tabStyle(value)}
              >
                {value}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="flex w-9 shrink-0 items-center justify-center"
            style={{ color: theme.textMuted, borderLeft: `1px solid ${theme.border}` }}
          >
            <CloseGlyph size={9} />
          </button>
        </div>

        {tab === "elements" ? (
          <div
            role="tree"
            aria-label="DOM tree"
            className="flex-1 overflow-auto py-1"
            style={{ background: theme.bg }}
            onMouseLeave={() => setHovered(null)}
          >
            <NodeRow
              el={document.body}
              depth={0}
              theme={theme}
              selected={selectedEl}
              isOpen={isOpenNode}
              onToggle={toggleNode}
              onSelect={select}
              onHover={setHovered}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-3" style={{ background: theme.bg }}>
            {computed ? (
              <div className="flex flex-col gap-1.5">
                <Row theme={theme} label="size">
                  {computed.size}
                </Row>
                <Row theme={theme} label="display">
                  {computed.display}
                </Row>
                <Row theme={theme} label="color" swatch={computed.color}>
                  {computed.color}
                </Row>
                <Row theme={theme} label="background" swatch={computed.background}>
                  {computed.background}
                </Row>
                <Row theme={theme} label="font">
                  {computed.font}
                </Row>
                <Row theme={theme} label="padding">
                  {computed.padding}
                </Row>
                <Row theme={theme} label="margin">
                  {computed.margin}
                </Row>
                <Row theme={theme} label="border">
                  {computed.border}
                </Row>
              </div>
            ) : (
              <p className="os-mono text-[11px]" style={{ color: theme.textMuted }}>
                Select an element to see its computed styles.
              </p>
            )}
          </div>
        )}

        <div
          className="os-mono shrink-0 overflow-x-auto whitespace-nowrap px-2 py-1.5 text-[10px]"
          style={{ borderTop: `1px solid ${theme.border}`, color: theme.textDim, background: theme.titlebar }}
        >
          {breadcrumb.length > 0
            ? breadcrumb.map((node, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ color: theme.textDim }}> &gt; </span>}
                  <span style={{ color: node === selectedEl ? theme.accent : theme.textMuted }}>{describe(node)}</span>
                </span>
              ))
            : picking
            ? "Move the pointer over the page, then click to select."
            : "Nothing selected."}
        </div>
      </aside>
    </>
  );
};

function Row({
  theme,
  label,
  swatch,
  children,
}: {
  theme: OsTheme;
  label: string;
  swatch?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="os-mono flex items-baseline gap-2 text-[10px]">
      <span className="w-[62px] shrink-0" style={{ color: theme.textDim }}>
        {label}
      </span>
      {swatch && swatch !== "none" && (
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 self-center"
          style={{ background: swatch, border: `1px solid ${theme.border}` }}
        />
      )}
      <span className="min-w-0 flex-1 break-all" style={{ color: theme.chipText }}>
        {children}
      </span>
    </div>
  );
}

export default Inspector;
