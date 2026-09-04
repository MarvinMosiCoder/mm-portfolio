import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiRefreshCw, FiRotateCw, FiX } from "react-icons/fi";
import { getOsTheme, OsTheme } from "../../theme/osTheme";

interface DevicePreviewProps {
  darkMode: boolean;
  open: boolean;
  onClose: () => void;
}

interface Device {
  label: string;
  width: number;
  height: number;
}

// Portrait dimensions; the rotate button swaps them.
const DEVICES: Device[] = [
  { label: "iPhone SE", width: 375, height: 667 },
  { label: "iPhone 12/13 mini", width: 360, height: 780 },
  { label: "iPhone 14 Pro", width: 393, height: 852 },
  { label: "Pixel 7", width: 412, height: 915 },
  { label: "Galaxy S20 Ultra", width: 412, height: 915 },
  { label: "iPad mini", width: 744, height: 1133 },
  { label: "iPad Pro 11", width: 834, height: 1194 },
  { label: "Laptop", width: 1280, height: 800 },
];

const ROUTES = [
  { label: "desktop", path: "/" },
  { label: "other-projects", path: "/other-projects" },
  { label: "resume", path: "/resume" },
];

const HEADER_HEIGHT = 52;
const STAGE_PADDING = 48;

const DevicePreview: React.FC<DevicePreviewProps> = ({ darkMode, open, onClose }) => {
  const theme = getOsTheme(darkMode);
  const [width, setWidth] = useState(DEVICES[0].width);
  const [height, setHeight] = useState(DEVICES[0].height);
  const [route, setRoute] = useState(ROUTES[0].path);
  // Bumped to remount the iframe — resizing the frame deliberately doesn't
  // reload it, since watching a live layout reflow is the point.
  const [reloadKey, setReloadKey] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open) return;
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStage({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  if (!open) return null;

  // The frame is rendered at its true pixel size and scaled down to fit, so
  // the page inside still reports the real device width to its media queries
  // and to anything reading window.innerWidth.
  const available = {
    width: Math.max(120, stage.width - STAGE_PADDING),
    height: Math.max(120, stage.height - STAGE_PADDING),
  };
  const scale = Math.min(1, available.width / width, available.height / height);

  const matched = DEVICES.find((d) => d.width === width && d.height === height);
  const rotated = DEVICES.find((d) => d.width === height && d.height === width);
  const presetValue = matched?.label ?? (rotated ? rotated.label : "custom");

  const applyPreset = (label: string) => {
    const device = DEVICES.find((d) => d.label === label);
    if (!device) return;
    setWidth(device.width);
    setHeight(device.height);
  };

  const rotate = () => {
    setWidth(height);
    setHeight(width);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Device preview"
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: theme.bg }}
    >
      <div
        className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 sm:px-4"
        style={{ minHeight: HEADER_HEIGHT, borderBottom: `1px solid ${theme.border}`, background: theme.menubar }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="os-mono truncate text-sm font-semibold" style={{ color: theme.text }}>
            device.preview
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Select
            theme={theme}
            label="Device"
            value={presetValue}
            onChange={applyPreset}
            options={[
              ...DEVICES.map((d) => ({ value: d.label, label: d.label })),
              ...(presetValue === "custom" ? [{ value: "custom", label: "Custom" }] : []),
            ]}
          />

          <div className="flex items-center gap-1">
            <NumberField theme={theme} label="Width" value={width} onChange={setWidth} />
            <span className="os-mono text-[11px]" style={{ color: theme.textDim }}>
              x
            </span>
            <NumberField theme={theme} label="Height" value={height} onChange={setHeight} />
          </div>

          <IconButton theme={theme} label="Rotate" onClick={rotate}>
            <FiRotateCw size={13} />
          </IconButton>

          <Select
            theme={theme}
            label="Route"
            value={route}
            onChange={setRoute}
            options={ROUTES.map((r) => ({ value: r.path, label: r.label }))}
          />

          <IconButton theme={theme} label="Reload frame" onClick={() => setReloadKey((k) => k + 1)}>
            <FiRefreshCw size={13} />
          </IconButton>

          <IconButton theme={theme} label="Close device preview" onClick={onClose} strong>
            <FiX size={15} />
          </IconButton>
        </div>
      </div>

      <div ref={stageRef} className="flex flex-1 items-start justify-center overflow-auto p-6">
        <div style={{ width: width * scale, height: height * scale }}>
          <div
            style={{
              width,
              height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: `1px solid ${theme.borderStrong}`,
              boxShadow: `0 24px 50px -20px ${theme.shadow}`,
              background: theme.panel,
            }}
          >
            <iframe
              key={`${route}-${reloadKey}`}
              src={route}
              title={`Preview of ${route} at ${width} by ${height}`}
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            />
          </div>
        </div>
      </div>

      <div
        className="os-mono flex shrink-0 items-center justify-between gap-3 px-4 py-3 text-[11px]"
        style={{ color: theme.textDim, borderTop: `1px solid ${theme.border}` }}
      >
        <span>
          {width} x {height} · {Math.round(scale * 100)}%
        </span>
        <span className="truncate">
          Browser devtools (Ctrl+Shift+M) still gives you touch emulation and throttling.
        </span>
      </div>
    </div>
  );
};

function IconButton({
  theme,
  label,
  onClick,
  strong,
  children,
}: {
  theme: OsTheme;
  label: string;
  onClick: () => void;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center border"
      style={{ borderColor: theme.border, color: strong ? theme.text : theme.textMuted }}
    >
      {children}
    </button>
  );
}

function NumberField({
  theme,
  label,
  value,
  onChange,
}: {
  theme: OsTheme;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={value}
      min={240}
      max={2560}
      onChange={(e) => {
        const next = Number(e.target.value);
        if (Number.isFinite(next)) onChange(Math.min(2560, Math.max(240, Math.round(next))));
      }}
      className="os-mono h-8 w-[62px] px-1.5 text-center text-[11px] outline-none"
      style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.text }}
    />
  );
}

function Select({
  theme,
  label,
  value,
  onChange,
  options,
}: {
  theme: OsTheme;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="os-mono h-8 px-1.5 text-[11px] outline-none"
      style={{ background: theme.bg, border: `1px solid ${theme.border}`, color: theme.text }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default DevicePreview;
