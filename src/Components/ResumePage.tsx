import React from "react";
import { useParams } from "react-router-dom";
import Resume from "../Components/Resume";
import { resumeDataMap } from "../data/resumeData";
import { getOsTheme } from "../theme/osTheme";

// Resume owns the theme for the happy path; the not-found branch renders
// instead of it, so it has to read the stored preference itself rather than
// falling through to an unthemed white page in dark mode.
function storedDarkMode(): boolean {
  if (typeof window === "undefined") return true;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") return true;
  if (saved === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ResumePage() {
  const { slug = "marvin-mosico" } = useParams();

  const resumeData = resumeDataMap[slug] ?? null;

  if (!resumeData) {
    const theme = getOsTheme(storedDarkMode());
    return (
      <div className="flex min-h-screen items-center justify-center px-6" style={{ background: theme.bg }}>
        <p className="os-mono text-sm" style={{ color: theme.danger }}>
          Failed to load resume: Profile not found.
        </p>
      </div>
    );
  }

  return <Resume data={resumeData} />;
}