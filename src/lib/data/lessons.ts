/**
 * Svelte-Island curriculum: 15 Lessons + 5 Checkpoints across 5 Modules.
 * Hinglish content strategy + modelType for 3D penguin (black = pudgy, emperor, dancing).
 */

export type LessonType = 'lesson' | 'checkpoint';

export type ModelType = 'black' | 'emperor' | 'dancing';

export interface Lesson {
	id: string;
	module: number;
	title: string;
	slug: string;
	type: LessonType;
	description: string;
	modelType: ModelType;
	locked: boolean;
	markdownContent: string;
	initialCode?: string;
	/** When set, lesson unlocks only after this test is passed (e.g. 'test-1'). */
	unlockAfterTest?: string;
}

export const lessons: Lesson[] = [
	// --- MODULE 1: Reactivity Basics ---
	{
		id: 'l1',
		module: 1,
		type: 'lesson',
		slug: 'reactivity-state',
		title: '1. The Magic Box ($state)',
		description: 'Making variables reactive.',
		modelType: 'black',
		locked: false,
		markdownContent: `## 1. The Official Docs

In Svelte 5, \`$state\` declares a reactive value. When it changes, the DOM updates automatically. Only the parts that depend on that value re-run—fine-grained and efficient.

## 2. Layman's Terms

Think of a **live scoreboard**. When the score changes, the board updates everywhere. \`$state\` is that score: change it, and the UI reflects it without you touching the DOM.

## 3. Hinglish Explanation

*Susta variable vs active variable—socho tumhare paas ek dabba hai. Jab bhi usme kuch change hoga, Svelte automatic sabko bata dega.* Seedha variable jo reactive hai; no \`export let\`, no stores.

## 4. Real-Life Usage

Counters, like buttons, form fields, sidebar open/closed, theme (light/dark).

\`\`\`svelte
<script lang="ts">
  let count = $state(0);
</script>
<button onclick={() => count++}>Clicks: {count}</button>
\`\`\``,
		initialCode: `<script lang="ts">
  let count = $state(0);
</script>
<button onclick={() => count++}>Clicks: {count}</button>`
	},
	{
		id: 'l2',
		module: 1,
		type: 'lesson',
		slug: 'derived-values',
		title: '2. Auto-Calculator ($derived)',
		description: 'Values that update themselves.',
		modelType: 'emperor',
		locked: false,
		markdownContent: `## 1. The Official Docs

\`$derived\` creates a reactive computation: a value that updates when its dependencies change. It is read-only and must stay pure (no side effects).

## 2. Layman's Terms

Like an **Excel formula**. When the cells it references change, the result updates automatically. You don't press "recalculate"—\`$derived\` does it.

## 3. Hinglish Explanation

*Yeh automatic calculator hai. Agar \`price\` change hua, toh \`total\` apne aap update ho jayega. Personal assistant jaisa—no tension.*

## 4. Real-Life Usage

Shopping cart total, filtered lists, formatted strings (e.g. full name from first + last).

\`\`\`svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
<p>Count: {count}, Doubled: {doubled}</p>
\`\`\``,
		initialCode: `<script lang="ts">
  let firstName = $state('Svelte');
  let lastName = $state('Island');
  let fullName = $derived(firstName + ' ' + lastName);
</script>
<input type="text" bind:value={firstName} placeholder="First" />
<input type="text" bind:value={lastName} placeholder="Last" />
<p>Hello, {fullName}!</p>`
	},
	{
		id: 'l3',
		module: 1,
		type: 'lesson',
		slug: 'effect-side-effects',
		title: '3. The Watchman ($effect)',
		description: 'Running code on change.',
		modelType: 'dancing',
		locked: false,
		markdownContent: `## 1. The Official Docs

\`$effect\` runs a callback whenever any reactive value it reads inside changes. Use it for side effects: \`document.title\`, \`localStorage\`, analytics, or API calls.

## 2. Layman's Terms

A **security guard** who reacts when something happens. Door opens → light on. In Svelte: state changes → run this code (e.g. save to server or update the tab title).

## 3. Hinglish Explanation

*Jab door khule toh light jalao. Jab kuch change ho aur tumhe kisi aur ko batana ho (API call, Analytics), tab \`$effect\` use karo. Derived data ke liye \`$derived\`; side effects ke liye \`$effect\`.*

## 4. Real-Life Usage

Syncing \`document.title\`, saving draft to \`localStorage\`, sending analytics, initializing third-party widgets when data changes.

\`\`\`svelte
<script lang="ts">
  let count = $state(0);
  $effect(() => {
    document.title = \`Count: \${count}\`;
  });
</script>
<button onclick={() => count++}>Count: {count}</button>
\`\`\``,
		initialCode: `<script lang="ts">
  let count = $state(0);
  $effect(() => {
    document.title = \`Count: \${count}\`;
  });
</script>
<button onclick={() => count++}>Count: {count}</button>`
	},
	{
		id: 'c1',
		module: 1,
		type: 'checkpoint',
		slug: 'checkpoint-1',
		title: '🏁 Checkpoint: Reactivity',
		description: 'Summary of Module 1. Ready for the test?',
		modelType: 'emperor',
		locked: false,
		markdownContent: `# Hurray! 🎉

You completed Module 1!

**Summary:**
- **$state**: The Boss. Holds the data.
- **$derived**: The Assistant. Calculates from that data.
- **$effect**: The Worker. Does side jobs (logs, alerts, API).

**Next Step:**
Click **"Start Challenge"** to take the **Reactivity Test**. Passing it will unlock Module 2.`
	},

	// --- MODULE 2: The UI Layer (Control Flow) ---
	{
		id: 'l4',
		module: 2,
		type: 'lesson',
		slug: 'control-flow-if',
		title: '4. Logic (#if / #else)',
		description: 'Show or hide based on conditions.',
		modelType: 'black',
		locked: true,
		unlockAfterTest: 'test-1',
		markdownContent: `## 1. The Official Docs

Svelte's \`{#if} ... {:else} ... {/if}\` blocks render content conditionally. Only one branch is in the DOM at a time.

## 2. Layman's Terms

**Traffic police (Roko / Jaane do).** Red light → stop. Green → go. In UI: logged in → show dashboard; else → show login.

## 3. Hinglish Explanation

*Condition ke hisaab se dikhao ya chupao. Jaise "agar user hai toh naam dikhao, warna Login button."*

## 4. Real-Life Usage

Auth (show content vs login form), empty states, error messages, feature flags.

\`\`\`svelte
{#if count > 0}
  <p>Count is positive!</p>
{:else}
  <p>Zero or negative.</p>
{/if}
\`\`\``,
		initialCode: `<script lang="ts">
  let loggedIn = $state(false);
</script>
{#if loggedIn}
  <p>Welcome back!</p>
{:else}
  <button onclick={() => loggedIn = true}>Log in</button>
{/if}`
	},
	{
		id: 'l5',
		module: 2,
		type: 'lesson',
		slug: 'control-flow-each',
		title: '5. Loops (#each)',
		description: 'Rendering lists.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-1',
		markdownContent: `## 1. The Official Docs

\`{#each list as item}\` (or \`as item, i}\`) renders a block for each item. Use a key for dynamic lists so Svelte can track identity.

## 2. Layman's Terms

**Photo album—ek ek karke dikhao.** A list of photos; for each one, show a frame. Same in Svelte: for each item, render a block.

## 3. Hinglish Explanation

*List ko ghumao, har item ke liye ek template. Key dena mat bhoolna jab list change hoti hai (add/remove).*

## 4. Real-Life Usage

Todo list, product grid, table rows, menu items, search results.

\`\`\`svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}
\`\`\``,
		initialCode: `<script lang="ts">
  let items = $state([{ id: 1, name: 'Svelte' }, { id: 2, name: 'Island' }]);
</script>
<ul>
  {#each items as item (item.id)}
    <li>{item.name}</li>
  {/each}
</ul>`
	},
	{
		id: 'l6',
		module: 2,
		type: 'lesson',
		slug: 'events-onclick',
		title: '6. Events (onclick)',
		description: 'Responding to user input.',
		modelType: 'dancing',
		locked: true,
		unlockAfterTest: 'test-1',
		markdownContent: `## 1. The Official Docs

Use \`onclick\`, \`onkeydown\`, \`oninput\`, etc. (or \`on:click\` in legacy). Pass a function or inline handler. Use \`preventDefault\` / \`stopPropagation\` when needed.

## 2. Layman's Terms

**Doorbell—button dabaya toh awaz aayi.** User did something; you run code. Click → increment, type → update state.

## 3. Hinglish Explanation

*User ne kuch kiya—click, type, scroll. Us event pe tumhara function run hota hai. Kabhi event.preventDefault() laga dena form submit rokne ke liye.*

## 4. Real-Life Usage

Buttons, form submit, keyboard shortcuts, drag-and-drop, file input.

\`\`\`svelte
<button onclick={() => count++}>+1</button>
<input oninput={(e) => name = e.currentTarget.value} />
\`\`\``,
		initialCode: `<script lang="ts">
  let count = $state(0);
</script>
<button onclick={() => count++}>Clicked {count} times</button>`
	},
	{
		id: 'c2',
		module: 2,
		type: 'checkpoint',
		slug: 'checkpoint-2',
		title: '🏁 Checkpoint: Control Flow',
		description: 'Summary of Module 2.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-1',
		markdownContent: `# Module 2 done! 🎉

**Summary:**
- **#if / #else**: Show or hide (traffic police).
- **#each**: Lists (photo album).
- **Events**: onclick, oninput—user actions.

**Next:** Click **"Start Challenge"** for the Control Flow test to unlock Module 3.`
	},

	// --- MODULE 3: Components ---
	{
		id: 'l7',
		module: 3,
		type: 'lesson',
		slug: 'components-basics',
		title: '7. Components',
		description: 'Building blocks of the UI.',
		modelType: 'black',
		locked: true,
		unlockAfterTest: 'test-2',
		markdownContent: `## 1. The Official Docs

Components are reusable \`.svelte\` files. They encapsulate markup, style, and logic. Use runes (\`$state\`, \`$props\`) and snippets for composition.

## 2. Layman's Terms

**Lego bricks.** Small pieces you combine to build bigger things. A \`Button\`, \`Card\`, or \`Header\` used everywhere.

## 3. Hinglish Explanation

*Chhote reusable blocks—Lego jaisa. Ek baar banao, kahin bhi use karo. Component = .svelte file.*

## 4. Real-Life Usage

Button, Card, Modal, Navbar, FormField—any repeated UI piece.`,
		initialCode: `<script lang="ts">
  // This is a component. Use it in another file: <Greeting />
</script>
<p>Hello from a component!</p>`
	},
	{
		id: 'l8',
		module: 3,
		type: 'lesson',
		slug: 'props-communication',
		title: '8. Props ($props)',
		description: 'Passing data into components.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-2',
		markdownContent: `## 1. The Official Docs

\`$props()\` declares what a component accepts. Parent passes data in; when it changes, the component updates. Use \`$bindable()\` for two-way binding.

## 2. Layman's Terms

**Parcel / gift passing.** Parent gives a gift (prop) to the child. Child uses it. More gifts (updates) → child sees the new value.

## 3. Hinglish Explanation

*Parent se child ko data bhejna—parcel pass karo. \`$props\` mein destructure karo, use karo. Two-way ke liye \`$bindable()\`.*

## 4. Real-Life Usage

Title, description, image URL for a Card; value + onChange for inputs; variant/size for Button.`,
		initialCode: `<script lang="ts">
  let { name = 'Explorer' } = $props();
</script>
<p>Hello, {name}!</p>`
	},
	{
		id: 'l9',
		module: 3,
		type: 'lesson',
		slug: 'snippets',
		title: '9. Snippets',
		description: 'Reusable template blocks.',
		modelType: 'dancing',
		locked: true,
		unlockAfterTest: 'test-2',
		markdownContent: `## 1. The Official Docs

\`{#snippet name()}\` defines a block that can be passed as \`children\` or named props and rendered with \`{@render ...}\`. Svelte 5's way to compose UI without slots.

## 2. Layman's Terms

**Reusable stamp.** Same design, different content. You pass a "block" into a component; it stamps it where it needs.

## 3. Hinglish Explanation

*Template ka piece jo tum pass karte ho—jaise stamp. Parent snippet bhejta hai, child \`{@render}\` karta hai.*

## 4. Real-Life Usage

Layouts (header + body + footer), wrapper components, list item renderers.`,
		initialCode: `<script lang="ts">
  let { children } = $props();
</script>
<div class="card">
  {@render children?.()}
</div>`
	},
	{
		id: 'c3',
		module: 3,
		type: 'checkpoint',
		slug: 'checkpoint-3',
		title: '🏁 Checkpoint: Components',
		description: 'Summary of Module 3.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-2',
		markdownContent: `# Module 3 done! 🎉

**Summary:**
- **Components**: Lego bricks.
- **$props**: Parcel passing.
- **Snippets**: Reusable stamp with \`{@render}\`.

**Next:** Start Challenge for the Components test → unlock Module 4.`
	},

	// --- MODULE 4: Advanced Reactivity ---
	{
		id: 'l10',
		module: 4,
		type: 'lesson',
		slug: 'universal-reactivity',
		title: '10. Universal Reactivity (.svelte.ts)',
		description: 'Reactive state outside components.',
		modelType: 'black',
		locked: true,
		unlockAfterTest: 'test-3',
		markdownContent: `## 1. The Official Docs

\`.svelte.ts\` files can use runes (\`$state\`, \`$derived\`) and export reactive state. Any component that imports it subscribes to updates. No stores needed.

## 2. Layman's Terms

**Global brain.** One place holds the state; many components read and update it. Like a shared whiteboard.

## 3. Hinglish Explanation

*State ko component ke bahar rakho—.svelte.ts mein. Sab components usko share karte hain. Global brain jaisa.*

## 4. Real-Life Usage

App-wide theme, user session, cart, sidebar open state.`,
		initialCode: `// game.svelte.ts
const state = $state({ count: 0 });
export const game = { get count() { return state.count; }, add() { state.count++; } };`
	},
	{
		id: 'l11',
		module: 4,
		type: 'lesson',
		slug: 'bindable',
		title: '11. Bindings ($bindable)',
		description: 'Two-way binding with props.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-3',
		markdownContent: `## 1. The Official Docs

\`$bindable()\` in \`$props()\` lets the parent bind to a prop. Changes in the child update the parent. Use for inputs, toggles, or any "controlled" value that can be updated from inside.

## 2. Layman's Terms

**Two-way walkie-talkie.** Parent says "value"; child can reply "value changed to X." Both stay in sync.

## 3. Hinglish Explanation

*Parent bind kare, child update kare—dono sync. \`bind:value\` jaisa but via props.*

## 4. Real-Life Usage

Custom Input, Checkbox, Modal open state, editable field.`,
		initialCode: `<script lang="ts">
  let { value = $bindable('') } = $props();
</script>
<input bind:value />`
	},
	{
		id: 'l12',
		module: 4,
		type: 'lesson',
		slug: 'stores-vs-runes',
		title: '12. Stores vs Runes',
		description: 'When to use which.',
		modelType: 'dancing',
		locked: true,
		unlockAfterTest: 'test-3',
		markdownContent: `## 1. The Official Docs

Stores (\`writable\`, \`readable\`) are the Svelte 4 way. Runes (\`$state\`, \`$derived\`) are Svelte 5. Prefer runes in new code; use stores when integrating legacy or non-Svelte code.

## 2. Layman's Terms

**Old Nokia vs iPhone.** Both make calls. One is the new way. Use the new way unless you have an old system to talk to.

## 3. Hinglish Explanation

*Stores purane hain, runes naye. Naye project mein runes use karo; purane code ya library ke saath stores chal sakte hain.*

## 4. Real-Life Usage

New Svelte 5 app → runes. Migrating from Svelte 4 or using a store-based library → stores until you refactor.`,
		initialCode: `// Runes (Svelte 5)
let count = $state(0);
let doubled = $derived(count * 2);`
	},
	{
		id: 'c4',
		module: 4,
		type: 'checkpoint',
		slug: 'checkpoint-4',
		title: '🏁 Checkpoint: Advanced Reactivity',
		description: 'Summary of Module 4.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-3',
		markdownContent: `# Module 4 done! 🎉

**Summary:**
- **.svelte.ts**: Global brain.
- **$bindable**: Two-way walkie-talkie.
- **Stores vs Runes**: Prefer runes in new code.

**Next:** Start Challenge (Test 4) → unlock Module 5.`
	},

	// --- MODULE 5: SvelteKit Basics ---
	{
		id: 'l13',
		module: 5,
		type: 'lesson',
		slug: 'routing',
		title: '13. Routing (+page.svelte)',
		description: 'Pages and URLs.',
		modelType: 'black',
		locked: true,
		unlockAfterTest: 'test-4',
		markdownContent: `## 1. The Official Docs

SvelteKit uses a file-based router. \`src/routes/+page.svelte\` is the home page. \`[slug]/+page.svelte\` is a dynamic route. \`+layout.svelte\` wraps child routes.

## 2. Layman's Terms

**Maps & address.** Each URL is an address; each page file is the building at that address. Change the URL → different page.

## 3. Hinglish Explanation

*URL = address, +page.svelte = woh page. File structure se route banta hai—maps jaisa.*

## 4. Real-Life Usage

Home, /about, /products/[id], /dashboard/settings.`,
		initialCode: `// src/routes/about/+page.svelte
<p>About page. URL: /about</p>`
	},
	{
		id: 'l14',
		module: 5,
		type: 'lesson',
		slug: 'data-loading',
		title: '14. Data Loading (+page.server.ts)',
		description: 'Fetching data for pages.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-4',
		markdownContent: `## 1. The Official Docs

\`+page.server.ts\` exports \`load\` to run on the server. Return data; the page receives it as \`data\`. Use for DB, API keys, or heavy work.

## 2. Layman's Terms

**Waiter bringing food.** You order (navigate); the kitchen (server) prepares and sends the data. The page gets it and renders.

## 3. Hinglish Explanation

*Server pe data lo, page ko de do. \`load\` function return karta hai, +page.svelte mein \`data\` aata hai.*

## 4. Real-Life Usage

User profile, product list, dashboard stats—anything from a database or secret API.`,
		initialCode: `// +page.server.ts
export async function load() {
  return { title: 'From server' };
}
// +page.svelte: const { data } = $props();`
	},
	{
		id: 'l15',
		module: 5,
		type: 'lesson',
		slug: 'forms',
		title: '15. Forms',
		description: 'Handling form submissions.',
		modelType: 'dancing',
		locked: true,
		unlockAfterTest: 'test-4',
		markdownContent: `## 1. The Official Docs

Use \`<form>\` with \`action\` pointing to a server \`formAction\`. Use \`use:enhance\` for progressive enhancement. \`invalid\` and \`result\` for validation and feedback.

## 2. Layman's Terms

**Ordering pizza.** Fill the form, submit; the server gets the order and responds. SvelteKit keeps it simple with actions and \`use:enhance\`.

## 3. Hinglish Explanation

*Form submit karo, server pe \`formAction\` run hota hai. Validation, errors—sab handle karo.*

## 4. Real-Life Usage

Login, signup, contact, checkout, any form that sends data to the server.`,
		initialCode: `<form method="POST" action="?/submit">
  <input name="email" type="email" />
  <button type="submit">Submit</button>
</form>`
	},
	{
		id: 'c5',
		module: 5,
		type: 'checkpoint',
		slug: 'checkpoint-5',
		title: '🏁 Checkpoint: SvelteKit',
		description: 'Summary of Module 5.',
		modelType: 'emperor',
		locked: true,
		unlockAfterTest: 'test-4',
		markdownContent: `# Module 5 done! 🎉

**Summary:**
- **Routing**: Maps & address (+page.svelte).
- **Data loading**: Waiter (+page.server.ts).
- **Forms**: Ordering pizza (actions, use:enhance).

**Next:** Take the **Master Test** to prove you're a Rune Master! 🏆`
	}
];

/** Slug of the first lesson (for "Start Learning", sidebar default link, and fallback). */
export const FIRST_LESSON_SLUG = lessons.find((l) => l.type === 'lesson')?.slug ?? 'reactivity-state';

/** Get a lesson by id or slug. */
export function getLessonByIdOrSlug(idOrSlug: string): Lesson | undefined {
	return lessons.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
}

/** Whether this lesson is unlocked (either not locked, or required test passed). */
export function isLessonUnlocked(
	lesson: Lesson,
	passedTests: string[]
): boolean {
	if (!lesson.locked) return true;
	if (lesson.unlockAfterTest && passedTests.includes(lesson.unlockAfterTest)) return true;
	return false;
}

/** First lesson slug of a module (for next-module navigation). */
export function getFirstLessonSlugOfModule(moduleId: number): string | undefined {
	const lesson = lessons.find((l) => l.module === moduleId && l.type === 'lesson');
	return lesson?.slug;
}

/** Checkpoint lesson slug of a module (redirect here after passing that module's test). */
export function getCheckpointSlugOfModule(moduleId: number): string | undefined {
	const lesson = lessons.find((l) => l.module === moduleId && l.type === 'checkpoint');
	return lesson?.slug;
}
