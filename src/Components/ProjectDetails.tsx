import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Project } from "../data/projectsData";
import { getOsTheme } from "../theme/osTheme";
import ProjectGallery from "./ProjectGallery";
import { CloseGlyph } from "./os/OsIcons";

type Props = { project: Project; darkMode: boolean; onClose: () => void };

export default function ProjectDetails({ project, darkMode, onClose }: Props) {
  const theme = getOsTheme(darkMode);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-modal="true"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="project-details-dialog m-auto w-full max-w-2xl p-0"
      style={{ width: "calc(100% - 2rem)", background: theme.panel, color: theme.text, border: `1px solid ${theme.borderStrong}`, borderTop: `2px solid ${theme.accent}`, boxShadow: `0 24px 50px -20px ${theme.shadow}` }}
    >
      <div className="flex max-h-[85dvh] flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-2"
          style={{ background: theme.titlebarActive, borderBottom: `1px solid ${theme.border}` }}>
          <span className="os-mono text-xs" style={{ color: theme.textMuted }}>project.info</span>
          <button type="button" onClick={onClose} autoFocus title="Close project details" aria-label="Close project details"
            className="flex h-8 w-8 items-center justify-center border"
            style={{ borderColor: theme.borderStrong, color: theme.text }}>
            <CloseGlyph />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-5 sm:p-7">
          <div className="os-mono text-xs tracking-widest" style={{ color: theme.accent }}>PROJECT DETAILS</div>
          <h2 id={titleId} className="os-sans mt-2 text-2xl font-bold break-words">{project.project_name}</h2>
          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] os-mono text-xs">
            <div><dt style={{ color: theme.textMuted }}>Made at</dt><dd className="mt-1">{project.made_at}</dd></div>
            <div><dt style={{ color: theme.textMuted }}>Year</dt><dd className="mt-1">{project.year}</dd></div>
          </dl>
          <ProjectGallery key={project.id} images={project.images ?? []} projectName={project.project_name} theme={theme} />
          <section className="mt-6" aria-label="Overview">
            <h3 className="os-mono text-xs uppercase" style={{ color: theme.accent }}>Overview</h3>
            <p className="os-sans mt-3 text-sm leading-relaxed" style={{ color: theme.textMuted }}>{project.description}</p>
          </section>
          <section className="mt-6" aria-label="Key features">
            <h3 className="os-mono text-xs uppercase" style={{ color: theme.accent }}>Key features</h3>
            <ul className="os-sans mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed" style={{ color: theme.textMuted }}>
              {project.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </section>
          <section className="mt-6" aria-label="Technology stack">
            <h3 className="os-mono text-xs uppercase" style={{ color: theme.accent }}>Technology stack</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.build_with.map((tech) => <span key={tech} className="os-mono px-2 py-1 text-xs"
                style={{ background: theme.chipBg, border: `1px solid ${theme.chipBorder}`, color: theme.chipText }}>{tech}</span>)}
            </div>
          </section>
        </div>
      </div>
    </dialog>, document.body
  );
}
