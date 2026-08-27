import { useEffect, useRef, useState } from "react";

export function useActiveSection(sections: string[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrollingRef = useRef(false);

  const goTo = (index: number) => {
    isScrollingRef.current = true;
    setActiveIndex(index);
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 500);
  };

  useEffect(() => {
    const measure = () => {
      if (isScrollingRef.current) return;
      const mid = window.innerHeight / 2;
      sections.forEach((section, index) => {
        const el = document.querySelector(
          `[data-section="${section}"]`
        ) as HTMLElement | null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          setActiveIndex(index);
        }
      });
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [sections]);

  return { activeIndex, goTo };
}
