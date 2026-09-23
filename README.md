# Svelte-Island

Learn Svelte 5 the cool way — gamified lessons with runes, islands, and a penguin teacher.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm run build
```

Static output is written to the `build/` directory (SvelteKit with `@sveltejs/adapter-static`).

## How it works (mock product)

- **Auth:** Mock only. Enter a display name on `/login`. There is no backend.
- **Session:** User name, XP, rank, and passed tests persist in `localStorage` (`svelte-island-session`). Logout clears them.
- **XP:** Passing a challenge awards **+50 XP** (+50 bonus for the master test). Rank climbs: Rookie → Apprentice → Explorer → Island Guide → Rune Master.
- **Progress:** Modules unlock when you pass the prior checkpoint test (`test-1` … `test-5`, then `test-master`).
- **3D classroom:** Threlte scene loads on `/learn` (desktop). Models warm-fetch on that route only.

## Deploy (Vercel)

The project includes a `vercel.json` that configures:

- **Build command:** `pnpm run build`
- **Output directory:** `build` (static export)

Connect the repo to Vercel; the default settings should work. If deployment fails, in **Project Settings → General → Build & Development Settings** set:

- **Framework Preset:** Other
- **Build Command:** `pnpm run build`
- **Output Directory:** `build`
- **Install Command:** `pnpm install`
