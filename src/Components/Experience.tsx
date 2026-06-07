import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Modal from "./Modal/Modal";

type Tech = string;

interface ExperienceItem {
  period: string;
  title: string;
  focus: string;
  description: string;
  techs: Tech[];
  aos: {
    animation: "fade-left" | "fade-right";
    delay: number;
  };
  
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    period: "2022 - PRESENT",
    title: "Application Software Developer | Digits Trading Corp",
    focus: "Business systems, integrations, dashboards, and internal tools.",
    description:
      "Designed, implemented, and optimized software solutions, integrated various data sources and systems, collaborated with teams to address requirements, ensured compliance with industry standards, and conducted testing for reliability and performance.",
    techs: ["PHP", "Laravel", "React", "TypeScript", "Tailwind", "jQuery", "MySQL"],
    aos: { animation: "fade-left", delay: 200 },
  },
  {
    period: "2021 - 2022",
    title: "Application Software Developer | Rex Group of Companies",
    focus: "PHP applications, responsive interfaces, and operational workflows.",
    description:
      "Designed, implemented, and optimized software solutions, integrated various data sources and systems, collaborated with teams to address requirements, ensured compliance with industry standards, and conducted testing for reliability and performance.",
    techs: ["PHP", "CodeIgniter", "jQuery", "MySQL"],
    aos: { animation: "fade-right", delay: 400 },
  },
];

type ExperienceProps = {
  darkMode?: boolean;
};

const Experience: React.FC<ExperienceProps> = ({ darkMode = true }) => {
  const primary = 'brand-gradient-text';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Tech>("");

  useEffect(() => {
    AOS.init({
      duration: 1200,
      offset: 100,
      once: false,
    });
  }, []);

  const handleOpenModal = (data: Tech) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="pb-2">
        <div className="flex items-center">
          <h2 className="text-center text-gray-300 text-xl font-medium mt-6 lg:hidden">
            EXPERIENCE
          </h2>
        </div>

        {EXPERIENCE_DATA.map((item, idx) => (
          <EXPCARD
            key={idx}
            period={item.period}
            title={item.title}
            focus={item.focus}
            description={item.description}
            techs={item.techs}
            darkMode={darkMode}
            aosAnimation={item.aos.animation}
            aosDelay={item.aos.delay}
            onTechClick={handleOpenModal}
            primary={primary}
          />
        ))}
      </div>

      {/* Modal Component */}
      <Modal
        show={isModalOpen}
        onClose={handleCloseModal}
        title="Technology Details"
        modalData={modalData}
      />
    </>
  );
};

function EXPCARD({
  period,
  title,
  focus,
  description,
  techs,
  darkMode,
  onTechClick,
  aosAnimation = "fade-right",
  aosDelay = 400,
  href,
  icon,
  label,
  primary,
}: {
  period: string;
  title: string;
  focus: string;
  description: string;
  techs: string[];
  darkMode: boolean;
  primary: string;
  onTechClick?: (tech: Tech) => void;
  aosAnimation?: "fade-left" | "fade-right";
  aosDelay?: number;
  // Optional CTA (kept from your original props)
  href?: string;
  icon?: React.ReactNode;
  label?: string;
}) {
  const baseCard =
    "flex flex-col gap-4 lg:gap-8 shadow-sm backdrop-blur border p-4 rounded-md mt-5 lg:flex-row transition-colors duration-300";
  const themeClasses = darkMode
    ? "border-cyan-300/10 bg-neutral-900/60 text-gray-200 hover:bg-neutral-800/70 hover:border-cyan-300/25"
    : "border-teal-500/15 bg-white/70 text-gray-800 hover:bg-white/90 hover:border-teal-500/35";

  return (
    <>
        <div
            className={`${baseCard} ${themeClasses} items-start`} // add items-start
            data-aos={aosAnimation}
            data-aos-delay={aosDelay}
        >
            {/* LEFT: period */}
            <div className="lg:w-40 shrink-0 self-start">    {/* fixed width + no shrink */}
                <span className={`${darkMode ? "text-gray-100" : "text-gray-800"} text-sm`}>
                {period}
                </span>
            </div>

        {/* RIGHT: content */}
            <div className={`${darkMode ? "text-gray-100" : "text-gray-800"} flex-1`}>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className={`${darkMode ? "text-cyan-300" : "text-teal-700"} mt-1 text-sm font-medium`}>{focus}</p>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2 text-sm leading-relaxed tracking-normal`}>{description}</p>
                <div className="flex flex-wrap gap-1">
                {techs.map((tech) => (
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

      {href && label && (
        <a
          href={href}
          className={`group inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm backdrop-blur transition-all duration-300 ${
            darkMode
              ? "border-white/10 bg-neutral-900/60 text-gray-200 hover:bg-neutral-800/70 hover:border-white/20"
              : "border-teal-500/15 bg-white/70 text-gray-800 hover:bg-white/90 hover:border-teal-500/35"
          }`}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
        >
          {icon && <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>}
          <span>{label}</span>
        </a>
      )}
    </>
  );
}

export default Experience;
