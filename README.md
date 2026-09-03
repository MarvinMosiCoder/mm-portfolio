# MarvinMosico.OS Portfolio

A React and TypeScript portfolio for Marvin Mosico presented as an interactive desktop operating system. Portfolio sections open as draggable windows on larger screens and as a responsive, stacked experience on smaller screens.

## Features

- About, experience, projects, and contact sections presented as OS windows
- Draggable, resizable, minimizable, maximizable, and closable desktop windows
- Persistent window and desktop-icon layouts using browser `localStorage`
- Draggable desktop icons that snap to a grid and swap occupied positions
- Desktop context menus for removing/restoring icons and resetting their positions
- Searchable mobile app menu with portfolio links, resume access, and games
- Taskbar navigation, window previews, window switching, and light/dark themes
- Full-screen Chess, Solitaire, and Pinball apps
- Dedicated project archive and printable resume routes

## Routes

- `/` — interactive portfolio desktop
- `/other-projects` — complete project archive
- `/resume` — printable resume and PDF export view

## Tech Stack

- React 18 and TypeScript
- Create React App (`react-scripts`)
- Tailwind CSS
- React Router
- `chess.js` for chess rules and move validation
- EmailJS and React Toastify
- AOS, React Icons, and Lucide React
- `html2canvas` for window-preview thumbnails

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` — run the development server
- `npm test` — launch the test runner in watch mode
- `npm run build` — create an optimized production build in `build/`

## Using the Desktop

At desktop widths, click an icon to open or focus its section or app. At `2xl` widths and above, desktop icons can also be dragged; their snapped positions persist across reloads.

- Right-click an icon to remove it from the desktop.
- Right-click empty desktop space to reset icon positions or restore removed apps.
- Use the taskbar to focus, minimize, close, reorder, or preview portfolio windows.
- Open `chess.app`, `solitaire.app`, or `pinball.app` from the desktop or mobile menu.
- Press `Escape` to close a game or navigation dialog.

On smaller screens, use the taskbar's **MENU** button. The slide-out panel can search portfolio sections, the resume, and game apps by display name or filename.

## Updating Content

- Edit resume/profile data in `src/data/resumeData.ts`.
- Edit project entries in `src/data/projectsData.ts`.
- Put public images, documents, and other static assets in `public/`.
- Run `npm run build` before deployment.

For architecture, design-system conventions, maintenance notes, and deployment details, see [docs/process.md](docs/process.md).
