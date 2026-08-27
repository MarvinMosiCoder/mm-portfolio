import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaEnvelope, FaFacebook, FaFileAlt, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { getOsTheme } from "../theme/osTheme";
import { MENU_BAR_HEIGHT } from "./os/constants";

interface MainViewProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const STACK = ["Laravel", "React", "TypeScript", "Tailwind", "MySQL", "n8n Automation", "CloudPanel", "cPanel"];

const MainView: React.FC<MainViewProps> = ({ darkMode }) => {
  const theme = getOsTheme(darkMode);

  return (
    <div>
      <div className="os-mono text-xs tracking-widest" style={{ color: theme.accent }}>
        {"// IDENTITY"}
      </div>

      <h1 className="os-sans mt-2 text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: theme.text }}>
        Marvin Mosico
      </h1>
      <div className="os-mono mt-1 text-xs uppercase tracking-widest" style={{ color: theme.textMuted }}>
        Full-Stack Web Developer
      </div>

      <div className="my-5 h-px" style={{ background: theme.border }} />

      <div className="os-sans space-y-4 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
        <p>
          I build business systems with Laravel, React, TypeScript, Tailwind, and MySQL — four years in, with a BSIT
          degree and focused study in Computer Science behind it. I care about clean interfaces, reliable workflows,
          and practical tools that help teams move faster.
        </p>
        <p>Off the clock: gaming and travel keep the curiosity sharp.</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {STACK.map((item) => (
          <span
            key={item}
            className="os-mono text-xs px-3 py-1.5"
            style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <RouterLink
          to="/resume"
          className="os-mono inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold transition"
          style={{ background: theme.accent, color: theme.panel }}
        >
          <FaFileAlt size={13} />
          View Resume
        </RouterLink>
        <ScrollLink
          to="contact"
          smooth
          duration={500}
          offset={-(MENU_BAR_HEIGHT + 20)}
          className="os-mono inline-flex cursor-pointer items-center justify-center gap-2 border px-5 py-3 text-xs font-semibold transition"
          style={{ borderColor: theme.borderStrong, color: theme.text }}
        >
          <FaEnvelope size={13} />
          Contact Me
        </ScrollLink>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <SocialLink href="https://www.linkedin.com/in/marvin-mosico-0b1467210/" icon={<FaLinkedin size={15} />} label="LinkedIn" theme={theme} />
        <SocialLink href="https://github.com/MarvinMosiCoder" icon={<FaGithub size={15} />} label="Github" theme={theme} />
        <SocialLink href="https://instagram.com" icon={<FaInstagram size={15} />} label="Instagram" theme={theme} />
        <SocialLink href="https://www.facebook.com/MarvinMosicoo" icon={<FaFacebook size={15} />} label="Facebook" theme={theme} />
      </div>

      <div className="mt-6 p-4" style={{ background: theme.accentSoft, border: `1px solid ${theme.accent}` }}>
        <div className="os-mono text-[11px] tracking-wide" style={{ color: theme.accent }}>
          AVAILABLE FOR
        </div>
        <p className="os-sans mt-1.5 text-sm" style={{ color: theme.text }}>
          Web applications, dashboards, and internal business systems.
        </p>
      </div>
    </div>
  );
};

function SocialLink({
  href,
  icon,
  label,
  theme,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  theme: ReturnType<typeof getOsTheme>;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className="os-mono flex items-center justify-center gap-2 px-3 py-2.5 text-xs transition"
      style={{ border: `1px solid ${theme.chipBorder}`, background: theme.chipBg, color: theme.chipText }}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

export default MainView;
