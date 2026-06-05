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

- Hero section introduces Marvin clearly with resume and contact CTAs.
- Core stack badges highlight Laravel, React, TypeScript, Tailwind, MySQL, Supabase, n8n Automation, CloudPanel, and cPanel.
- Social links stay with the main hero content instead of inside the availability panel.
- Project and experience cards use short impact/focus lines before longer descriptions.
- BacktradeLab is listed as a trading platform project with backtesting, live trading features, demo account support, and TradingView-style tools.
- Contact section includes direct Email, LinkedIn, and GitHub links before the form.
- Dark and light themes should stay consistent across cards, buttons, and form fields.

When updating the UI:

1. Prefer left-aligned readable text instead of justified paragraphs.
2. Keep section spacing compact and consistent with Tailwind spacing utilities such as `py-8`, `py-10`, and `py-12`.
3. Avoid active navigation styles that shift layout; use color, weight, or underline states instead.
4. Use rounded `md` controls and cards for a clean application-like portfolio style.
5. Use project screenshots or meaningful product visuals when available instead of generic logos only.
6. Keep CTA labels clear and action-focused, such as `View Resume`, `Contact Me`, and `Other projects`.
7. Replace placeholder project links such as `https://your-backtradelab-link.com` when a real project URL is available.

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
