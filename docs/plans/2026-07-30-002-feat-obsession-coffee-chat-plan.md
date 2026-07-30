---
title: "feat: Obsession coffee chat landing"
type: feat
date: 2026-07-30
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
deepened: false
---

# feat: Obsession coffee chat landing

## Goal Capsule

Ship a standalone `/coffee` page on the portfolio that feels like an Obsession meme tribute: campy, blood-soaked WebGL atmosphere, a One Wish Willow **frame-sequence ritual** on entry, and a clear path to book a coffee chat via the existing Notion Calendar meet link. Shareable link previews use the Nikki frown still as `og:image`.

**Authority:** User request (session) > this plan > existing portfolio patterns.

**Product Contract preservation:** Changed: R7, F1, AE6–AE8, KTD5, U4 — 3D willow replaced by user-authored frame sequence + gated wish intro (session-settled: user-directed).

**Stop when:** `/coffee` loads outside the mock-OS shell; landing requires click-to-open-box → play to willow-centered → click-to-wish → transition into the themed site; WebGL blood fluid runs after reveal (with reduced-motion fallback); hero meme copy + calendar CTA work; OG/Twitter meta resolve for `/coffee` with Nikki frown; frame-asset slot documented; unit + e2e coverage for intro gates, route/CTA/meta shell.

**Execution profile:** Code via `ce-work` / goal execution. Smoke-first for intro gates + WebGL + OG; unit-test CTA, intro state machine, and route isolation with WebGL/frames mocked.

---

## Product Contract

### Summary

Visitors book coffee chats through a themed landing page inspired by Curry Barker’s *Obsession* (2026) meme culture — especially Nikki’s “No no no… I thought we were having a nice date!” breakdown — reframed as a coffee chat. Entry is a One Wish Willow box ritual (frame sequence). Notion Calendar remains the booking backend; the themed page owns atmosphere, humor, and link preview.

### Problem Frame

The Notion meet URL (`https://calendar.notion.so/meet/shourya0523/coffee`) cannot host custom React theming, and its CSP `frame-ancestors` blocks embedding on external sites. A portfolio-hosted `/coffee` experience is required so the vibe lives on a controllable URL while booking still happens on Notion.

### Requirements

- R1. Standalone `/coffee` experience that does **not** enter landing → login → desktop OS shell.
- R2. Visual theme is Obsession / “Freaky Nikki” meme-camp (funny + horror aesthetic), not a straight trauma retelling of the film’s consent themes.
- R3. Hero wordplay centers on: “No no no no no… Don’t do that! We were having such a nice ~~date~~ coffee chat.”
- R4. Additional meme callouts appear as secondary copy/microinteractions: Nikki frown reaction, “Why don’t you love me?”, “I’m your freaky Nikki”, One Wish Willow / “wishes can’t be cancelled.”
- R5. Full-viewport WebGL liquid blood fluid (pointer-reactive) on the **post-wish** site, with `prefers-reduced-motion` static fallback.
- R6. User-supplied stills: Nikki frown for in-page + **link preview (`og:image` / Twitter card)**; Bear terror still for in-page reaction art.
- R7. User-supplied **frame sequence** (exported from a willow-box video: box opens → willow centered → willow breaks). On landing: prompt click to open the box; play until the willow is centered and pause; prompt click to make a wish; then transition into the themed site. session-settled: user-directed — chosen over a 3D willow model.
- R8. Booking: styled Notion calendar **preview card** + primary CTA that opens the meet URL in a new tab (`target="_blank"` `rel="noopener noreferrer"`). No iframe of Notion. Visible after the wish ritual completes.
- R9. Accurate per-route meta: title, description, `og:*`, `twitter:*` for `/coffee` that crawlers can read without executing the SPA.
- R10. Mobile + desktop first viewport readable; one composition (not a dashboard).
- R11. Tests cover intro click gates, route isolation, CTA href/target, and absence of OS chrome.

### Actors

- A1. Coffee-chat invitee — lands on `/coffee`, completes willow ritual, books via Notion.
- A2. Sharer — pastes `/coffee` into chat/social and sees Nikki OG preview.
- A3. Implementer / CI — Vitest + Playwright.

### Key Flows

- F1. Willow wish intro → themed site
  - **Trigger:** Visit `/coffee`
  - **Steps:** Show closed-box frame + “click to open” → play frames to willow-centered cue and pause → “click to make a wish” → play break frames → transition into CoffeeChat site (blood + hero + CTA)
  - **Outcome:** User earned the site via the wish ritual; no OS shell
  - **Covered by:** R1, R7, R10

- F2. Book coffee
  - **Trigger:** Click primary CTA (or preview card action) after reveal
  - **Steps:** Open Notion meet URL in new tab
  - **Outcome:** Notion scheduler available; themed page remains
  - **Covered by:** R8

- F3. Link preview
  - **Trigger:** Share `/coffee` URL
  - **Steps:** Crawler reads static meta from coffee HTML entry; `og:image` = Nikki frown asset
  - **Outcome:** Accurate Obsession-themed preview card
  - **Covered by:** R6, R9

### Acceptance Examples

- AE1. Visiting `/coffee` never shows the portfolio login button or dock.
- AE2. After reveal, CTA `href` is exactly `https://calendar.notion.so/meet/shourya0523/coffee` and opens externally.
- AE3. View-source / crawler fetch of `/coffee` includes Nikki `og:image` and coffee-chat title/description (not the generic portfolio meta).
- AE4. With `prefers-reduced-motion: reduce`, intro can skip or step without continuous playback; site remains usable without continuous fluid simulation.
- AE5. Hero (post-reveal) includes strikethrough “date” → “coffee chat” gag tied to the Obsession meme line.
- AE6. Before any site chrome, user sees a prompt to click to open the box; playback does not auto-start the open sequence without that click.
- AE7. After open playback, animation pauses with the willow centered and prompts click to make a wish.
- AE8. After the wish click, sequence finishes and the themed coffee site is revealed (hero + booking CTA).

### Scope Boundaries

**In scope**
- `/coffee` landing, willow frame-sequence intro ritual, WebGL blood (post-reveal), meme copy/motion, stills, Notion CTA preview, OG entry, tests, deploy rewrite for `/coffee`

**Out of scope**
- Customizing Notion-hosted meet UI beyond its native description field
- Replacing Notion with Calendly/other (session-settled: keep Notion)
- Full mock-OS coffee “app window”
- Real-time 3D willow / R3F willow scene (superseded by frames)
- Shipping audio of copyrighted film dialogue by default (optional mute-safe SFX later)

### Deferred to Follow-Up Work
- Drop-in final willow frame set when user exports/uploads it (manifest + numbered frames)
- Optional Contact/dock deep-link to `/coffee`
- Optional richer green-screen meme clip (video) if rights allow

---

## Planning Contract

### Assumptions

- User will place supplied stills at `public/assets/coffee/nikki-frown.jpg` and `public/assets/coffee/bear-terror.jpg` (or `.png`) if not already in the repo at implementation time.
- User will upload willow frames under `public/assets/coffee/willow-frames/` with a small manifest naming order, `openEnd` (willow-centered pause index), `wishEnd` (final break index), and fps.
- Until real frames exist, a minimal placeholder frame set + manifest keeps the ritual UX testable.
- Absolute OG image URL uses the production site origin; local preview may show relative paths until deploy.
- Fan-homage personal page using user-provided promotional stills; no scraping of Google Images in CI.
- session-settled: user-directed — WebGL fluid blood (not canvas metaballs); Nikki frown as preview; Notion link-out; campy meme tone; **frame-sequence willow ritual instead of 3D model**.

### Key Technical Decisions

- KTD1. Path isolation via Vite multi-page entry `coffee.html` + thin `src/coffee-main.jsx`, short-circuiting the OS `App` tree. (session-settled: user-directed — standalone page chosen over OS window)
- KTD2. Blood fluid: wrap/adapt existing WebGL `LiquidEther` into `BloodFluidBackground` with a dark-crimson palette and higher viscosity for “blood,” plus optional auto-splat; mount only after wish reveal (or keep mounted but hidden). Escalate to `@whatisjery/react-fluid-distortion` only if LiquidEther cannot read as blood.
- KTD3. Notion booking is link-out + styled preview card (CSP blocks iframes: `frame-ancestors` limited to Notion app origins).
- KTD4. OG meta lives in static `coffee.html` (crawlers do not run the SPA). Deploy rewrite maps `/coffee` → `coffee.html`.
- KTD5. Willow intro is a **preloaded image-frame player** driven by `manifest.json` (fps, `openEndFrame`, `wishEndFrame`), not a 3D model. State machine: `prompt-open` → `opening` → `prompt-wish` → `breaking` → `revealed`. session-settled: user-directed — chosen over R3F/GLB willow.
- KTD6. Typography/atmosphere: expressive non-default fonts (avoid Inter/Roboto); CSS variables for blood crimson, willow green-black, paper-cream accent; vignette + subtle film grain CSS — not purple AI-default kitsch.
- KTD7. Remove / do not ship `WillowScene` R3F stub as product surface; frames own the willow beat.

### High-Level Technical Design

```mermaid
stateDiagram-v2
  [*] --> PromptOpen
  PromptOpen --> Opening: click open box
  Opening --> PromptWish: reach openEndFrame (willow centered)
  PromptWish --> Breaking: click make a wish
  Breaking --> Revealed: reach wishEndFrame
  Revealed --> [*]: show blood + hero + CTA

flowchart TD
  visitor[Visitor /coffee] --> coffeeHtml[coffee.html static meta]
  coffeeHtml --> coffeeMain[coffee-main.jsx]
  coffeeMain --> page[CoffeeChat]
  page --> intro[WillowFrameIntro]
  intro -->|revealed| blood[BloodFluidBackground]
  intro -->|revealed| hero[Meme hero + motion]
  intro -->|revealed| card[CoffeeCalendarCard preview]
  card -->|CTA new tab| notion[calendar.notion.so meet coffee]
  coffeeHtml -->|og:image| nikki[assets/coffee/nikki-frown]
```

### Alternative Approaches Considered

| Approach | Why not |
|----------|---------|
| Iframe Notion meet page | Blocked by CSP `frame-ancestors` |
| Theme Notion meet page itself | No custom HTML/CSS support beyond description |
| Canvas metaball blood only | Rejected — user chose WebGL-focused fluid |
| 3D One Wish Willow (R3F/GLB) | Superseded — user will supply frame sequence from video |
| Single MP4/WebM instead of frames | User specified frame upload; frames allow precise pause-at-center gating without media seek fragility |
| Full React Router now | Useful later with fullscreen-apps plan; MPA entry is enough for one promo route |

---

## Implementation Units

### U1. Coffee HTML entry + deploy rewrite + asset slots

**Goal:** Crawler-readable `/coffee` shell with accurate meta and asset paths for Nikki/Bear stills.

**Requirements:** R6, R9, AE3

**Dependencies:** None

**Files:**
- Create: `coffee.html`
- Create: `src/coffee-main.jsx`
- Modify: `vite.config.js` (multi-page `input`)
- Create: `vercel.json` (or `public/_redirects`) rewrite `/coffee` → `coffee.html`
- Create: `public/assets/coffee/README.md` (expected filenames)
- Create: placeholder or committed user stills at `public/assets/coffee/nikki-frown.jpg`, `public/assets/coffee/bear-terror.jpg`

**Approach:** Static meta title/description/OG/Twitter pointing at Nikki image; `coffee-main.jsx` mounts only `CoffeeChat`. Document absolute `og:image` requirement for production domain.

**Test scenarios:**
- Happy path: built `coffee.html` contains `og:title`, `og:description`, `og:image` path including `nikki-frown`, and `twitter:card` = `summary_large_image`.
- Edge: trailing slash `/coffee/` still resolves via rewrite.
- Error: missing image file does not break HTML parse (broken preview only).

**Verification:** Build emits `dist/coffee.html`; rewrite config present; meta strings match coffee-chat copy (not portfolio defaults).

---

### U2. CoffeeChat page shell + meme hero + Notion preview CTA

**Goal:** Standalone themed page composition with hero gag and booking CTA (shown after intro reveal).

**Requirements:** R1–R4, R8, R10, AE1, AE2, AE5

**Dependencies:** U1

**Files:**
- Create: `src/pages/CoffeeChat.jsx`
- Create: `src/pages/CoffeeChat.css` (CSS variables + atmosphere)
- Create: `src/components/CoffeeCalendarCard.jsx`
- Create: `src/pages/CoffeeChat.test.jsx`
- Create: `e2e/coffee-chat.spec.js`

**Approach:** Gate main composition behind intro `revealed`. One hero composition: brand/signal, meme headline with strikethrough date, support sentence, CTA group, dominant blood plane behind. Calendar card is a preview surface linking out — not an iframe.

**Execution note:** Prefer smoke/runtime check for layout; unit-test CTA contract with motion/WebGL/intro mocked.

**Patterns to follow:** `LoginPage.jsx` full-bleed overlay + Framer entrance; design rules: no hero cards-as-decoration, no pill-stat clutter.

**Test scenarios:**
- Happy path: after reveal, CTA link href/target/rel correct; hero contains strikethrough date / coffee chat.
- Edge: narrow viewport still shows CTA without OS chrome.
- Integration: e2e completes intro clicks then asserts CTA; no dock/login.
- Covers AE1, AE2, AE5.

**Verification:** Unit + e2e green for CTA and shell isolation.

---

### U3. WebGL blood fluid background

**Goal:** Obsession-readable liquid blood atmosphere via WebGL after reveal.

**Requirements:** R5, AE4

**Dependencies:** U2 (mount point)

**Files:**
- Create: `src/components/BloodFluidBackground/BloodFluidBackground.jsx`
- Create: `src/components/BloodFluidBackground/BloodFluidBackground.css`
- Modify: `src/pages/CoffeeChat.jsx` (lazy Suspense mount post-reveal)
- Modify: `src/pages/CoffeeChat.test.jsx` (mock background)

**Approach:** Thin wrapper around `LiquidEther` with blood palette, viscous settings, autoDemo splat, fixed full-viewport layer under content. Honor `prefers-reduced-motion` by skipping RAF fluid and showing static gradient vignette.

**Patterns to follow:** `LoginPage.jsx` lazy + Suspense + fallback gradient.

**Test scenarios:**
- Happy path: component renders container `data-testid="blood-fluid"` when motion allowed (mocked WebGL).
- Edge: reduced-motion path renders static fallback without throwing.
- Error: Suspense fallback visible while chunk loads.

**Verification:** Manual pointer-drag produces fluid motion; reduced-motion still readable.

---

### U4. Willow frame-sequence wish intro

**Goal:** Gated One Wish Willow ritual from user frame sequence; then transition into the site.

**Requirements:** R7, AE4, AE6, AE7, AE8

**Dependencies:** U1

**Files:**
- Create: `src/components/WillowFrameIntro/WillowFrameIntro.jsx`
- Create: `src/components/WillowFrameIntro/WillowFrameIntro.css`
- Create: `src/components/WillowFrameIntro/WillowFrameIntro.test.jsx`
- Create: `public/assets/coffee/willow-frames/manifest.json`
- Create: placeholder frames under `public/assets/coffee/willow-frames/` (until user upload)
- Modify: `public/assets/coffee/README.md` (frame naming + manifest schema)
- Modify: `src/pages/CoffeeChat.jsx` (mount intro; reveal site on complete)
- Modify: `e2e/coffee-chat.spec.js` (click open → click wish → assert site)
- Delete or retire: `src/components/WillowScene.jsx` and `public/models/willow/` 3D docs (superseded)

**Approach:** Preload frames from manifest. States: `prompt-open` (idle on frame 0, CTA “Click to open the box”) → `opening` (advance to `openEndFrame`, willow centered) → `prompt-wish` (pause, CTA “Click to make a wish”) → `breaking` (advance to `wishEndFrame`) → call `onComplete` / set `revealed`. Reduced-motion: offer skip or instant step through prompts without timed playback. Do not autoplay past a gate without the matching click.

**Execution note:** Implement intro state machine test-first (gate clicks + frame indices).

**Technical design (directional):**
```
manifest: { fps, openEndFrame, wishEndFrame, frames: ["000.webp", ...] }
state: prompt-open | opening | prompt-wish | breaking | done
```

**Test scenarios:**
- Happy path: first click starts opening; auto-stops at `openEndFrame`; second click starts breaking; `onComplete` fires at end.
- Edge: reduced-motion path reaches `onComplete` via prompts without requiring frame timer.
- Error: missing frame image shows fallback still + still allows skip/complete so site is reachable.
- Covers AE6, AE7, AE8.
- Integration: e2e performs both clicks then sees calendar CTA.

**Verification:** Intro cannot reach booking CTA without completing (or reduced-motion skipping) the ritual; pause visibly holds on centered willow before wish click.

---

## Verification Contract

- `npm run test:run` — CoffeeChat + WillowFrameIntro unit tests pass
- `npm run test:e2e` — `e2e/coffee-chat.spec.js` passes (intro clicks + CTA)
- `npm run build` — emits `dist/index.html` and `dist/coffee.html`
- Manual: open `/coffee`, complete open → wish ritual, drag blood fluid, click CTA → Notion; view-source confirms Nikki OG

## Definition of Done

- All R1–R11 addressed or explicitly deferred above
- U1–U4 landed with cited tests
- Notion remains booking backend; no iframe dependency
- Frame ritual gates match AE6–AE8; 3D willow path removed from product surface
- User stills + frame-upload slot documented; Nikki is preview image

## Sources & Research

- Notion Calendar meet CSP: `frame-ancestors https://app.notion.com https://app.dev.notion.com` — external iframe impossible
- Obsession memes (Know Your Meme / TV Tropes / TikTok trends): “No no no… nice date”, Nikki frown, “Why don’t you love me?”, “Freaky Nikki”, One Wish Willow
- Local WebGL precedent: `src/components/LiquidEther/LiquidEther.jsx` (viscous fluid)
- Fluid libs surveyed: PavelDoGreat MIT WebGL Fluid, `@whatisjery/react-fluid-distortion`, `three-fluid-fx` — fallback if LiquidEther blood read fails
- Repo plan sibling: `docs/plans/2026-07-30-001-refactor-fullscreen-apps-redesign-plan.md` (future router; coffee stays outside OS)
- Session update: user replaces forthcoming 3D willow with video→frames upload and a two-click wish ritual before site reveal
