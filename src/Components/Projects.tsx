import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import Modal from "./Modal/Modal";
import BorderGlow from "./Reactbits/BorderGlow";

type Tech = string;

type AOSAnim = "fade-left" | "fade-right";

interface ProjectItem {
  title: string;
  impact: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  techs: Tech[];
  aos: {
    animation: AOSAnim;
    delay: number;
  };
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    title: "BacktradeLab",
    impact: "Trading platform with backtesting, live trading features, demo accounts, and charting tools.",
    description:
      "BacktradeLab is a trading platform concept built for testing strategies, reviewing market behavior, and supporting live or demo trading workflows. It includes backtest features, live trading tools, demo account support, and charting utilities inspired by platforms like TradingView.",
    imageSrc: "/img/backtrade-black-logo.png",
    imageAlt: "BacktradeLab trading platform logo",
    techs: ["PHP/Laravel","React", "TypeScript", "Tailwind", "TradingView Tools", "Vibe Coded using Codex and GPT5.5 Model ", "MySQL"],
    aos: { animation: "fade-left", delay: 200 },
  },
  {
    title: "Dynamic Vram Admin Template",
    impact: "Reusable dashboard foundation for business applications.",
    description:
      "A dynamic admin template is a customizable, feature-rich framework for building responsive, professional admin dashboards and interfaces, streamlining development with pre-built components and layouts.",
    imageSrc: "/vram-logo.webp",
    imageAlt: "Vram Admin Template logo",
    techs: ["PHP/Laravel", "React", "Inertia", "Tailwind", "MySQL"],
    aos: { animation: "fade-left", delay: 200 },
  },
];

type ProjectsProps = {
  darkMode?: boolean;
};

const Projects: React.FC<ProjectsProps> = ({ darkMode = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Tech>("");

  const primary =
    "brand-gradient-text";
  const primaryHover =
    "brand-link-hover";
  useEffect(() => {
    AOS.init({
      duration: 1200,
      offset: 100,
      once: false,
    });
  }, []);

  const handleOpenModal = (tech: Tech) => {
    setModalData(tech);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="pb-6">
        <div className="flex items-center">
          <h2 className={`${darkMode ? "text-gray-300" : "text-gray-700"} text-center text-xl font-medium mt-6 mb-6 lg:hidden`}>
            PROJECTS
          </h2>
        </div>

        {PROJECTS_DATA.map((proj, idx) => (
          <ProjectCard
            key={idx}
            item={proj}
            darkMode={darkMode}
            onTechClick={handleOpenModal}
            primary={primary}
          />
        ))}

        {/* CTA row */}
        <div className="flex flex-col gap-4 lg:pb-8 lg:flex-row">
          <Link to="other-projects" className="cursor-pointer group">
            <h2 className={`flex gap-1 ${darkMode ? "text-gray-300" : "text-gray-600"} text-lg items-center`}>
              <span className={`font-bold ${primaryHover} transition-colors`}>
                Other projects
              </span>
              <FaArrowRight
                className={`${darkMode ? "text-gray-300" : "text-gray-600"} ${primaryHover} mt-[2px] transition-colors`}
                size={15}
              />
            </h2>
          </Link>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        title="Technology Details"
        modalData={modalData}
      />
    </>
  );
};

function ProjectCard({
  item,
  darkMode,
  onTechClick,
  primary,
}: {
  item: ProjectItem;
  darkMode: boolean;
  primary: string;
  onTechClick?: (tech: Tech) => void;
}) {
  const baseCard =
    "flex flex-col gap-4 border p-4 rounded-md lg:flex-row transition-all duration-300";
  const themeClasses = darkMode
    ? "border-cyan-300/10 bg-neutral-950 text-gray-200 hover:border-cyan-300/25"
    : "border-teal-500/15 bg-white text-gray-800 hover:border-teal-500/35";
  const glowColors = darkMode ? ['#14b8a6', '#67e8f9', '#f0abfc'] : ['#0f766e', '#0891b2', '#c026d3'];

  return (
    <div data-aos={item.aos.animation} data-aos-delay={item.aos.delay}>
      <BorderGlow
        className="mb-5"
        edgeSensitivity={24}
        glowColor={darkMode ? "186 100 74" : "190 90 42"}
        backgroundColor="transparent"
        borderRadius={6}
        glowRadius={36}
        glowIntensity={darkMode ? 1.15 : 0.9}
        coneSpread={22}
        animated={false}
        fillOpacity={0}
        colors={glowColors}
    >
      <div className={`${baseCard} ${themeClasses}`}>
      {/* LEFT: image */}
      <div className={`grid min-h-[130px] place-items-center rounded-md lg:w-[180px] shrink-0 ${darkMode ? "bg-cyan-300/5" : "bg-teal-500/5"}`}>
        <img
          src={item.imageSrc}
          alt={item.imageAlt}
          className="max-h-[110px] w-full object-contain opacity-70"
          loading="lazy"
        />
      </div>

      {/* RIGHT: content */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <p className={`${darkMode ? "text-cyan-300" : "text-teal-700"} mt-1 text-sm font-medium`}>
          {item.impact}
        </p>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 text-sm leading-relaxed tracking-normal`}>{item.description}</p>

        <div className="flex flex-wrap gap-2">
          {item.techs.map((tech) => (
            <div key={tech}>
              <button
                type="button"
                className={`mt-2 px-2 py-1 border ${darkMode ? 'border-cyan-300/35 bg-cyan-300/5' : 'border-teal-500/20 bg-white/70 hover:bg-teal-500/5 hover:border-teal-500/40'} ${primary} rounded-md transition-colors duration-300`}
                onClick={onTechClick ? () => onTechClick(tech) : undefined}
                aria-label={`Show details for ${tech}`}
              >
                {tech}
              </button>
            </div>
          ))}
        </div>
      </div>
      </div>
    </BorderGlow>
    </div>
  );
}

export default Projects;
