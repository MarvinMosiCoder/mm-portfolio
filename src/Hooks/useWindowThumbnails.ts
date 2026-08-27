import { useCallback, useState } from "react";
import { getOsTheme } from "../theme/osTheme";
import { SectionKey } from "../Components/os/constants";

export function useWindowThumbnails(darkMode: boolean) {
  const theme = getOsTheme(darkMode);
  const themeKey = darkMode ? "d" : "l";
  const [cache, setCache] = useState<Record<string, string>>({});
  const [loadingSection, setLoadingSection] = useState<SectionKey | null>(null);

  const ensure = useCallback(
    async (section: SectionKey) => {
      const key = `${section}:${themeKey}`;
      if (cache[key]) return;
      const el = document.querySelector(`[data-section="${section}"]`) as HTMLElement | null;
      if (!el) return;
      setLoadingSection(section);
      try {
        const { default: html2canvas } = await import("html2canvas");
        const canvas = await html2canvas(el, {
          scale: 0.28,
          backgroundColor: theme.bg,
          logging: false,
          onclone: (clonedDoc) => {
            // Sections below the fold haven't had their AOS scroll-reveal fire yet,
            // so they're still sitting at opacity:0 — force the cloned copy to its
            // fully-revealed state so the capture isn't blank.
            clonedDoc.querySelectorAll<HTMLElement>("[data-aos]").forEach((node) => {
              node.style.opacity = "1";
              node.style.transform = "none";
              node.classList.add("aos-animate");
            });
          },
        });
        const dataUrl = canvas.toDataURL("image/png");
        setCache((prev) => ({ ...prev, [key]: dataUrl }));
      } catch {
        // capture failed silently — callers just keep showing their fallback
      } finally {
        setLoadingSection((current) => (current === section ? null : current));
      }
    },
    [cache, theme.bg, themeKey]
  );

  const get = useCallback((section: SectionKey) => cache[`${section}:${themeKey}`], [cache, themeKey]);

  return { ensure, get, loadingSection };
}
