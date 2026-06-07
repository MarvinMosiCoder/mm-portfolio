# Portfolio Process

This document describes the working process for maintaining the `vram-portfolio` project.

## Project Overview

`vram-portfolio` is a React and TypeScript portfolio site for Marvin Mosico. It includes public portfolio pages, a resume page, additional projects, and protected dashboard routes for admin-style content management.

## Tech Stack

- React 18 with TypeScript
- Create React App / `react-scripts`
- Tailwind CSS
- React Router
- Supabase client integration
- EmailJS and React Toastify for contact-style interactions
- AOS, React Icons, Lucide React, and Styled Components for UI support

## Main Routes

- `/` - main portfolio content
- `/other-projects` - additional projects page
- `/resume` - resume page
- `/admin` - login/security form
- `/dashboard` - protected dashboard area
- `/dashboard/upload-file` - upload file screen
- `/dashboard/resume-data` - resume data management area

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

## Content Update Process

1. Update profile and resume details in `src/data/resumeData.ts`.
2. Update portfolio project entries in `src/data/projectsData.ts`.
3. Place public assets such as logos, images, and resume files inside `public/`.
4. Check affected pages in the browser, especially `/`, `/resume`, and `/other-projects`.
5. Run `npm run build` before deployment to confirm the app compiles successfully.

## Design Maintenance Process

The portfolio uses a modern, minimal developer profile style. Keep the design direct, readable, and focused on professional outcomes.

Current design direction:

- Opening loader uses a circular monogram `M` with a double-ring SVG mark, animated stroke drawing, and a teal/cyan/soft-pink glow.
- Public portfolio brand colors are shared through CSS variables and utilities in `src/index.css`.
- Brand palette:
  - Light theme uses deeper readable tones: teal `#0f766e`, cyan `#0891b2`, and pink `#c026d3`.
  - Dark theme uses brighter glow tones: teal `#14b8a6`, cyan `#67e8f9`, and pink `#f0abfc`.
- Hero section introduces Marvin clearly with resume and contact CTAs.
- The `View Resume` hero CTA intentionally stays neutral black/white instead of using the brand gradient.
- Core stack badges highlight Laravel, React, TypeScript, Tailwind, MySQL, Supabase, n8n Automation, CloudPanel, and cPanel.
- Social links stay with the main hero content instead of inside the availability panel.
- Project and experience cards use short impact/focus lines before longer descriptions.
- BacktradeLab is listed as a trading platform project with backtesting, live trading features, demo account support, and TradingView-style tools.
- Contact section includes direct Email, LinkedIn, and GitHub links before the form.
- Dark and light themes should stay consistent across cards, buttons, and form fields.

When updating the UI:

1. Prefer the shared brand utilities `brand-gradient-text`, `brand-gradient-bg`, `brand-ring`, `brand-link-hover`, `brand-focus`, and `portfolio-shell` instead of repeating hardcoded gradient classes.
2. Keep light-theme brand text readable by using the CSS variables rather than fixed bright cyan/pink Tailwind classes on white backgrounds.
3. Prefer left-aligned readable text instead of justified paragraphs.
4. Keep section spacing compact and consistent with Tailwind spacing utilities such as `py-8`, `py-10`, and `py-12`.
5. Avoid active navigation styles that shift layout; use color, weight, or underline states instead.
6. Use rounded `md` controls and cards for a clean application-like portfolio style.
7. Use project screenshots or meaningful product visuals when available instead of generic logos only.
8. Keep CTA labels clear and action-focused, such as `View Resume`, `Contact Me`, and `Other projects`.
9. Replace placeholder project links such as `https://your-backtradelab-link.com` when a real project URL is available.

## Brand Styling Notes

The main portfolio shell is styled in `src/Components/Content.tsx` with the `portfolio-shell` utility. It adds subtle teal and pink radial glows in both themes while preserving a white base in light mode and a dark ink base in dark mode.

Reusable brand utilities live in `src/index.css`:

- `brand-gradient-text` - adaptive teal/cyan/pink gradient text.
- `brand-gradient-bg` - adaptive teal/cyan/pink gradient background.
- `brand-ring` - subtle branded border and glow for framed content.
- `brand-link-hover` - cyan hover color for text links.
- `brand-focus` - teal focus border for form controls.
- `portfolio-shell` - page background treatment.

When adding new public-facing UI, prefer these utilities so the site keeps one visual system. If a component needs fixed icon or border colors, choose darker teal variants for light mode and brighter cyan variants for dark mode.

The loading gate is implemented in `src/Components/LoadingGate.tsx`. Keep its monogram centered inside the circular SVG viewbox so the opening mark stays aligned across desktop and mobile.

## Resume Download Process

The resume download button on `/resume` exports the resume content shown in the browser. It uses the browser print dialog through `window.print()`.

When checking the PDF download flow:

1. Open `/resume` in the browser.
2. Click the Download button.
3. Choose `Save as PDF` in the browser print dialog.
4. Confirm the saved PDF contains the resume content without the floating buttons.
5. Update `src/data/resumeData.ts` when the resume content needs to change.

The PDF layout is controlled by print styles in `src/index.css`. The resume component uses print-specific class hooks in `src/Components/Resume.tsx` so the saved PDF keeps the A4 page size, two-column resume layout, spacing, and colors close to the browser design.

The resume page theme toggle changes the surrounding browser background and control styling. The resume sheet itself stays white so the PDF remains readable and professional.

## Code Organization

- `src/App.tsx` defines the application routes and page titles.
- `src/Components/` contains the public portfolio UI sections.
- `src/pages/` contains dashboard and admin-related pages.
- `src/data/` stores portfolio and resume data used by the UI.
- `src/context/` contains shared React context such as authentication state.
- `src/Middleware/` contains route protection and security form logic.
- `src/lib/` contains external service clients such as Supabase.
- `public/` contains static assets served by the app.

## Deployment Checklist

- Confirm environment variables are configured correctly.
- Run `npm run build`.
- Review the generated `build/` output.
- Deploy the build output to the selected hosting provider.
- Verify the live site routes after deployment.

## Maintenance Notes

- Keep portfolio data current with recent projects and work experience.
- Avoid committing private credentials from `.env`.
- Test protected dashboard routes after changes to authentication or Supabase logic.
- Keep public resume files and displayed resume data aligned.
