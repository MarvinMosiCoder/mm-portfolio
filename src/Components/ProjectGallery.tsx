import React, { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiImage } from "react-icons/fi";
import { ProjectImage } from "../data/projectsData";
import { OsTheme } from "../theme/osTheme";

type Props = { images: ProjectImage[]; projectName: string; theme: OsTheme };

export default function ProjectGallery({ images, projectName, theme }: Props) {
  const [index, setIndex] = useState(0);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const activeIndex = Math.min(index, Math.max(0, images.length - 1));
  const current = images[activeIndex];
  const move = (direction: number) => setIndex((activeIndex + direction + images.length) % images.length);
  const multiple = images.length > 1;
  const controlStyle = { border: `1px solid ${theme.borderStrong}`, color: theme.text, background: theme.panel };

  if (!images.length) return null;

  return (
    <section className="mt-6" aria-label={`${projectName} images`} aria-roledescription="carousel">
      <div
        tabIndex={multiple ? 0 : undefined}
        aria-label={multiple ? "Project images. Swipe or use left and right arrow keys to browse." : "Project image"}
        className="relative overflow-hidden outline-offset-4"
        style={{ background: theme.bg, border: `1px solid ${theme.border}`, touchAction: "pan-y pinch-zoom" }}
        onKeyDown={(event) => {
          if (!multiple || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault(); event.stopPropagation();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }}
        onPointerDown={(event) => {
          if (!multiple || !event.isPrimary || event.button !== 0) return;
          gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => { gesture.current = null; }}
        onLostPointerCapture={() => { gesture.current = null; }}
      >
        <div className="aspect-video flex items-center justify-center" role="group" aria-roledescription="slide"
          aria-label={current ? `${activeIndex + 1} of ${images.length}` : "No images"}>
          {current && !failedSources.includes(current.src) ? (
            <img key={current.src} src={current.src} alt={current.alt} draggable={false}
              className="h-full w-full object-contain select-none" decoding="async"
              onError={() => setFailedSources((sources) => [...sources, current.src])} />
          ) : (
            <div className="flex flex-col items-center gap-3 p-6 text-center" style={{ color: theme.textMuted }}>
              <FiImage size={28} aria-hidden="true" />
              <p className="os-mono text-xs">Image unavailable</p>
            </div>
          )}
        </div>
      </div>
      {current && (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="os-mono min-w-0 text-xs" aria-live="polite" aria-atomic="true" style={{ color: theme.textMuted }}>
            {activeIndex + 1} / {images.length}{current.caption ? ` - ${current.caption}` : ""}
          </p>
          {multiple && <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => move(-1)} title="Previous image" aria-label="Previous image"
              className="flex h-11 w-11 items-center justify-center" style={controlStyle}><FiChevronLeft size={18} /></button>
            <button type="button" onClick={() => move(1)} title="Next image" aria-label="Next image"
              className="flex h-11 w-11 items-center justify-center" style={controlStyle}><FiChevronRight size={18} /></button>
          </div>}
        </div>
      )}
      {multiple && <div className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Choose a project image">
        {images.map((image, imageIndex) => (
          <button key={`${image.src}-${imageIndex}`} type="button" onClick={() => setIndex(imageIndex)}
            aria-label={`Show image ${imageIndex + 1}: ${image.alt}`} aria-pressed={activeIndex === imageIndex}
            className="h-14 w-24 shrink-0 overflow-hidden border-2"
            style={{ borderColor: activeIndex === imageIndex ? theme.accent : theme.border, background: theme.bg }}>
            {failedSources.includes(image.src) ? <FiImage className="mx-auto" aria-hidden="true" /> :
              <img src={image.src} alt="" loading="lazy" draggable={false} className="h-full w-full object-contain"
                onError={() => setFailedSources((sources) => [...sources, image.src])} />}
          </button>
        ))}
      </div>}
    </section>
  );
}
