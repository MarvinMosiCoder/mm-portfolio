import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getOsTheme } from "../theme/osTheme";
import { projectsData } from "../data/projectsData";

const isPlaceholderLink = (link: string) => !link || link.includes("your-");

const AnotherProjects: React.FC = () => {
  const [darkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const theme = getOsTheme(darkMode);

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

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="os-mono inline-flex items-center gap-2 text-xs transition-colors"
          style={{ color: theme.textMuted }}
        >
          <FiArrowLeft size={12} />
          desktop
        </Link>

        <div
          className="mt-5 overflow-hidden"
          style={{ background: theme.panel, border: `1px solid ${theme.borderStrong}`, borderTop: `2px solid ${theme.accent}` }}
        >
          <div
            className="flex h-9 items-center justify-between px-3"
            style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}
          >
            <span className="os-mono text-xs" style={{ color: theme.text }}>
              projects.dir — full archive
            </span>
            <span className="os-mono text-[10px] tracking-wider" style={{ color: theme.accent }}>
              ACTIVE
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <div className="os-mono text-xs tracking-widest" style={{ color: theme.accent }}>
              {"// ALL PROJECTS"}
            </div>
            <h1 className="os-sans mt-2 text-2xl font-bold" style={{ color: theme.text }}>
              Complete project archive
            </h1>
            <p className="os-mono mt-2 text-xs" style={{ color: theme.textDim }}>
              {projectsData.length} items · sorted by year, desc
            </p>

            <div
              className="hidden md:grid mt-6 os-mono text-[10px] uppercase tracking-wide pb-2"
              style={{ gridTemplateColumns: "1.3fr 56px 1fr 1.5fr 90px", color: theme.textDim, borderBottom: `1px solid ${theme.border}` }}
            >
              <span>Name</span>
              <span>Year</span>
              <span>Made At</span>
              <span>Stack</span>
              <span>Link</span>
            </div>

            <div className="mt-2 md:mt-0">
              {projectsData.map((project) => (
                <div key={project.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                  {/* desktop row */}
                  <div
                    className="hidden md:grid items-center py-3 gap-3"
                    style={{ gridTemplateColumns: "1.3fr 56px 1fr 1.5fr 90px" }}
                  >
                    <span className="os-mono text-sm truncate" style={{ color: theme.text }}>
                      {project.project_name.toLowerCase().replace(/\s+/g, "-")}.proj
                    </span>
                    <span className="os-mono text-xs" style={{ color: theme.textMuted }}>
                      {project.year}
                    </span>
                    <span className="os-sans text-xs truncate" style={{ color: theme.textMuted }}>
                      {project.made_at}
                    </span>
                    <span className="os-mono text-[11px] truncate" style={{ color: theme.chipText }}>
                      {project.build_with.join(" · ")}
                    </span>
                    {isPlaceholderLink(project.link) ? (
                      <span className="os-mono text-[10px]" style={{ color: theme.textDim, opacity: 0.6 }}>
                        pending
                      </span>
                    ) : (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="os-mono text-[11px] font-semibold"
                        style={{ color: theme.accent }}
                      >
                        open →
                      </a>
                    )}
                  </div>

                  {/* mobile row */}
                  <div className="md:hidden flex flex-col gap-1 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="os-mono text-sm truncate" style={{ color: theme.text }}>
                        {project.project_name.toLowerCase().replace(/\s+/g, "-")}.proj
                      </span>
                      <span className="os-mono text-xs shrink-0" style={{ color: theme.textMuted }}>
                        {project.year}
                      </span>
                    </div>
                    <span className="os-sans text-xs" style={{ color: theme.textDim }}>
                      {project.made_at}
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.build_with.map((tech) => (
                        <span
                          key={tech}
                          className="os-mono text-[10px] px-2 py-0.5"
                          style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnotherProjects;
