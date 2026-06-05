// Navbar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const primary =
    "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent";
  const primaryHover =
    "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400";
  const textGray = "text-gray-700 dark:text-gray-300";

  const sections = useMemo(
    () => ["about","resume", "experience", "projects", "contact"],
    []
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Measure header height so we can:
  // 1) create a spacer to avoid layout shift
  // 2) subtract it from react-scroll offset
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerH, setHeaderH] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        const h = Math.ceil(headerRef.current.getBoundingClientRect().height);
        setHeaderH(h);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const offsetValue = useMemo(() => {
    if (typeof window === "undefined") return -260;
    // keep your original centering logic, just account for fixed header height
    return -window.innerHeight / 2 + 260 - headerH;
  }, [headerH]);

  const handleClick = (index: number) => {
    setIsScrolling(true);
    setActiveIndex(index);
    setTimeout(() => setIsScrolling(false), 500);
  };

  // Highlight active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      sections.forEach((section, index) => {
        const element = document.querySelector(
          `[data-section="${section}"]`
        ) as HTMLElement | null;

        if (element) {
          const rect = element.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setActiveIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolling, sections]);

  useEffect(() => {
    const init = () => {
      sections.forEach((section, index) => {
        const el = document.querySelector(`[data-section="${section}"]`) as HTMLElement | null;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const mid = window.innerHeight / 2;
        if (rect.top <= mid && rect.bottom >= mid) {
          setActiveIndex(index);
        }
      });
    };
    init(); // run on mount
    // listener already added below in your code; this just primes the state
    // (no cleanup needed here since we didn't add a listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on ESC and lock body scroll when open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenuOnNavigate = (index: number) => {
    handleClick(index);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Fixed, translucent, blurred header */}
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-40 w-full
          ${darkMode
            ? "bg-neutral-950 border-b border-neutral-800"
            : "bg-white border-b border-gray-200"}
          p-3 flex items-center justify-between`}
      >
        <div
          className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between`}
        >
          <div
            className={`text-sm tracking-[0.3em] font-bold ${primary}`}
            aria-label="Logo"
          >
            MM.
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <ul className="flex gap-5 text-left font-poppins text-sm">
              {["ABOUT","RESUME", "EXPERIENCE", "PROJECTS", "CONTACT"].map(
                (item, index) => (
                  <li key={index}>
                    {item.toLowerCase() === "resume" ? (
                      <RouterLink
                        to={item.toLowerCase()}
                        onClick={() => handleClick(index)}
                        className={`${
                          activeIndex === index
                            ? primary + " font-bold blur-none"
                            : "opacity-80 transition"
                        } hover:${primaryHover} transition duration-300 ease-in-out cursor-pointer`}
                      >
                        {item}
                      </RouterLink>
                    ) : (
                      <Link
                        to={item.toLowerCase()}
                        smooth={true}
                        duration={500}
                        offset={offsetValue}
                        onClick={() => handleClick(index)}
                        className={`${
                          activeIndex === index
                            ? primary + " font-bold blur-none"
                            : "opacity-80 transition"
                        } hover:${primaryHover} transition duration-300 ease-in-out cursor-pointer`}
                      >
                        {item}
                      </Link>
                    )}
                  </li>
                )
              )}
            </ul>

            <button
              aria-label="Toggle theme"
              onClick={() => setDarkMode((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center hover:scale-105 transition"
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>
          </nav>

          {/* Mobile burger toggle */}
          <button
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center"
          >
            <FiMenu size={22} className={darkMode ? "text-white" : "text-black"} />
          </button>
        </div>

        {/* Mobile overlay (kept outside container to span full width) */}
        {mobileOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] md:hidden z-40"
          />
        )}

        {/* Mobile sidebar */}
        <aside
          id="mobile-menu"
          className={`fixed right-0 top-0 h-full w-[80%] max-w-[320px] md:hidden z-50
        ${
          darkMode
            ? "bg-neutral-900 text-white border-l border-neutral-800"
            : "bg-white text-gray-900 border-l border-gray-200"
        }
        shadow-xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`flex items-center justify-between px-4 py-4 border-b ${
              darkMode
                ? "border-neutral-800 text-gray-100"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <span className={`text-xs tracking-[0.3em] font-bold ${primary}`}>
              MENU
            </span>
            <div className="flex items-center gap-2">
              <button
                aria-label="Toggle theme"
                onClick={() => setDarkMode((v) => !v)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  darkMode
                    ? "hover:bg-neutral-800"
                    : "hover:bg-neutral-100 text-gray-800"
                }`}
              >
                {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
              </button>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  darkMode
                    ? "hover:bg-neutral-800 text-gray-100"
                    : "hover:bg-neutral-100 text-gray-800"
                }`}
              >
                <FiX size={22} />
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-1 p-4 font-poppins">
            {["ABOUT","RESUME", "EXPERIENCE", "PROJECTS", "CONTACT"].map(
              (item, index) => (
                <li key={index}>
                  {item.toLowerCase() === "resume" ? (
                    <RouterLink
                      to={item.toLowerCase()}
                      onClick={() => closeMenuOnNavigate(index)}
                      className={`${
                        activeIndex === index
                          ? primary + " font-bold blur-none"
                          : `${textGray} hover:opacity-100`
                      } block px-3 py-3 cursor-pointer rounded-xl text-base hover:${primaryHover} transition`}
                    >
                      {item}
                    </RouterLink>
                  ) : (
                    <Link
                      to={item.toLowerCase()}
                      smooth={true}
                      duration={500}
                      offset={offsetValue}
                      onClick={() => closeMenuOnNavigate(index)}
                      className={`block px-3 py-3 cursor-pointer rounded-xl text-base ${
                        activeIndex === index
                          ? `${primary} font-bold blur-none`
                          : `${textGray} hover:opacity-100`
                      } hover:${primaryHover} transition`}
                    >
                      {item}
                    </Link>
                  )}
                </li>
              )
            )}
          </ul>

          <div
            className={`mt-auto p-4 text-xs ${
              darkMode
                ? "text-neutral-500 border-t border-neutral-800"
                : "text-neutral-500 border-t border-gray-200"
            }`}
          >
            <p>(c) {new Date().getFullYear()} MM</p>
          </div>
        </aside>
      </header>

      {/* Spacer to offset the fixed header height (measured dynamically) */}
      <div aria-hidden style={{ height: headerH }} />
    </>
  );
};

export default Navbar;
