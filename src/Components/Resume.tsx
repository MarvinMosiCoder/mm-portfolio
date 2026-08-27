import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileDownload, FaMoon, FaSun } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { getOsTheme } from "../theme/osTheme";

export type ExperienceItem = {
  company: string;
  role: string;
  time: string;
  bullets: string[];
};

export type EducationItem = {
  degree: string;
  school: string;
  time: string;
  location?: string;
};

export type AwardItem = {
  title: string;
  org: string;
  time: string;
};

export type ResumeData = {
  name: string;
  title: string;
  avatarUrl?: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
    linkedin?: string;
  };
  profile?: string;
  languages?: { name: string; levelDots?: number }[];
  skills?: {
    frontend?: string[];
    backend?: string[];
    tools?: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  awards?: AwardItem[];
};

type ResumeProps = {
  data: ResumeData;
};

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[13px] font-extrabold uppercase tracking-[2px] text-slate-900">
      {children}
    </h2>
  );
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[26px] font-extrabold uppercase tracking-[1.5px] text-slate-900">
      {children}
    </h2>
  );
}

function normalizeUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default function Resume({ data }: ResumeProps) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") return true;
      if (saved === "light") return false;
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });

  useEffect(() => {
    AOS.init({ duration: 800, offset: 80, once: false });
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
  const theme = getOsTheme(darkMode);
  const nameParts = data.name.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div
      className="resume-print-page min-h-screen pb-10 transition-colors duration-300 print:bg-white print:p-0"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    >
      <div
        className="print:hidden os-mono sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 sm:px-6"
        style={{ background: theme.menubar, borderBottom: `1px solid ${theme.border}` }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-xs transition-colors"
          style={{ color: theme.textMuted }}
        >
          <FaArrowLeft size={11} />
          <span>desktop</span>
        </Link>

        <span className="hidden sm:inline text-xs" style={{ color: theme.textDim }}>
          resume.pdf — print preview
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDarkMode((v) => !v)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-7 w-7 items-center justify-center border"
            style={{ borderColor: theme.border, color: theme.textMuted }}
          >
            {darkMode ? <FaSun size={12} /> : <FaMoon size={12} />}
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            aria-label="Download resume as PDF"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold"
            style={{ background: theme.accent, color: theme.panel }}
          >
            <FaFileDownload size={11} />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      <div
        className="
          resume-print-sheet
          mx-auto mt-6 bg-white shadow-sm print:shadow-none print:mt-0
          w-full max-w-[794px]
          min-h-[1123px]
        "
      >
        <div className="resume-print-content px-8 py-8 md:px-9 md:py-8 print:px-[28px] print:py-[26px]">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[16px] uppercase tracking-[4px] text-slate-700 leading-none">
                {firstName}
              </p>

              <h1 className="mt-1 text-[44px] md:text-[54px] font-black uppercase tracking-[3px] text-slate-900 leading-[0.95] break-words">
                {lastName}
              </h1>

              <p className="mt-3 text-[11px] md:text-[13px] uppercase tracking-[6px] text-slate-600">
                {data.title}
              </p>
            </div>

            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-[96px] h-[96px] md:w-[110px] md:h-[110px] rounded-full object-cover shrink-0"
              />
            ) : null}
          </div>

          <div className="mt-6 border-t border-slate-300 pt-5">
            <div className="resume-print-grid grid grid-cols-1 md:grid-cols-[0.9fr_1.45fr] gap-8 print:gap-7">
              {/* LEFT COLUMN */}
              <div className="space-y-7">
                <section className="break-inside-avoid-page">
                  <SidebarHeading>Contact</SidebarHeading>

                  <div className="space-y-2.5 text-[12.5px] leading-5 text-slate-700">
                    {data.contact.phone ? (
                      <div className="flex items-start gap-3">
                        <Phone size={14} className="mt-[2px] shrink-0" />
                        <span>{data.contact.phone}</span>
                      </div>
                    ) : null}

                    {data.contact.email ? (
                      <div className="flex items-start gap-3 break-all">
                        <Mail size={14} className="mt-[2px] shrink-0" />
                        <a href={`mailto:${data.contact.email}`}>
                          {data.contact.email}
                        </a>
                      </div>
                    ) : null}

                    {data.contact.address ? (
                      <div className="flex items-start gap-3">
                        <MapPin size={14} className="mt-[2px] shrink-0" />
                        <span>{data.contact.address}</span>
                      </div>
                    ) : null}

                    {data.contact.website ? (
                      <div className="flex items-start gap-3 break-all">
                        <Globe size={14} className="mt-[2px] shrink-0" />
                        <a
                          href={normalizeUrl(data.contact.website)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {data.contact.website}
                        </a>
                      </div>
                    ) : null}

                    {data.contact.linkedin ? (
                      <div className="flex items-start gap-3 break-all">
                        <Linkedin size={14} className="mt-[2px] shrink-0" />
                        <a
                          href={normalizeUrl(data.contact.linkedin)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    ) : null}
                  </div>
                </section>

                <div className="border-t border-slate-300" />

                {data.skills ? (
                  <section className="break-inside-avoid-page">
                    <SidebarHeading>Skills</SidebarHeading>

                    <div className="space-y-3 text-[12.5px] leading-5 text-slate-700">
                      {data.skills.frontend?.length ? (
                        <div>
                          <p className="mb-1.5 font-bold uppercase tracking-[1px] text-slate-900">
                            Frontend:
                          </p>
                          <ul className="list-disc pl-5 space-y-0.5">
                            {data.skills.frontend.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {data.skills.backend?.length ? (
                        <div>
                          <p className="mb-1.5 font-bold uppercase tracking-[1px] text-slate-900">
                            Backend
                          </p>
                          <ul className="list-disc pl-5 space-y-0.5">
                            {data.skills.backend.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {data.skills.tools?.length ? (
                        <div>
                          <p className="mb-1.5 font-bold uppercase tracking-[1px] text-slate-900">
                            Tools & Other Skills
                          </p>
                          <ul className="list-disc pl-5 space-y-0.5">
                            {data.skills.tools.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                <div className="border-t border-slate-300" />

                <section className="break-inside-avoid-page">
                  <SidebarHeading>Education</SidebarHeading>

                  <div className="space-y-4">
                    {data.education.map((edu, index) => (
                      <div
                        key={index}
                        className="relative border-l border-slate-300 pl-4"
                      >
                        <div className="absolute -left-[5px] top-[6px] h-2 w-2 rounded-full bg-slate-700" />
                        <h3 className="text-[13px] font-extrabold uppercase text-slate-900">
                          {edu.degree}
                        </h3>
                        <p className="text-[12.5px] leading-5 text-slate-700">
                          {edu.school}
                        </p>
                        <p className="text-[12.5px] leading-5 text-slate-600">
                          {edu.time}
                        </p>
                        {edu.location ? (
                          <p className="text-[12.5px] leading-5 text-slate-600">
                            {edu.location}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-7">
                {data.profile ? (
                  <section className="break-inside-avoid-page">
                    <SidebarHeading>Summary</SidebarHeading>
                    <div className="border-l border-slate-300 pl-5">
                      <p className="text-[13.5px] leading-6 text-slate-700">
                        {data.profile}
                      </p>
                    </div>
                  </section>
                ) : null}

                <div className="border-t border-slate-300" />

                <section className="break-inside-avoid-page">
                  <MainHeading>Professional Experience</MainHeading>

                  <div className="relative border-l border-slate-300 pl-6 space-y-7">
                    {data.experience.map((exp, index) => (
                      <div key={index} className="relative break-inside-avoid-page">
                        <div className="absolute -left-[29px] top-[7px] h-2.5 w-2.5 rounded-full bg-slate-700" />

                        <h3 className="text-[15px] font-extrabold uppercase tracking-[1px] text-slate-900">
                          {exp.role}
                        </h3>

                        <div className="mb-2 flex flex-wrap items-center gap-x-3 text-[13px] text-slate-700">
                          <span className="font-semibold">{exp.company}</span>
                          <span>|</span>
                          <span>{exp.time}</span>
                        </div>

                        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-6 text-slate-700">
                          {exp.bullets.map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                {data.awards && data.awards.length > 0 ? (
                  <>
                    <div className="border-t border-slate-300" />
                    <section className="break-inside-avoid-page">
                      <SidebarHeading>Awards</SidebarHeading>
                      <div className="space-y-3">
                        {data.awards.map((award, index) => (
                          <div key={index}>
                            <h3 className="text-[13px] font-bold uppercase text-slate-900">
                              {award.title}
                            </h3>
                            <p className="text-[12.5px] text-slate-700">
                              {award.org}
                            </p>
                            <p className="text-[12.5px] text-slate-600">
                              {award.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
