# Step 1: Setup Commands (Industry-Grade Stack)

**Stack:** pnpm · SvelteKit · Svelte 5 Runes · shadcn-svelte · svelte-sonner · lucide-svelte

---

## What was run (completed)

1. **SvelteKit** created with `pnpm dlx sv create . --template minimal --types ts --no-add-ons --no-dir-check --install pnpm`
2. **Tailwind CSS v4** added (required by shadcn-svelte): `pnpm add tailwindcss @tailwindcss/vite` and plugin added to `vite.config.ts`
3. **Global CSS** created at `src/app.css` with `@import "tailwindcss"` and imported in `src/routes/+layout.svelte`
4. **UI libraries** installed: `pnpm add svelte-sonner lucide-svelte`
5. **shadcn-svelte** initialized: `pnpm dlx shadcn-svelte@latest init --base-color slate --css src/app.css` (with `$lib` aliases)
6. **Border radius** set to `0.75rem` in `src/app.css` (`:root { --radius: 0.75rem }`)

---

## Add Shadcn components (run when registry is available)

Buttons, Dialogs, Badges, Separators, Sheets, Popover (for Sonic Minidisc):

```bash
pnpm dlx shadcn-svelte@latest add button dialog badge separator sheet popover -y
```

If that fails with "Failed to fetch registry", retry when online or add components one by one, e.g. `pnpm dlx shadcn-svelte@latest add button -y`.

---

## Reference: Full setup from empty directory

If starting from scratch elsewhere:

1. **Create SvelteKit:**  
   `pnpm dlx sv create . --template minimal --types ts --no-add-ons --no-dir-check --install pnpm`

2. **Tailwind v4:**  
   `pnpm add tailwindcss @tailwindcss/vite`  
   Add `import tailwindcss from '@tailwindcss/vite'` and `tailwindcss()` in `vite.config.ts`.  
   Create `src/app.css` with `@import "tailwindcss";` and import it in `src/routes/+layout.svelte` (e.g. `import '../app.css'`).

3. **UI libs:**  
   `pnpm add svelte-sonner lucide-svelte`

4. **shadcn-svelte init:**  
   `pnpm dlx shadcn-svelte@latest init --base-color slate --css src/app.css`

5. **Radius:** In `src/app.css`, set `:root { --radius: 0.75rem }`.

6. **Components:**  
   `pnpm dlx shadcn-svelte@latest add button dialog badge separator sheet popover -y`

All commands use **pnpm** only (no npm/yarn).
