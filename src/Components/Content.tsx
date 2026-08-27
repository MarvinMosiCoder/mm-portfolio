import React, { useCallback, useEffect, useState } from "react";
import { Element, scroller } from "react-scroll";
import AOS from "aos";
import "aos/dist/aos.css";
import Experience from "./Experience";
import Projects from "./Projects";
import MainView from "./MainView";
import Contact from "./Contact";
import BootScreen from "./os/BootScreen";
import MenuBar from "./os/MenuBar";
import Taskbar from "./os/Taskbar";
import TaskSwitcher from "./os/TaskSwitcher";
import MobileNavPanel from "./os/MobileNavPanel";
import DesktopRail from "./os/DesktopRail";
import WindowChrome from "./os/WindowChrome";
import MinimizeGhost, { GhostRect } from "./os/MinimizeGhost";
import { getOsTheme } from "../theme/osTheme";
import { useActiveSection } from "../Hooks/useActiveSection";
import { MENU_BAR_HEIGHT, SCROLL_OFFSET, SECTIONS, SECTION_META, SectionKey, TASKBAR_HEIGHT } from "./os/constants";

interface MinimizeAnim {
  section: SectionKey;
  from: GhostRect;
  to: GhostRect;
}

const Content: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [closedSections, setClosedSections] = useState<Set<SectionKey>>(new Set());
  const [minimizedSections, setMinimizedSections] = useState<Set<SectionKey>>(new Set());
  const [minimizeAnim, setMinimizeAnim] = useState<MinimizeAnim | null>(null);
  const { activeIndex, goTo } = useActiveSection([...SECTIONS]);
  const theme = getOsTheme(darkMode);
  const activeSection = SECTIONS[activeIndex];
  const taskbarSections = SECTIONS.filter((s) => !closedSections.has(s));
  const visibleSections = taskbarSections.filter((s) => !minimizedSections.has(s));

  useEffect(() => {
    AOS.init({ duration: 900, offset: 80, once: true });
  }, []);

  useEffect(() => {
    // 100vw includes the scrollbar's width, so a full-bleed element sized with
    // 100vw ends up wider than the visible viewport and its edge sits under the
    // scrollbar track. Track the real gap so breakout layouts (window maximize)
    // can size against it instead.
    const updateScrollbarWidth = () => {
      const width = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty("--sbw", `${width}px`);
    };
    updateScrollbarWidth();
    window.addEventListener("resize", updateScrollbarWidth);
    return () => window.removeEventListener("resize", updateScrollbarWidth);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const closeSection = useCallback((section: SectionKey) => {
    setClosedSections((prev) => {
      const next = new Set(prev);
      next.add(section);
      return next;
    });
    setMinimizedSections((prev) => {
      if (!prev.has(section)) return prev;
      const next = new Set(prev);
      next.delete(section);
      return next;
    });
  }, []);

  const minimizeSection = useCallback((section: SectionKey) => {
    const windowEl = document.querySelector(`[data-section="${section}"] > div`) as HTMLElement | null;
    const tabEl = document.querySelector(`[data-taskbar-tab="${section}"]`) as HTMLElement | null;
    if (windowEl && tabEl) {
      const from = windowEl.getBoundingClientRect();
      const to = tabEl.getBoundingClientRect();
      setMinimizeAnim({
        section,
        from: { left: from.left, top: from.top, width: from.width, height: from.height },
        to: { left: to.left, top: to.top, width: to.width, height: to.height },
      });
    }
    setMinimizedSections((prev) => new Set(prev).add(section));
  }, []);

  const navigateToSection = useCallback(
    (section: SectionKey) => {
      const index = SECTIONS.indexOf(section);
      goTo(index);

      let needsRemount = false;
      setClosedSections((prev) => {
        if (!prev.has(section)) return prev;
        needsRemount = true;
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
      setMinimizedSections((prev) => {
        if (!prev.has(section)) return prev;
        needsRemount = true;
        const next = new Set(prev);
        next.delete(section);
        return next;
      });

      const scrollNow = () =>
        scroller.scrollTo(section, { smooth: true, duration: 500, offset: SCROLL_OFFSET });

      if (needsRemount) {
        // let the reopened/restored window mount and lay out before measuring scroll position
        requestAnimationFrame(() => requestAnimationFrame(scrollNow));
      } else {
        scrollNow();
      }
    },
    [goTo]
  );

  return (
    <>
      <BootScreen darkMode={darkMode} />
      <div
        className="min-h-screen transition-colors duration-500"
        style={{
          backgroundColor: theme.bg,
          backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      >
        <MenuBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          activeIndex={activeIndex}
          onNavigateSection={navigateToSection}
          onOpenMobileMenu={() => setNavMenuOpen(true)}
        />
        <MobileNavPanel
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={navMenuOpen}
          onClose={() => setNavMenuOpen(false)}
          activeIndex={activeIndex}
          closedSections={closedSections}
          minimizedSections={minimizedSections}
          onNavigateSection={navigateToSection}
        />
        <TaskSwitcher
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={switcherOpen}
          onClose={() => setSwitcherOpen(false)}
          activeSection={activeSection}
          closedSections={closedSections}
          minimizedSections={minimizedSections}
          onNavigateSection={navigateToSection}
          onCloseSection={closeSection}
        />
        <DesktopRail
          darkMode={darkMode}
          activeIndex={activeIndex}
          closedSections={closedSections}
          minimizedSections={minimizedSections}
          onNavigateSection={navigateToSection}
        />

        <main
          className="mx-auto w-full max-w-4xl px-4 sm:px-6 2xl:pl-32"
          style={{ paddingTop: MENU_BAR_HEIGHT + 28, paddingBottom: TASKBAR_HEIGHT + 40 }}
        >
          {visibleSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="os-mono text-sm" style={{ color: theme.textDim }}>
                Desktop is empty.
              </p>
              <p className="os-mono text-xs mt-2" style={{ color: theme.textDim }}>
                Reopen a window from MENU or the taskbar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {visibleSections.map((section) => (
                <Element key={section} name={section} data-section={section}>
                  <WindowChrome
                    darkMode={darkMode}
                    title={SECTION_META[section].file}
                    active={activeSection === section}
                    aos="fade-up"
                    onClose={() => closeSection(section)}
                    onMinimize={() => minimizeSection(section)}
                  >
                    {section === "about" && <MainView darkMode={darkMode} setDarkMode={setDarkMode} />}
                    {section === "experience" && <Experience darkMode={darkMode} />}
                    {section === "projects" && <Projects darkMode={darkMode} />}
                    {section === "contact" && <Contact darkMode={darkMode} />}
                  </WindowChrome>
                </Element>
              ))}
            </div>
          )}
        </main>

        <Taskbar
          darkMode={darkMode}
          openSections={taskbarSections}
          minimizedSections={minimizedSections}
          activeSection={activeSection}
          onNavigateSection={navigateToSection}
          onCloseSection={closeSection}
          onOpenMenu={() => setNavMenuOpen(true)}
          onOpenSwitcher={() => setSwitcherOpen(true)}
        />

        {minimizeAnim && (
          <MinimizeGhost
            key={minimizeAnim.section}
            darkMode={darkMode}
            label={SECTION_META[minimizeAnim.section].file}
            from={minimizeAnim.from}
            to={minimizeAnim.to}
            onDone={() => setMinimizeAnim(null)}
          />
        )}
      </div>
    </>
  );
};

export default Content;
