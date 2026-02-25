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

## Deploy (Vercel)

The project includes a `vercel.json` that configures:

- **Build command:** `pnpm run build`
- **Output directory:** `build` (static export)

Connect the repo to Vercel; the default settings should work. If deployment fails, in **Project Settings → General → Build & Development Settings** set:

- **Framework Preset:** Other
- **Build Command:** `pnpm run build`
- **Output Directory:** `build`
- **Install Command:** `pnpm install`

