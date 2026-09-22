# ShouryaOS

Shourya Yadav's portfolio, shaped like an operating system. A lock screen, a desktop with draggable icons, windows, a dock and a menu bar, over a wallpaper that is drawn by code and reacts to what you do.

## What's in it

- **Three living wallpapers**, generated on a canvas from a seed (`src/wallpapers/`): *Moonrise Swell* (a woodblock sea, ripples answer clicks and drags), *Survey* (a topographic map, the cursor is a survey lamp and clicks plant flags) and *Constellation Circuit* (a star chart of projects wired as circuits; click a constellation to open it). Unlocking replays each one's intro. Opening an app sends a pulse from the icon.
- **Stage mode.** Clicking empty desktop while windows are open tucks them to the edges so the wallpaper can be played with directly. Escape or a click on a tucked window brings them back.
- **A real desktop.** Icons select, marquee-select, drag with grid snap, and remember where you put them. Double-click opens.
- **Liquid glass chrome.** The menu bar, dock and lock card use [ybouane/liquidglass](https://github.com/ybouane/liquidglass) (WebGL refraction). Windows use a matching CSS material. Turn effects off in Settings for the plain CSS fallback.
- **Apps:** About, Projects, Resume, Contact, Files (a Finder over the same content), Terminal, Music (Deezer previews via `api/deezer.js`), Settings.
- **Brand:** custom paper-cut SVG icons (`src/brand/glyphs.js`), an SY monogram, and a self-hosted type system: Erode for display, Chillax for UI, Sono for the terminal.

## Structure

```
src/
├── os/          compositor: OSContext (window manager), Desktop, DesktopIcons, Window, Dock, MenuBar, LockScreen, Glass
├── wallpapers/  engine (loop + interaction API) and the three scenes
├── apps/        one component per app; see src/apps/README.md for the contract
├── ui/          shared primitives (Doc, Section, Row, Tags, Button, Split, …) and their CSS
├── brand/       glyphs, AppIcon, Monogram
├── content/     all site text as data (profile, projects, resume, files)
├── styles/      fonts, tokens (palette per wallpaper, type scale, radii, glass material), base
└── contexts/    Sound, Music
```

Design rules: tokens only (no hardcoded colours in apps), no icon libraries, no Tailwind. The palette follows the wallpaper through `html[data-wallpaper]`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run test:run   # vitest
npm run test:e2e   # playwright (starts the dev server itself)
npm run build
```

Music search calls a Vercel edge function (`api/deezer.js`); it is unavailable under plain `vite` and the app says so. Everything else runs offline.

## Content

Edit `src/content/*.js`. The root `*.txt` files are the original source notes.
