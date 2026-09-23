# Svelte-Island 🐧🏝️

Learn Svelte 5 the cool way — gamified lessons with runes, 3D low-poly islands, and a penguin teacher.

> **Built with Svelte, to learn Svelte.**  
> This entire app was created by **Lord Ritesh** as a hands-on project to learn Svelte 5 and explore its reactive architecture from scratch.

---

## The Backstory & Engineering Takeaways

Building Svelte-Island was an iterative deep dive into modern frontend engineering and compiler-based reactivity.
Some key architectural challenges and learnings baked into this project:

- **Svelte 5 Runes & Reactivity:** Migrated away from legacy Svelte 3/4 stores and `export let` patterns to native primitives (`$state`, `$derived`, `$effect`, `$props`).

- **Semantic AST Code Validation:** Replaced brittle string matching and naive `.includes()` checks in quiz checkpoints with an **Abstract Syntax Tree (AST) parser**. Submissions are judged by syntactic intent (node types, commutative operations like `a * b` vs `b * a`, identifiers) rather than arbitrary whitespace or typography.

- **3D WebGL with Threlte:** Integrated `@threlte/core` and `@threlte/extras` to render dynamic 3D low-poly classrooms and animated penguin models on desktop screens, paired with selective asset warm-fetching on route entry.

- **Bundle & Asset Optimization:** Shaved off unused 3D models and pruned legacy UI component trees to keep static prerenders fast and responsive.

- **Auth (The "Mock" Reality):** Let’s be real — the login/signup here is a complete joke! 😄 There is no backend, no database, and no auth server. It simply grabs your display name, seeds an initial profile, and persists your progress in `localStorage`.

---

## How It Works

- **Auth & Session:** 100% mock. Pick a nickname on `/login`. Progress (XP, rank, passed tests) lives strictly in your browser (`localStorage: svelte-island-session`).
- **Gamified XP System:** Passing checkpoint tests awards **+50 XP** (+50 bonus on the capstone Master Test). Rank unlocks progressively: *Rookie → Apprentice → Explorer → Island Guide → Rune Master*.
- **Course Progression:** Sequential checkpoints unlock module by module (`test-1` through `test-5`, culminating in `test-master`).
- **3D Classroom:** Threlte-powered canvas on `/learn` routes (desktop), with assets lazy-warmed on route transition.

---

## Getting Started

### Development

```bash
pnpm install
pnpm dev