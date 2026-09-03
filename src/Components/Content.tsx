import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import ChessGame from "./os/ChessGame";
import Solitaire from "./os/Solitaire";
import Pinball from "./os/Pinball";
import WindowChrome from "./os/WindowChrome";
import MinimizeGhost, { GhostRect } from "./os/MinimizeGhost";
import { getOsTheme } from "../theme/osTheme";
import { useActiveSection } from "../Hooks/useActiveSection";
import { useMediaQuery } from "../Hooks/useMediaQuery";
import { useWindowLayout } from "../Hooks/useWindowLayout";
import {
  DESKTOP_BREAKPOINT,
  MENU_BAR_HEIGHT,
  SCROLL_OFFSET,
  SECTIONS,
  SECTION_META,
  SectionKey,
  TASKBAR_HEIGHT,
} from "./os/constants";

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
  const [chessOpen, setChessOpen] = useState(false);
  const [solitaireOpen, setSolitaireOpen] = useState(false);
  const [pinballOpen, setPinballOpen] = useState(false);
  const [desktopMenuAt, setDesktopMenuAt] = useState<{ x: number; y: number } | null>(null);
  const [closedSections, setClosedSections] = useState<Set<SectionKey>>(new Set());
  const [minimizedSections, setMinimizedSections] = useState<Set<SectionKey>>(new Set());
  const [minimizeAnim, setMinimizeAnim] = useState<MinimizeAnim | null>(null);
  const [focusedSection, setFocusedSection] = useState<SectionKey>("about");
  const { activeIndex, goTo } = useActiveSection([...SECTIONS]);
  const theme = getOsTheme(darkMode);

  // Desktop-and-up gets real, draggable/resizable floating windows (see
  // useWindowLayout); below that breakpoint the sections stay in the
  // original stacked, scroll-navigated layout — dragging doesn't work well
  // on touch, so there's no floating fallback for mobile/tablet.
  const isDesktop = useMediaQuery(DESKTOP_BREAKPOINT);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Padding on the canvas wouldn't actually keep windows off the rail — a
  // padded box's containing block for `position:absolute` children still
  // starts at its outer (padding) edge, not its content edge, so a window
  // at left:0 renders flush with the rail instead of past it. Reserve the
  // rail's gutter as a real left offset instead, matching the 8rem (2xl:pl-32)
  // DesktopRail has always used, plus the same side margins <main> uses.
  const hasSideMargin = useMediaQuery("(min-width: 640px)");
  const hasRailGutter = useMediaQuery("(min-width: 1536px)");
  const canvasSideMargin = hasSideMargin ? 24 : 16;
  const canvasLeftInset = canvasSideMargin + (hasRailGutter ? 128 : 0);
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const [desktopBounds, setDesktopBounds] = useState({ width: 0, height: 0 });
  const { getRect, commitRect, bringToFront, zIndexOf, isMaximized, toggleMaximize } = useWindowLayout(desktopBounds);

  const activeSection = isDesktop ? focusedSection : SECTIONS[activeIndex];
  const navActiveIndex = isDesktop ? SECTIONS.indexOf(focusedSection) : activeIndex;
  const taskbarSections = SECTIONS.filter((s) => !closedSections.has(s));
  const visibleSections = taskbarSections.filter((s) => !minimizedSections.has(s));

  useEffect(() => {
    AOS.init({ duration: 900, offset: 80, once: true });
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop) return;
    const el = desktopRef.current;
    if (!el) return;
    const measure = () => setDesktopBounds({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop]);

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

      if (isDesktop) {
        bringToFront(section);
        setFocusedSection(section);
        return;
      }

      const index = SECTIONS.indexOf(section);
      goTo(index);

      const scrollNow = () =>
        scroller.scrollTo(section, { smooth: true, duration: 500, offset: SCROLL_OFFSET });

      if (needsRemount) {
        // let the reopened/restored window mount and lay out before measuring scroll position
        requestAnimationFrame(() => requestAnimationFrame(scrollNow));
      } else {
        scrollNow();
      }
    },
    [isDesktop, bringToFront, goTo]
  );

  const renderFloatingWindow = (section: SectionKey) => (
    <WindowChrome
      key={section}
      sectionKey={section}
      darkMode={darkMode}
      title={SECTION_META[section].file}
      active={activeSection === section}
      onClose={() => closeSection(section)}
      onMinimize={() => minimizeSection(section)}
      onFocus={() => {
        bringToFront(section);
        setFocusedSection(section);
      }}
      reducedMotion={reducedMotion}
      floating={{
        rect: getRect(section),
        zIndex: zIndexOf(section),
        maximized: isMaximized(section),
        bounds: desktopBounds,
        taskbarHeight: TASKBAR_HEIGHT,
        onRectChange: (r) => commitRect(section, r),
        onToggleMaximize: () => toggleMaximize(section),
      }}
    >
      {section === "about" && (
        <MainView darkMode={darkMode} setDarkMode={setDarkMode} onNavigateSection={navigateToSection} />
      )}
      {section === "experience" && <Experience darkMode={darkMode} />}
      {section === "projects" && <Projects darkMode={darkMode} />}
      {section === "contact" && <Contact darkMode={darkMode} />}
    </WindowChrome>
  );

  // Right-clicking empty desktop space opens the "reset icons" menu; a click
  // that landed inside an actual window (data-section) or any control
  // (button/link/input) keeps the browser's native menu / that control's own
  // behavior instead — there's no clean z-index split between "empty canvas"
  // and "window content" since floating windows render inside the same
  // canvas div, so this has to be decided from the click target, not layout.
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    // Only the 2xl+ desktop rail has icons to reset — below that, leave the
    // browser's native menu alone rather than swallowing it for nothing.
    if (!hasRailGutter) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-section], button, a, input, textarea, select")) return;
    e.preventDefault();
    setDesktopMenuAt({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <BootScreen darkMode={darkMode} />
      <div
        className="min-h-screen transition-colors duration-500"
        onContextMenu={handleDesktopContextMenu}
        style={{
          backgroundColor: theme.bg,
          backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      >
        <MenuBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenMobileMenu={() => setNavMenuOpen(true)}
        />
        <MobileNavPanel
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          open={navMenuOpen}
          onClose={() => setNavMenuOpen(false)}
          activeIndex={navActiveIndex}
          closedSections={closedSections}
          minimizedSections={minimizedSections}
          onNavigateSection={navigateToSection}
          onOpenChess={() => setChessOpen(true)}
          onOpenSolitaire={() => setSolitaireOpen(true)}
          onOpenPinball={() => setPinballOpen(true)}
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
        <ChessGame darkMode={darkMode} open={chessOpen} onClose={() => setChessOpen(false)} />
        <Solitaire darkMode={darkMode} open={solitaireOpen} onClose={() => setSolitaireOpen(false)} />
        <Pinball darkMode={darkMode} open={pinballOpen} onClose={() => setPinballOpen(false)} />
        <DesktopRail
          darkMode={darkMode}
          activeIndex={navActiveIndex}
          closedSections={closedSections}
          minimizedSections={minimizedSections}
          onNavigateSection={navigateToSection}
          onOpenChess={() => setChessOpen(true)}
          onOpenSolitaire={() => setSolitaireOpen(true)}
          onOpenPinball={() => setPinballOpen(true)}
          desktopMenuAt={desktopMenuAt}
          onCloseDesktopMenu={() => setDesktopMenuAt(null)}
        />

        {isDesktop ? (
          <>
            <div
              ref={desktopRef}
              className="fixed z-20 overflow-hidden"
              style={{
                top: MENU_BAR_HEIGHT,
                bottom: TASKBAR_HEIGHT,
                left: canvasLeftInset,
                right: canvasSideMargin,
              }}
            >
              {visibleSections.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="os-mono text-sm" style={{ color: theme.textDim }}>
                    Desktop is empty.
                  </p>
                  <p className="os-mono text-xs mt-2" style={{ color: theme.textDim }}>
                    Reopen a window from MENU or the taskbar.
                  </p>
                </div>
              ) : (
                visibleSections.filter((section) => !isMaximized(section)).map(renderFloatingWindow)
              )}
            </div>
            {/* Maximized windows render outside the canvas, as siblings of the menu
                bar and taskbar — a descendant can never out-rank its ancestor's
                stacking context, so covering the menu bar needs real sibling DOM
                position, not just a higher z-index nested inside the canvas. */}
            {visibleSections.filter((section) => isMaximized(section)).map(renderFloatingWindow)}
          </>
        ) : (
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
                      {section === "about" && (
                        <MainView darkMode={darkMode} setDarkMode={setDarkMode} onNavigateSection={navigateToSection} />
                      )}
                      {section === "experience" && <Experience darkMode={darkMode} />}
                      {section === "projects" && <Projects darkMode={darkMode} />}
                      {section === "contact" && <Contact darkMode={darkMode} />}
                    </WindowChrome>
                  </Element>
                ))}
              </div>
            )}
          </main>
        )}

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
