import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Modal from "./Modal/Modal";

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
    imageSrc: "/vram-logo.webp",
    imageAlt: "BacktradeLab trading platform logo",
    techs: ["React", "TypeScript", "Tailwind", "TradingView Tools", "Automation"],
    aos: { animation: "fade-left", delay: 200 },
  },
  {
    title: "Dynamic Vram Admin Template",
    impact: "Reusable dashboard foundation for business applications.",
    description:
      "A dynamic admin template is a customizable, feature-rich framework for building responsive, professional admin dashboards and interfaces, streamlining development with pre-built components and layouts.",
    imageSrc: "/vram-logo.webp",
    imageAlt: "Vram Admin Template logo",
    techs: ["PHP", "Laravel", "React", "Inertia", "Tailwind", "MySQL"],
    aos: { animation: "fade-left", delay: 200 },
  },
  {
    title: "Gashapon Inventory System",
    impact: "Inventory workflow for capsule stocks, swaps, refills, and token operations.",
    description:
      "The gashapon inventory system tracks capsule inventory, manages pullout tokens, oversees token swaps, capsule refills, capsule swaps, and capsule merges, monitors Start of Day (SOD) and End of Day (EOD) activities, facilitates the exchange of tokens for capsules, collects tokens, and ensures that the gashapon machine remains adequately stocked.",
    imageSrc: "/img/logo.png",
    imageAlt: "Gashapon system logo",
    techs: ["PHP", "Laravel", "JQuery", "MySQL"],
    aos: { animation: "fade-right", delay: 200 },
  },
  {
    title: "Assets Management with Inventory and ERF",
    impact: "Asset request and inventory process for tracking employee requisitions.",
    description:
      "Managing assets involves overseeing their usage, processing requests for assets, ensuring their return, handling replenishment and ordering, maintaining an inventory list, sourcing items, and processing employee requisition forms.",
    imageSrc: "/asset-logo.webp",
    imageAlt: "Assets management logo",
    techs: ["PHP", "Laravel", "JQuery", "MySQL"],
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
    "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400 bg-clip-text text-transparent";
  const primaryHover =
    "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400";
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
          <h2 className="text-center text-gray-300 text-xl font-medium mt-6 mb-6 lg:hidden">
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
              <span className={`font-bold group-hover:${primaryHover} transition-colors`}>
                Other projects
              </span>
              <FaArrowRight
                className={`${darkMode ? "text-gray-300" : "text-gray-600"} group-hover:${primaryHover} mt-[2px] transition-colors`}
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
    "flex flex-col gap-4 mb-5 border p-4 rounded-md lg:flex-row transition-colors duration-300";
  const themeClasses = darkMode
    ? "border-white/10 bg-neutral-900/60 text-gray-200 hover:bg-neutral-800/70 hover:border-white/20"
    : "border-neutral-300/60 bg-white/70 text-gray-800 hover:bg-white/90 hover:border-neutral-300";

  return (
    <div
      className={`${baseCard} ${themeClasses}`}
      data-aos={item.aos.animation}
      data-aos-delay={item.aos.delay}
    >
      {/* LEFT: image */}
      <div className="grid min-h-[130px] place-items-center rounded-md bg-white/5 lg:w-[180px] shrink-0">
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
        <p className={`${darkMode ? "text-cyan-300" : "text-blue-700"} mt-1 text-sm font-medium`}>
          {item.impact}
        </p>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 text-sm leading-relaxed tracking-normal`}>{item.description}</p>

        <div className="flex flex-wrap gap-2">
          {item.techs.map((tech) => (
            <div key={tech}>
              <button
                type="button"
                className={`mt-2 px-2 py-1 border ${darkMode ? 'border-teal-300' : 'border-neutral-300/60 bg-white/70 text-gray-800 hover:bg-white/90 hover:border-neutral-300'} ${primary} hover:text-[#0a192f] rounded-md transition-colors duration-300`}
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
  );
}

export default Projects;
