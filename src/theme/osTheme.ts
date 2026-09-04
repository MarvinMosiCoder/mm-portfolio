export interface OsTheme {
  bg: string;
  grid: string;
  panel: string;
  titlebar: string;
  titlebarActive: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textDim: string;
  accent: string;
  accentSoft: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  taskbar: string;
  menubar: string;
  shadow: string;
  // Translucent overlay for hover states. Deliberately not a solid color —
  // it has to read as "raised" on top of any surface it lands on (the
  // desktop's grid background, the taskbar, a panel), which a fixed hex
  // can't do without matching one of them exactly and vanishing.
  hover: string;
  // A fill that must stay visually distinct from `bg` when the two sit
  // directly next to each other (chess squares, alternating rows). `panel`
  // is too close to `bg` in dark mode to work for that.
  surfaceAlt: string;
  success: string;
  danger: string;
}

export const DARK_OS_THEME: OsTheme = {
  bg: "#0B0D10",
  grid: "#12151A",
  panel: "#14171C",
  titlebar: "#1A1E24",
  titlebarActive: "#1D2128",
  border: "#262B33",
  borderStrong: "#323844",
  text: "#E9EBEE",
  textMuted: "#8A919C",
  textDim: "#5B6270",
  accent: "#E9A94A",
  accentSoft: "rgba(233,169,74,0.14)",
  chipBg: "#1C2027",
  chipBorder: "#2A2F38",
  chipText: "#C7CCD4",
  taskbar: "#101317",
  menubar: "#101317",
  shadow: "rgba(0,0,0,0.55)",
  hover: "rgba(255,255,255,0.08)",
  surfaceAlt: "#39404B",
  success: "#7FB88A",
  danger: "#E86A6A",
};

export const LIGHT_OS_THEME: OsTheme = {
  bg: "#EDEFF2",
  grid: "#E2E5EA",
  panel: "#FFFFFF",
  titlebar: "#F5F6F8",
  titlebarActive: "#FFFFFF",
  border: "#DADFE5",
  borderStrong: "#C7CDD5",
  text: "#1A1D22",
  textMuted: "#5B6270",
  textDim: "#8A919C",
  accent: "#B9720B",
  accentSoft: "rgba(185,114,11,0.12)",
  chipBg: "#EFF1F4",
  chipBorder: "#DADFE5",
  chipText: "#333940",
  taskbar: "#F5F6F8",
  menubar: "#F5F6F8",
  shadow: "rgba(20,24,30,0.18)",
  hover: "rgba(20,24,30,0.07)",
  surfaceAlt: "#BCC4CE",
  success: "#3F7A4E",
  danger: "#C23B3B",
};

export const getOsTheme = (darkMode: boolean): OsTheme =>
  darkMode ? DARK_OS_THEME : LIGHT_OS_THEME;
