# Portfolio Process

This document describes the working process for maintaining the `vram-portfolio` project.

## Project Overview

`vram-portfolio` is a React and TypeScript portfolio site for Marvin Mosico, styled as a small
desktop-OS ("MarvinMosico.OS"): sections render as windows on a desktop, with a menu bar, a taskbar,
a boot screen, and a window switcher. It is a fully static, public site — there is no backend,
database, or authenticated admin area.

## Tech Stack

- React 18 with TypeScript
- Create React App / `react-scripts`
- Tailwind CSS, plus a small hand-written OS design-token system (`src/theme/osTheme.ts`)
- React Router
- EmailJS and React Toastify for contact-style interactions
- AOS (scroll reveal), React Icons, Lucide React
- `html2canvas` (lazy-loaded) for taskbar/window-switcher thumbnail previews
- `chess.js` for legal move generation, game status, undo, and promotion in `chess.app`

There is no database or backend client in this project. A previous Supabase-backed admin
dashboard (auth, file storage, resume-data forms) was removed entirely — see
[Removed: Supabase admin area](#removed-supabase-admin-area).

## Main Routes

- `/` - main portfolio desktop (about, experience, projects, contact as windows)
- `/other-projects` - full project archive
- `/resume` - resume page (print/PDF view)

There are no `/admin` or `/dashboard` routes. If routes for editing content are ever needed
again, they'll need a backend to be re-introduced first — see the removal notes below before
resurrecting any of that code from git history.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app runs at:

```text
http://localhost:3000
```

Run tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

No environment variables are required to run or build the app. `.env` only contains commented-out
leftovers from an earlier Firebase experiment that was never wired up — safe to ignore or delete.

## Content Update Process

1. Update profile and resume details in `src/data/resumeData.ts`.
2. Update portfolio project entries in `src/data/projectsData.ts`.
3. Place public assets such as images and resume files inside `public/`.
4. Check affected pages in the browser, especially `/`, `/resume`, and `/other-projects`.
5. Run `npm run build` before deployment to confirm the app compiles successfully.

All content is static/hardcoded in `src/data/`. There is no CMS, form, or database to edit
content through — changes are made directly in these files and shipped with a normal deploy.

## Design System: MarvinMosico.OS

The site's visual identity is a desktop-OS metaphor, not a generic "developer portfolio" theme.
Keep new UI consistent with this system rather than introducing one-off styling.

- **Design tokens** live in `src/theme/osTheme.ts` as two plain objects, `DARK_OS_THEME` and
  `LIGHT_OS_THEME`, accessed via `getOsTheme(darkMode)`. Components read `theme.bg`,
  `theme.accent`, etc. and pass them into inline `style` props — this project does not use
  Tailwind's `dark:` variants for OS-themed components.
- **Dark/light mode** is read from `localStorage.getItem("theme")` independently by each
  top-level route component (there is no shared `ThemeContext`). When adding a new top-level
  route, copy the existing read/effect pattern from `Content.tsx` or `AnotherProjects.tsx`
  rather than inventing a new one.
- **Typography**: `os-mono` (IBM Plex Mono) for labels, chips, filenames, and anything meant to
  read as system/terminal text; `os-sans` (IBM Plex Sans) for prose and headings. Both utility
  classes are defined in `src/index.css`.
- **Shape language is boxy, not rounded.** Windows, buttons, chips, and cards use plain 1px
  borders and square corners — no `rounded-md`/`rounded-xl` on OS chrome. The only rounded
  elements in the whole system are the small `rounded-full` status dots (taskbar "available"
  indicator). Keep new components square to match.
- **Accent color** is a single amber/gold (`theme.accent`) used sparingly for active states,
  focus indicators, and the one "available for work" dot — not for large fills or gradients.
- **Chip list**: the tech-stack chips on the About window (`src/Components/MainView.tsx`,
  `STACK` array) currently read Laravel, React, TypeScript, Tailwind, MySQL, n8n Automation,
  CloudPanel, cPanel. Keep this list honest — it was trimmed to remove "Supabase" when the
  database-backed admin area was removed; don't add a technology here unless it's actually
  used somewhere in the live app.
- **Taskbar tabs are icon-only.** Each open section renders in `Taskbar.tsx` as a 32×32 square
  showing nothing but its `SectionIcon`. The filename (`about.sys`, `experience.log`, ...) lives
  on `title` and `aria-label`, and the hover-preview panel still prints it in its header, so
  dropping the visible label doesn't drop the accessible name. The close button is absolutely
  positioned in the tab's top-right corner and revealed on hover (`hidden` → `group-hover:flex`,
  not an opacity fade), so the strip never reflows and the badge isn't clickable while invisible;
  the minimized dot is centered on the bottom edge. Section icons come from the single
  `SECTION_ICONS` map in `OsIcons.tsx`, shared with `DesktopRail` — adding a key to `SECTIONS`
  means adding its icon there too (the `Record<SectionKey, ...>` type enforces it). Don't define
  a second icon map locally in a component.
- **Window chrome** (`src/Components/os/WindowChrome.tsx`) is the reusable "window" used for
  each About/Experience/Projects/Contact section on `/`. New sections on the desktop should be
  wrapped in it rather than styled ad hoc. Its titlebar puts the ACTIVE indicator on the left and
  the title + `WinControls` (minimize/maximize/close) flush right, controls at the very edge — the
  same markup renders both the floating (desktop) and stacked (mobile) titlebar, so this layout is
  shared everywhere, not just one mode. Pass its optional `floating` prop (`{ rect, zIndex,
  maximized, bounds, taskbarHeight, onRectChange, onToggleMaximize }`) to get drag/resize/fullscreen
  behavior — see Window Manager below; omit it and the component renders exactly as a plain
  in-flow window with CSS-breakout maximize, no drag. Don't fork this component for the two modes;
  extend the `floating` branch instead.
- **Reusable OS chrome** lives in `src/Components/os/`: `MenuBar`, `Taskbar`, `DesktopRail`,
  `TaskSwitcher`, `MobileNavPanel`, `ContextMenu`, `MinimizeGhost`, `BootScreen`, `WindowChrome`,
  the full-screen `ChessGame`, `Solitaire`, and `Pinball` apps, and shared
  icon primitives in `OsIcons.tsx` (`LogoMark`, `WinControls`, `GridIcon`, `CloseGlyph`,
  `SectionIcon`, `ChessIcon`, `SolitaireIcon`, `PinballIcon`).
  Section state (open/closed/minimized/active, plus floating position/size/z-order/maximized via
  `useWindowLayout`) is owned entirely by `Content.tsx` and passed down as props — chrome
  components don't read shared state on their own.

When updating the UI:

1. Prefer left-aligned readable text instead of justified paragraphs.
2. Keep section spacing compact and consistent with Tailwind spacing utilities such as `py-8`,
   `py-10`, and `py-12`.
3. Avoid active navigation styles that shift layout; use color, weight, border, or underline
   states instead (see `theme.accent` usage on the active taskbar tab in `Taskbar.tsx` or the
   active icon in `DesktopRail.tsx`).
4. Use square, bordered controls and cards — not rounded — to stay consistent with the OS chrome.
5. Use project screenshots or meaningful product visuals when available instead of generic
   logos only.
6. Keep CTA labels clear and action-focused, such as `View Resume`, `Contact Me`, and
   `Other projects`.
7. Replace placeholder project links (anything containing `your-` in `src/data/projectsData.ts`)
   when a real project URL is available — `AnotherProjects.tsx` renders those as "pending"
   instead of a link until then.
8. Give any icon-only control an accessible name — `title` for the native tooltip plus
   `aria-label` for screen readers — and reveal hover-only affordances without changing layout
   (absolute positioning, not a new element in the flow).

## Window Manager (Floating Windows)

At desktop widths (`≥768px`, matching Tailwind's `md` — `DESKTOP_BREAKPOINT` in `os/constants.ts`),
the four sections stop being stacked, scroll-navigated panels and become real floating windows:
draggable by their titlebar, resizable from any edge or corner, individually maximizable to true
fullscreen, and remembered across visits. Below `768px` the original stacked/scroll layout is
untouched — dragging doesn't work well on touch, so there's no floating fallback for mobile/tablet.

- **`src/Hooks/useMediaQuery.ts`** is a small `matchMedia` wrapper. `Content.tsx` uses it for the
  `768px` desktop/floating threshold, the `640px` and `1536px` breakpoints that size the desktop
  canvas's side margins and reserve room for `DesktopRail`, and `prefers-reduced-motion` (skips the
  maximize/restore transition).
- **`src/Hooks/useWindowLayout.ts`** owns each window's `{x, y, width, height}`, click-to-front
  z-order, and maximized state. Rects are clamped back into view whenever the viewport resizes, and
  are persisted to `localStorage` (`marvinmosicoos-window-layout`) on drag/resize *end* — dragging
  updates only `WindowChrome`'s own local state while the gesture is in progress, not on every
  pointer move.
- **The desktop canvas reserves the rail gutter with a real offset, not padding.** The floating-window
  container in `Content.tsx` sets its `left`/`right` via inline `style`, computed from the
  breakpoints above — padding on a positioned ancestor doesn't inset its `position:absolute`
  children (their containing block is the ancestor's full padding box), so a window at `left: 0`
  would render flush with the canvas's outer edge regardless of padding, sliding underneath
  `DesktopRail`. The reserved gutter is `128px` at `1536px`+, matching the width `DesktopRail`
  itself has always needed, on top of the same base side margin `<main>` uses below that.
- **Maximize is true fullscreen, not a bigger box.** A maximized window escapes the canvas
  entirely and covers the whole page — menu bar and rail included — down to just above the
  taskbar, which stays reachable. That needs more than a z-index bump: a CSS stacking context caps
  every descendant's z-index at its own level when compared against outside siblings, so a window
  nested inside the canvas (`z-20`) can never out-rank the menu bar (`z-40`) no matter what
  z-index it declares. `Content.tsx` renders maximized windows as real DOM siblings of
  `MenuBar`/`Taskbar` instead, at `z-45` — see the `renderFloatingWindow` helper and how
  `visibleSections` gets filtered by `isMaximized()` into two separate render locations.
- **Section-level navigation no longer lives in `MenuBar`.** The old About/Experience/Projects/
  Contact/Resume text links were removed — `Taskbar` (icon tabs, all widths) and `DesktopRail`
  (icon rail, `2xl`+) are the navigation now, consistent with a real desktop app using a taskbar
  instead of a browser nav bar. `MenuBar` is just the logo, availability status, theme toggle, and
  the mobile menu trigger. `navigateToSection` in `Content.tsx` still branches on `isDesktop`
  (bring-to-front + focus vs. smooth-scroll) — every nav affordance, including `MainView`'s
  "Contact Me" button, calls this one function rather than driving `react-scroll` directly, which
  matters in floating mode since there's no page to scroll.

## Desktop Icons and App Menu

At `2xl` widths and above, `DesktopRail.tsx` behaves like a desktop icon surface rather than a
fixed navigation rail. It contains the four portfolio section icons, `resume.pdf`, and three game
apps: `chess.app`, `solitaire.app`, and `pinball.app`.

- **Icon layout** is owned by `src/Hooks/useDesktopIconLayout.ts`. Icons are freely draggable,
  snap to an 84x77 grid on release, remain inside the menu-bar/taskbar-safe viewport, and swap
  places when one is dropped into an occupied cell. Positions persist in `localStorage` under
  `marvinmosicoos-desktop-icons` and are clamped again when the viewport changes size.
- **Removing icons** uses the shared `ContextMenu.tsx`: right-click an icon and choose
  `Remove from desktop`. Hidden keys persist under `marvinmosicoos-desktop-hidden`; removing an
  icon only hides its shortcut and does not close or delete the underlying section/app.
- **Desktop recovery actions** appear when empty desktop space is right-clicked. `Reset icon
  positions` returns visible icons to their default column, while `Restore removed apps` makes
  every hidden icon visible again. Native context menus are left intact inside windows and on
  interactive controls.
- **Mobile navigation** is a left-side app panel with filename/display-name search. It includes
  the portfolio sections, resume, and all three games, and clears its query whenever it closes.
  Desktop icon placement and hiding intentionally apply only to the `2xl` desktop surface.

## Built-in Games

The games are full-screen modal apps launched from the desktop icons or mobile app menu. Each
uses the active OS theme, locks background scrolling while open, and closes with its close button
or `Escape`.

- **Chess** (`ChessGame.tsx`) is local two-player chess backed by `chess.js`. It validates moves,
  highlights legal destinations, reports check/checkmate/draw states, supports promotion choices,
  undo, and a new game. Closing and reopening preserves the current board until `New game` is used.
- **Solitaire** (`Solitaire.tsx`) implements draw-one Klondike with selectable card runs,
  foundations, stock recycling, undo, win detection, and a new shuffled game.
- **Pinball** (`Pinball.tsx`) is a canvas-based three-ball game with bumpers, collision physics,
  scoring, touch controls, and keyboard controls. Use Left/Right Arrow or `A`/`D` for the flippers
  and Space to launch. Opening the app starts a fresh game.

## Favicon & App Icons

The favicon and app icons (`public/favicon.svg`, `public/favicon.ico`, `public/favicon.png`,
`public/logo192.png`, `public/logo512.png`, `public/apple-touch-icon.png`) are all rendered from
the exact same path data as `LogoMark` in `src/Components/os/OsIcons.tsx`, so the icon in a
browser tab matches the glyph used inside the app. `favicon.svg` is hand-written and is the
primary `<link rel="icon">`; the raster set was generated with a one-off Python + Pillow script
(supersampled and downsampled for anti-aliasing) and isn't checked into the repo.

If `LogoMark`'s path or the accent color ever changes, regenerate the raster icon set to match —
don't let the favicon drift from the in-app mark. `public/manifest.json` and the `<link>` tags
in `public/index.html` reference these files directly.

## Resume Download Process

The resume download button on `/resume` exports the resume content shown in the browser. It uses
the browser print dialog through `window.print()`.

When checking the PDF download flow:

1. Open `/resume` in the browser.
2. Click the Download button.
3. Choose `Save as PDF` in the browser print dialog.
4. Confirm the saved PDF contains the resume content without the floating toolbar.
5. Update `src/data/resumeData.ts` when the resume content needs to change.

The PDF layout is controlled by print styles in `src/index.css`. The resume component uses
print-specific class hooks in `src/Components/Resume.tsx` so the saved PDF keeps the A4 page
size, two-column resume layout, spacing, and colors close to the browser design.

The toolbar above the resume (back link, theme toggle, download button) is OS-themed and follows
`theme.bg`/`theme.accent` like the rest of the site. The resume sheet itself stays white/paper-styled
regardless of theme, by design, so the PDF stays readable and professional — don't theme the sheet
itself to dark mode.

## Code Organization

- `src/App.tsx` defines the application routes and page titles (`/`, `/other-projects`, `/resume`).
- `src/Components/` contains the public portfolio UI sections (About, Experience, Projects,
  Contact, Resume, AnotherProjects, MainView).
- `src/Components/os/` contains the reusable desktop-OS chrome (see Design System above).
- `src/theme/` contains the OS color-token system (`osTheme.ts`).
- `src/Hooks/` contains shared hooks: `useActiveSection` (scroll-spy for the desktop sections,
  used below the floating-window breakpoint), `useWindowThumbnails` (lazy `html2canvas` capture +
  cache for taskbar/switcher previews), `useMediaQuery` (small `matchMedia` wrapper), `useWindowLayout`
  (floating-window position/size/z-order + `localStorage` persistence — see Window Manager above),
  `useDesktopIconLayout` (desktop icon position/visibility persistence), and `LanguageInfo`.
- `src/data/` stores portfolio, project, and resume data used by the UI (all static).
- `public/` contains static assets served by the app, including the generated favicon/app-icon
  set (see Favicon & App Icons above).

There is no `src/pages/`, `src/context/`, `src/Middleware/`, or `src/lib/` anymore — those held
the Supabase-backed admin dashboard and were deleted along with it.

## Removed: Supabase Admin Area

The project previously had a Supabase-backed admin area: `/admin` (login), `/dashboard` (an
authenticated shell with an overview, a resume-file upload screen backed by Supabase Storage,
and forms that inserted rows into a `profiles` table via Supabase Postgres). None of that backend
exists anymore, so the whole layer was deleted rather than left as dead code pointing at nothing:

- `lib/supabaseClient.ts`, `context/AuthContext.tsx`, `Middleware/ProtectedRoute.tsx`,
  `Middleware/SecurityForm.tsx`
- `pages/Dashboard.tsx`, `pages/OverviewPage.tsx`, `pages/UploadFile.tsx`,
  `pages/AddResumeData.tsx`, `pages/ResumeDataForm/*`
- `types/db.ts`
- the `@supabase/supabase-js` dependency and the `REACT_APP_SUPABASE_*` values in `.env`

The public site never actually depended on any of this — `/resume` has always read from the
static `resumeDataMap` in `src/data/resumeData.ts`, not from the database. If content management
is needed again in the future, it needs a real backend (Supabase project or otherwise)
provisioned first; don't restore the old admin code as-is, since it assumes tables and storage
buckets that no longer exist.

## Deployment Checklist

- Run `npm run build`.
- Review the generated `build/` output.
- Deploy the build output to the selected hosting provider.
- Verify the live site routes after deployment (`/`, `/other-projects`, `/resume`).

No environment variables need to be configured — the app has no backend to point at.

## Maintenance Notes

- Keep portfolio data current with recent projects and work experience.
- Keep the `STACK` chip list in `MainView.tsx` honest — only list technologies actually in use.
- Keep public resume files and displayed resume data aligned.
- If `LogoMark` changes, regenerate the favicon/app-icon set so the browser tab icon stays in
  sync with the in-app glyph.
