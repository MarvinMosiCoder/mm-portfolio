export const MENU_BAR_HEIGHT = 44;
export const TASKBAR_HEIGHT = 52;

export const SECTIONS = ["about", "experience", "projects", "contact"] as const;

export type SectionKey = (typeof SECTIONS)[number];

export const SECTION_META: Record<SectionKey, { label: string; file: string }> = {
  about: { label: "About", file: "about.sys" },
  experience: { label: "Experience", file: "experience.log" },
  projects: { label: "Projects", file: "projects.dir" },
  contact: { label: "Contact", file: "contact.app" },
};

export const SCROLL_OFFSET = -(MENU_BAR_HEIGHT + 20);

export const MIN_WINDOW_WIDTH = 360;
export const MIN_WINDOW_HEIGHT = 280;
export const DESKTOP_BREAKPOINT = "(min-width: 768px)";
