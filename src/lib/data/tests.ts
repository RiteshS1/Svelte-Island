/**
 * Svelte-Island tests: 5 Module Tests + 1 Master Test.
 * Passing a test unlocks the next module.
 */

export interface Question {
	id: string;
	text: string;
	type: 'mcq' | 'code' | 'fill';
	options?: string[];
	correctAnswer?: number;
	starterCode?: string;
	solutionCode?: string;
	/** For type 'fill': the exact answer for the blank (trimmed, case-insensitive match). */
	blankAnswer?: string;
	explanation: string;
}

export interface Test {
	id: string;
	moduleId: number;
	title: string;
	questions: Question[];
}

export const tests: Test[] = [
	{
		id: 'test-1',
		moduleId: 1,
		title: 'Reactivity Rune Test',
		questions: [
			{
				id: 'q1',
				text: 'Which rune is used to create reactive state?',
				type: 'mcq',
				options: ['$react', '$state', '$live', 'let'],
				correctAnswer: 1,
				explanation: '$state is the primitive for reactive state in Svelte 5.'
			},
			{
				id: 'q2',
				text: 'What does $derived do?',
				type: 'mcq',
				options: [
					'Updates the DOM manually',
					'Creates a value that auto-updates when dependencies change',
					'Runs side effects',
					'Passes props to children'
				],
				correctAnswer: 1,
				explanation: '$derived creates a reactive computation—read-only and pure.'
			},
			{
				id: 'q3',
				text: 'When should you use $effect?',
				type: 'mcq',
				options: [
					'To compute a new value from state',
					'To run code when state changes (e.g. document.title, localStorage)',
					'To declare props',
					'To bind two-way data'
				],
				correctAnswer: 1,
				explanation: '$effect is for side effects; use $derived for computed values.'
			},
			{
				id: 'q4',
				text: 'Which is true about $derived?',
				type: 'mcq',
				options: [
					'You can assign to it',
					'It can contain side effects like console.log',
					'It must be pure and read-only',
					'It runs only once on mount'
				],
				correctAnswer: 2,
				explanation: '$derived must stay pure—no assignments, no side effects.'
			},
			{
				id: 'fill-1',
				text: 'To create reactive state in Svelte 5, use the ______ rune.',
				type: 'fill',
				blankAnswer: '$state',
				explanation: 'The $state rune is the primitive for reactive state in Svelte 5.'
			}
		]
	},
	{
		id: 'test-2',
		moduleId: 2,
		title: 'Control Flow Test',
		questions: [
			{
				id: 'q1',
				text: 'How do you conditionally render in Svelte 5?',
				type: 'mcq',
				options: ['{#if} ... {/if}', 'v-if', '*ngIf', '{condition && <div>}'],
				correctAnswer: 0,
				explanation: 'Svelte uses {#if} ... {:else} ... {/if} for conditionals.'
			},
			{
				id: 'q2',
				text: 'Why use a key in {#each}?',
				type: 'mcq',
				options: [
					'To style the list',
					'So Svelte can track list items when the list changes (add/remove/reorder)',
					'To sort the list',
					'Keys are optional and not recommended'
				],
				correctAnswer: 1,
				explanation: 'A key helps Svelte identify each item for efficient DOM updates.'
			},
			{
				id: 'q3',
				text: 'What is the correct event handler syntax in Svelte 5?',
				type: 'mcq',
				options: ['on:click', 'onclick', 'v-on:click', '@click'],
				correctAnswer: 1,
				explanation: 'Svelte 5 uses lowercase onclick, oninput, etc.'
			},
			{
				id: 'q4',
				text: 'How do you get the index in an {#each} block?',
				type: 'mcq',
				options: [
					'{#each list as item, index}',
					'{#each list as item; i}',
					'{#each list as (item, i)}',
					'Use a separate counter'
				],
				correctAnswer: 2,
				explanation: 'Syntax is {#each list as item, i} or {#each list as item (item.id)}.'
			},
			{
				id: 'code-2',
				text: 'Render a list of names from an array using {#each}.',
				type: 'code',
				starterCode: `<script lang="ts">
  let names = $state(['Svelte', 'Island']);
</script>
<ul><!-- your each here --></ul>`,
				solutionCode: '#each',
				explanation: 'Use {#each names as name}<li>{name}</li>{/each}.'
			}
		]
	},
	{
		id: 'test-3',
		moduleId: 3,
		title: 'Components Test',
		questions: [
			{
				id: 'q1',
				text: 'How do you declare props in Svelte 5?',
				type: 'mcq',
				options: ['export let x', '$props()', 'props: { x }', 'defineProps()'],
				correctAnswer: 1,
				explanation: 'Svelte 5 uses $props() for declaring component props.'
			},
			{
				id: 'q2',
				text: 'What is a snippet used for?',
				type: 'mcq',
				options: [
					'State management',
					'Reusable template blocks passed into components and rendered with {@render}',
					'Routing',
					'HTTP requests'
				],
				correctAnswer: 1,
				explanation: 'Snippets are reusable blocks; parent passes them, child renders with {@render}.'
			},
			{
				id: 'q3',
				text: 'How do you pass a snippet to a component?',
				type: 'mcq',
				options: [
					'As a string',
					'As children or a named prop—e.g. <Comp>{#snippet child()}...{/snippet}</Comp>',
					'Via $state',
					'Snippets cannot be passed'
				],
				correctAnswer: 1,
				explanation: 'You pass a snippet as children or a named prop and render it with {@render}.'
			},
			{
				id: 'q4',
				text: 'What is the file extension for a Svelte component?',
				type: 'mcq',
				options: ['.svelte', '.vue', '.jsx', '.html'],
				correctAnswer: 0,
				explanation: 'Svelte components use the .svelte extension.'
			},
			{
				id: 'code-3',
				text: 'Accept a prop "name" with default "Explorer" and render it.',
				type: 'code',
				starterCode: `<script lang="ts">
  // declare name prop with default
</script>
<p>Hello, ???</p>`,
				solutionCode: '$props()',
				explanation: 'let { name = \'Explorer\' } = $props(); then use {name} in the template.'
			}
		]
	},
	{
		id: 'test-4',
		moduleId: 4,
		title: 'Advanced Reactivity Test',
		questions: [
			{
				id: 'q1',
				text: 'Where can you use $state and $derived outside a .svelte file?',
				type: 'mcq',
				options: ['.ts only', '.svelte.ts files', 'Anywhere in JavaScript', 'Nowhere'],
				correctAnswer: 1,
				explanation: '.svelte.ts files support runes and export reactive state.'
			},
			{
				id: 'q2',
				text: 'What does $bindable() do?',
				type: 'mcq',
				options: [
					'Binds to a store',
					'Allows a prop to be two-way bound from the parent',
					'Binds to localStorage',
					'Creates a derived value'
				],
				correctAnswer: 1,
				explanation: '$bindable() lets the parent use bind:prop so the child can update it.'
			},
			{
				id: 'q3',
				text: 'In new Svelte 5 code, you should prefer:',
				type: 'mcq',
				options: ['Stores', 'Runes ($state, $derived)', 'Both equally', 'Neither'],
				correctAnswer: 1,
				explanation: 'Runes are the Svelte 5 way; prefer them over stores in new code.'
			},
			{
				id: 'q4',
				text: 'Which rune runs code when dependencies change (side effects)?',
				type: 'mcq',
				options: ['$derived', '$effect', '$state', '$props'],
				correctAnswer: 1,
				explanation: '$effect is for side effects; $derived is for computed values.'
			},
			{
				id: 'code-4',
				text: 'Create a $derived value "total" that doubles "count".',
				type: 'code',
				starterCode: `<script lang="ts">
  let count = $state(5);
  // let total = ???
</script>
<p>{count} * 2 = {total}</p>`,
				solutionCode: '$derived(count * 2)',
				explanation: 'let total = $derived(count * 2);'
			}
		]
	},
	{
		id: 'test-5',
		moduleId: 5,
		title: 'SvelteKit Basics Test',
		questions: [
			{
				id: 'q1',
				text: 'Which file is the home page in SvelteKit?',
				type: 'mcq',
				options: ['index.svelte', '+page.svelte in routes', 'App.svelte', 'home.svelte'],
				correctAnswer: 1,
				explanation: 'src/routes/+page.svelte is the root page (home).'
			},
			{
				id: 'q2',
				text: 'Where do you load server-only data for a page?',
				type: 'mcq',
				options: ['+page.svelte', '+page.server.ts load function', '+layout.svelte', 'vite.config'],
				correctAnswer: 1,
				explanation: '+page.server.ts export load runs on the server and returns data.'
			},
			{
				id: 'q3',
				text: 'What does use:enhance do on a form?',
				type: 'mcq',
				options: [
					'Nothing',
					'Progressive enhancement: submit via fetch, update UI without full reload',
					'Disables the form',
					'Validates input'
				],
				correctAnswer: 1,
				explanation: 'use:enhance keeps form submission in SvelteKit without a full page reload.'
			},
			{
				id: 'q4',
				text: 'A dynamic route like [id] is defined by:',
				type: 'mcq',
				options: [
					'A config file',
					'A folder named [id] under routes',
					'[id].svelte',
					'Only in +page.server.ts'
				],
				correctAnswer: 1,
				explanation: 'File-based routing: src/routes/[id]/+page.svelte gives you a dynamic segment.'
			},
			{
				id: 'code-5',
				text: 'In +page.server.ts, return an object with key "message" and value "Hello".',
				type: 'code',
				starterCode: `export async function load() {
  return { };
}`,
				solutionCode: 'message: \'Hello\'',
				explanation: 'return { message: \'Hello\' }; the page receives it as data.message.'
			}
		]
	},
	{
		id: 'test-master',
		moduleId: 0,
		title: 'Master Rune Test',
		questions: [
			{
				id: 'm1',
				text: 'Which rune creates reactive state?',
				type: 'mcq',
				options: ['$react', '$state', '$live', 'let'],
				correctAnswer: 1,
				explanation: '$state.'
			},
			{
				id: 'm2',
				text: 'Which rune is for computed values?',
				type: 'mcq',
				options: ['$state', '$effect', '$derived', '$props'],
				correctAnswer: 2,
				explanation: '$derived.'
			},
			{
				id: 'm3',
				text: 'Which rune is for side effects?',
				type: 'mcq',
				options: ['$derived', '$effect', '$state', '$props'],
				correctAnswer: 1,
				explanation: '$effect.'
			},
			{
				id: 'm4',
				text: 'How do you declare props in Svelte 5?',
				type: 'mcq',
				options: ['export let', '$props()', 'defineProps', 'props: {}'],
				correctAnswer: 1,
				explanation: '$props().'
			},
			{
				id: 'm5',
				text: 'Conditional rendering uses:',
				type: 'mcq',
				options: ['{#if}', 'v-if', '*ngIf', '&&'],
				correctAnswer: 0,
				explanation: '{#if} ... {/if}.'
			},
			{
				id: 'm6',
				text: 'List rendering uses:',
				type: 'mcq',
				options: ['{#each}', 'v-for', 'map() only', '.forEach'],
				correctAnswer: 0,
				explanation: '{#each}.'
			},
			{
				id: 'm7',
				text: 'Event handler in Svelte 5:',
				type: 'mcq',
				options: ['on:click', 'onclick', '@click', 'v-on:click'],
				correctAnswer: 1,
				explanation: 'onclick (lowercase).'
			},
			{
				id: 'm8',
				text: 'Reusable template block in Svelte 5:',
				type: 'mcq',
				options: ['#snippet', 'slot', 'template', 'component'],
				correctAnswer: 0,
				explanation: '{#snippet name()} ... {/snippet} and {@render}.'
			},
			{
				id: 'm9',
				text: 'Two-way binding prop uses:',
				type: 'mcq',
				options: ['$state', '$bindable', '$effect', 'bind:'],
				correctAnswer: 1,
				explanation: '$bindable() in $props().'
			},
			{
				id: 'm10',
				text: 'Reactive state outside .svelte can live in:',
				type: 'mcq',
				options: ['.ts', '.svelte.ts', '.js', 'Any file'],
				correctAnswer: 1,
				explanation: '.svelte.ts files support runes.'
			},
			{
				id: 'm11',
				text: 'SvelteKit home page file:',
				type: 'mcq',
				options: ['+page.svelte in routes', 'index.html', 'App.svelte', 'main.svelte'],
				correctAnswer: 0,
				explanation: 'src/routes/+page.svelte.'
			},
			{
				id: 'm12',
				text: 'Server-side data loading in SvelteKit:',
				type: 'mcq',
				options: ['+page.svelte', '+page.server.ts load', '+layout.svelte', 'api/'],
				correctAnswer: 1,
				explanation: '+page.server.ts export load.'
			},
			{
				id: 'm13',
				text: 'Dynamic route segment folder name:',
				type: 'mcq',
				options: ['[id]', '(id)', '{id}', '*id'],
				correctAnswer: 0,
				explanation: '[id] or [slug] etc.'
			},
			{
				id: 'm14',
				text: 'Form progressive enhancement:',
				type: 'mcq',
				options: ['use:enhance', 'use:submit', 'action only', 'fetch only'],
				correctAnswer: 0,
				explanation: 'use:enhance on the form.'
			},
			{
				id: 'm15',
				text: 'Prefer in new Svelte 5 code:',
				type: 'mcq',
				options: ['Stores', 'Runes', 'Both', 'Neither'],
				correctAnswer: 1,
				explanation: 'Runes ($state, $derived, $effect, $props).'
			},
			{
				id: 'mc1',
				text: 'Write a counter with $state that increments on button click.',
				type: 'code',
				starterCode: `<script lang="ts">
  let count = 0;
</script>
<button>Count: {count}</button>`,
				solutionCode: '$state(0)',
				explanation: 'Use $state(0) and onclick handler.'
			},
			{
				id: 'mc2',
				text: 'Create doubled = $derived(count * 2).',
				type: 'code',
				starterCode: `<script lang="ts">
  let count = $state(1);
  // let doubled = ???
</script>`,
				solutionCode: '$derived(count * 2)',
				explanation: 'let doubled = $derived(count * 2);'
			},
			{
				id: 'mc3',
				text: 'Accept prop "title" with $props and render it.',
				type: 'code',
				starterCode: `<script lang="ts">
  // your props
</script>
<h1>???</h1>`,
				solutionCode: '$props()',
				explanation: 'let { title } = $props(); then {title} in h1.'
			},
			{
				id: 'mc4',
				text: 'Use {#if count > 0} to show "Positive" else "Zero or negative".',
				type: 'code',
				starterCode: `<script lang="ts">let count = $state(0);</script>
<!-- your if block -->`,
				solutionCode: '#if',
				explanation: '{#if count > 0}Positive{:else}Zero or negative{/if}.'
			},
			{
				id: 'mc5',
				text: 'In +page.server.ts load, return { user: "Explorer" }.',
				type: 'code',
				starterCode: `export async function load() {
  return { };
}`,
				solutionCode: 'user: \'Explorer\'',
				explanation: 'return { user: \'Explorer\' };'
			}
		]
	}
];

/** Get a test by id. */
export function getTestById(id: string): Test | undefined {
	return tests.find((t) => t.id === id);
}

/** Get the test for a module (test-1 for module 1, etc.). */
export function getTestForModule(moduleId: number): Test | undefined {
	return tests.find((t) => t.moduleId === moduleId && t.id !== 'test-master');
}
