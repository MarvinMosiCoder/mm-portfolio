import React, { useState } from "react";
import Modal from "./Modal/Modal";
import { getOsTheme, OsTheme } from "../theme/osTheme";

type Tech = string;

interface ExperienceItem {
  period: string;
  company: string;
  role: string;
  focus: string;
  description: string;
  techs: Tech[];
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    period: "2022 — PRESENT",
    company: "Digits Trading Corp",
    role: "Application Software Developer",
    focus: "business systems, integrations, dashboards, internal tools",
    description:
      "Designed, implemented, and optimized software solutions, integrated various data sources and systems, collaborated with teams to address requirements, ensured compliance with industry standards, and conducted testing for reliability and performance.",
    techs: ["PHP", "Laravel", "React", "TypeScript", "Tailwind", "jQuery", "MySQL"],
  },
  {
    period: "2021 — 2022",
    company: "Rex Group of Companies",
    role: "Application Software Developer",
    focus: "PHP applications, responsive interfaces, operational workflows",
    description:
      "Developed dynamic web applications using PHP, JavaScript, and jQuery. Implemented responsive, user-friendly UI components. Collaborated with designers and developers to deliver functional, visually appealing applications.",
    techs: ["PHP", "CodeIgniter", "jQuery", "MySQL"],
  },
];

const EDUCATION = [
  { degree: "BSIT", school: "City of Malabon University", time: "2017 – 2020" },
  { degree: "Computer Science", school: "Access Computer College", time: "2016 – 2017" },
];

type ExperienceProps = { darkMode?: boolean };

const Experience: React.FC<ExperienceProps> = ({ darkMode = true }) => {
  const theme = getOsTheme(darkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Tech>("");

  const handleOpenModal = (tech: Tech) => {
    setModalData(tech);
    setIsModalOpen(true);
  };

  let line = 0;
  const nextLine = () => {
    line += 1;
    return String(line).padStart(2, "0");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <span className="os-mono text-xs" style={{ color: theme.textDim }}>
          ~/experience.log
        </span>
      </div>

      <div className="flex flex-col">
        {EXPERIENCE_DATA.map((item, idx) => (
          <React.Fragment key={item.company}>
            <LogRow n={nextLine()} theme={theme}>
              <span className="os-mono font-semibold" style={{ color: theme.accent }}>
                [{item.period}]
              </span>
            </LogRow>
            <LogRow n={nextLine()} theme={theme}>
              <span className="os-sans font-semibold" style={{ color: theme.text }}>
                {item.company} · {item.role}
              </span>
            </LogRow>
            <LogRow n={nextLine()} theme={theme}>
              <span className="os-mono" style={{ color: theme.textMuted }}>
                <span style={{ color: theme.accent }}>focus:</span> {item.focus}
              </span>
            </LogRow>
            <LogRow n={nextLine()} theme={theme}>
              <p className="os-sans leading-relaxed" style={{ color: theme.textMuted }}>
                {item.description}
              </p>
            </LogRow>
            <LogRow n={nextLine()} theme={theme}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="os-mono" style={{ color: theme.accent }}>
                  stack:
                </span>
                {item.techs.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => handleOpenModal(tech)}
                    className="os-mono text-xs px-2.5 py-1 transition-colors"
                    style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}
                    aria-label={`Show details for ${tech}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </LogRow>

            {idx < EXPERIENCE_DATA.length - 1 && (
              <LogRow n={nextLine()} theme={theme}>
                <span className="os-mono" style={{ color: theme.textDim }}>
                  ────────────────────────────────────
                </span>
              </LogRow>
            )}
          </React.Fragment>
        ))}

        <LogRow n={nextLine()} theme={theme}>
          <span className="os-mono" style={{ color: theme.textDim }}>
            ────────────────────────────────────
          </span>
        </LogRow>
        <LogRow n={nextLine()} theme={theme}>
          <span className="os-mono font-semibold" style={{ color: theme.accent }}>
            [EDUCATION]
          </span>
        </LogRow>
        {EDUCATION.map((edu) => (
          <LogRow key={edu.school} n={nextLine()} theme={theme}>
            <span className="os-sans" style={{ color: theme.textMuted }}>
              {edu.degree} — {edu.school} ({edu.time})
            </span>
          </LogRow>
        ))}
      </div>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Technology Details" modalData={modalData} />
    </>
  );
};

function LogRow({ n, theme, children }: { n: string; theme: OsTheme; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 sm:gap-4 py-1.5">
      <span className="os-mono w-6 shrink-0 pt-0.5 text-right text-xs" style={{ color: theme.textDim }}>
        {n}
      </span>
      <div className="flex-1 pl-3 sm:pl-4 text-xs sm:text-sm" style={{ borderLeft: `1px solid ${theme.border}` }}>
        {children}
      </div>
    </div>
  );
}

export default Experience;
