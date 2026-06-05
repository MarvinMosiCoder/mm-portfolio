import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaEnvelope, FaFacebook, FaFileAlt, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

interface MainViewProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainView: React.FC<MainViewProps> = ({ darkMode }) => {
  const stack = ["Laravel", "React", "TypeScript", "Tailwind", "MySQL", "Supabase", "n8n Automation", "CloudPanel", "cPanel"];

  return (
    <main
      className={`pt-10 md:pt-14 transition-colors duration-500 ${
        darkMode ? "text-gray-100" : "text-gray-800"
      }`}
    >
      <div className="grid min-h-[calc(100vh-160px)] items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <p
            className={`text-xs uppercase tracking-wide transition-opacity duration-300 ${
              darkMode ? "text-gray-400 opacity-70" : "text-gray-600 opacity-80"
            }`}
          >
            Hey, I'm
          </p>

          <h1 className="mt-3 text-5xl font-bold leading-[1.05] tracking-normal sm:text-6xl md:text-7xl">
            <span
              className="
                bg-gradient-to-r
                from-blue-600 via-indigo-500 to-purple-600
                dark:from-cyan-400 dark:via-blue-400 dark:to-pink-400
                bg-clip-text text-transparent
              "
            >
              Marvin Mosico
            </span>
          </h1>

          <p
            className={`mt-4 max-w-2xl text-sm leading-relaxed transition-colors duration-300 md:text-base ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Full Stack Web Developer building business systems with Laravel, React, TypeScript, Tailwind, and MySQL. I focus on clean interfaces, reliable workflows, and practical tools that help teams move faster.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <RouterLink
              to="/resume"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-gray-200"
            >
              <FaFileAlt size={15} />
              View Resume
            </RouterLink>
            <a
              href="mailto:marvinmosicoo@gmail.com"
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition ${
                darkMode
                  ? "border-white/15 text-gray-100 hover:border-white/30 hover:bg-white/5"
                  : "border-neutral-300 text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"
              }`}
            >
              <FaEnvelope size={15} />
              Contact Me
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                  darkMode
                    ? "border-white/10 bg-neutral-900/70 text-gray-300"
                    : "border-neutral-200 bg-neutral-50 text-neutral-700"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CTA
              href="https://www.linkedin.com/in/marvin-mosico-0b1467210/"
              icon={<FaLinkedin size={16} />}
              label="LinkedIn"
              darkMode={darkMode}
            />
            <CTA
              href="https://github.com/MarvinMosiCoder"
              icon={<FaGithub size={16} />}
              label="Github"
              darkMode={darkMode}
            />
            <CTA
              href="https://instagram.com"
              icon={<FaInstagram size={16} />}
              label="Instagram"
              darkMode={darkMode}
            />
            <CTA
              href="https://www.facebook.com/MarvinMosicoo"
              icon={<FaFacebook size={16} />}
              label="Facebook"
              darkMode={darkMode}
            />
          </div>
        </section>

        <aside
          className={`rounded-md border p-4 ${
            darkMode
              ? "border-white/10 bg-neutral-900/60"
              : "border-neutral-200 bg-white"
          }`}
        >
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Available for
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Web applications, dashboards, and internal business systems.
          </h2>
          <div className={`mt-4 border-t pt-4 ${darkMode ? "border-white/10" : "border-neutral-200"}`}>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm leading-relaxed`}>
              I build practical tools for teams that need reliable workflows, clean interfaces, and maintainable code.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

function CTA({
  href,
  icon,
  label,
  darkMode,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  darkMode: boolean;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium backdrop-blur transition-all duration-300 ${
        darkMode
          ? "border-white/10 bg-neutral-900/60 text-gray-200 hover:border-white/20 hover:bg-neutral-800/70"
          : "border-neutral-200/60 bg-white/70 text-gray-800 hover:border-neutral-300 hover:bg-white/90"
      }`}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </a>
  );
}

export default MainView;
