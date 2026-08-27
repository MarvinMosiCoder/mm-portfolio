import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Modal from "./Modal/Modal";
import { projectsData, Project } from "../data/projectsData";
import { getOsTheme, OsTheme } from "../theme/osTheme";

const getClient = (madeAt: string) => madeAt.split("(")[0].trim();
const isPlaceholderLink = (link: string) => !link || link.includes("your-");

type ProjectsProps = { darkMode?: boolean };

const Projects: React.FC<ProjectsProps> = ({ darkMode = true }) => {
  const theme = getOsTheme(darkMode);
  const [filter, setFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>(projectsData[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState("");

  const years = useMemo(
    () => Array.from(new Set(projectsData.map((p) => p.year))).sort((a, b) => Number(b) - Number(a)),
    []
  );
  const clients = useMemo(() => Array.from(new Set(projectsData.map((p) => getClient(p.made_at)))), []);

  const countFor = (value: string) =>
    projectsData.filter((p) => p.year === value || getClient(p.made_at) === value).length;

  const filtered = useMemo(() => {
    if (filter === "all") return projectsData;
    return projectsData.filter((p) => p.year === filter || getClient(p.made_at) === filter);
  }, [filter]);

  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];

  const openTechModal = (tech: string, e: React.SyntheticEvent) => {
    e.stopPropagation();
    setModalData(tech);
    setIsModalOpen(true);
  };

  const FilterChip = ({ value, label, count }: { value: string; label: string; count: number }) => {
    const isActive = filter === value;
    return (
      <button
        type="button"
        onClick={() => setFilter(value)}
        className="os-mono flex shrink-0 items-center justify-between gap-2 px-3 py-1.5 text-xs transition-colors md:w-full"
        style={{
          background: isActive ? theme.accentSoft : "transparent",
          color: isActive ? theme.text : theme.textMuted,
        }}
      >
        <span className="truncate text-left">{label}</span>
        <span className="shrink-0" style={{ color: theme.textDim }}>
          {count}
        </span>
      </button>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="os-mono text-xs" style={{ color: theme.textDim }}>
          ~/projects.dir
        </span>
        <span className="os-mono text-xs" style={{ color: theme.textDim }}>
          {filtered.length} items
        </span>
      </div>

      {/* mobile filter strip */}
      <div className="md:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1">
        <FilterChip value="all" label="All" count={projectsData.length} />
        {years.map((y) => (
          <FilterChip key={y} value={y} label={y} count={countFor(y)} />
        ))}
        {clients.map((c) => (
          <FilterChip key={c} value={c} label={c} count={countFor(c)} />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-5">
        {/* sidebar */}
        <div className="hidden md:block w-44 shrink-0" style={{ borderRight: `1px solid ${theme.border}` }}>
          <div className="pr-4">
            <div className="os-mono text-[10px] tracking-wide mb-1.5" style={{ color: theme.accent }}>
              VIEW
            </div>
            <FilterChip value="all" label="All Projects" count={projectsData.length} />
            {years.map((y) => (
              <FilterChip key={y} value={y} label={y} count={countFor(y)} />
            ))}
            <div className="h-px my-3" style={{ background: theme.border }} />
            <div className="os-mono text-[10px] tracking-wide mb-1.5" style={{ color: theme.accent }}>
              CLIENTS
            </div>
            {clients.map((c) => (
              <FilterChip key={c} value={c} label={c} count={countFor(c)} />
            ))}
          </div>
        </div>

        {/* list */}
        <div className="flex-1 min-w-0">
          <div
            className="hidden md:grid os-mono text-[10px] uppercase tracking-wide pb-2 mb-1"
            style={{ gridTemplateColumns: "1.3fr 56px 1fr 1.5fr", color: theme.textDim, borderBottom: `1px solid ${theme.border}` }}
          >
            <span>Name</span>
            <span>Year</span>
            <span>Made At</span>
            <span>Stack</span>
          </div>

          <div>
            {filtered.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                theme={theme}
                isSelected={project.id === selected?.id}
                onSelect={() => setSelectedId(project.id)}
                onTechClick={openTechModal}
              />
            ))}
          </div>

          {selected && (
            <div
              className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4"
              style={{ borderTop: `1px solid ${theme.border}` }}
            >
              <div>
                <div className="os-sans text-lg font-bold" style={{ color: theme.text }}>
                  {selected.project_name}
                </div>
                <div className="os-mono text-xs mt-1" style={{ color: theme.textDim }}>
                  {selected.made_at} · {selected.year}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selected.build_with.map((tech) => (
                    <button
                      key={tech}
                      type="button"
                      onClick={(e) => openTechModal(tech, e)}
                      className="os-mono text-[10px] px-2 py-1"
                      style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
              {isPlaceholderLink(selected.link) ? (
                <span
                  className="os-mono text-xs font-semibold px-4 py-2.5 shrink-0 opacity-50 cursor-not-allowed"
                  style={{ border: `1px solid ${theme.borderStrong}`, color: theme.textDim }}
                  title="Link coming soon"
                >
                  LINK PENDING
                </span>
              ) : (
                <a
                  href={selected.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="os-mono text-xs font-semibold px-4 py-2.5 shrink-0 transition-colors"
                  style={{ border: `1px solid ${theme.accent}`, color: theme.accent }}
                >
                  OPEN PROJECT →
                </a>
              )}
            </div>
          )}

          <Link
            to="/other-projects"
            className="mt-4 inline-flex items-center gap-1.5 os-mono text-xs transition-colors"
            style={{ color: theme.textMuted }}
          >
            <span>→ other-projects/</span>
            <FiArrowRight size={12} />
          </Link>
        </div>
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Technology Details" modalData={modalData} />
    </>
  );
};

function ProjectRow({
  project,
  theme,
  isSelected,
  onSelect,
  onTechClick,
}: {
  project: Project;
  theme: OsTheme;
  isSelected: boolean;
  onSelect: () => void;
  onTechClick: (tech: string, e: React.SyntheticEvent) => void;
}) {
  const rowStyle: React.CSSProperties = {
    background: isSelected ? theme.accentSoft : "transparent",
    borderLeft: `3px solid ${isSelected ? theme.accent : "transparent"}`,
    borderBottom: `1px solid ${theme.border}`,
  };

  const stackText = project.build_with.join(" · ");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className="w-full text-left cursor-pointer"
      style={rowStyle}
    >
      {/* desktop */}
      <div
        className="hidden md:grid items-center py-2.5 pl-3 pr-2 gap-3"
        style={{ gridTemplateColumns: "1.3fr 56px 1fr 1.5fr" }}
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
          {stackText}
        </span>
      </div>

      {/* mobile */}
      <div className="md:hidden flex flex-col gap-1 py-3 px-3">
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
            <button
              key={tech}
              type="button"
              onClick={(e) => onTechClick(tech, e)}
              className="os-mono text-[10px] px-2 py-0.5"
              style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
