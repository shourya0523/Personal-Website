# Apps

Every app is a default-exported React component rendered inside a window. Contract:

- Props: `{ windowId, ...props }` (props come from `openApp(id, { props })`).
- OS services: `const os = useOS()` from `../os/OSContext` → `openApp(appId, { props, origin })`, `closeWindow(windowId)`, `wallpaper`, `setWallpaper`, `settings`, `setSetting`, `userName`, `apps`, `isMobile`.
- Sounds: `const sounds = useSounds()` from `../contexts/SoundContext` → `sounds.click()`, `sounds.open()`, `sounds.close()`, `sounds.error()` (respect `os.settings.sound`; the provider already does).
- Styling: only `src/ui` primitives and the tokens in `src/styles/tokens.css`. No Tailwind, no Lucide, no inline hex colors. Icons via `<AppIcon name flat />` from `../ui` (glyph names in `src/brand/glyphs.js`).
- Content: only from `src/content/*`. Never hardcode profile text in components.
- Fonts: body/UI is inherited (Chillax). Headings inherit Erode via h1–h3. Mono via `font-family: var(--font-mono)` (Sono) — Terminal uses it for everything.
- Layout: use `<Doc>` for document-style apps and `<Split side=...>` for apps with a sidebar. Must work at 360px width (windows go full-screen on mobile).
