<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import loader from '@monaco-editor/loader';

	type Props = {
		value?: string;
		readOnly?: boolean;
		language?: string;
		class?: string;
		height?: string;
		/** When editable, use bind:value or this callback */
		onValueChange?: (value: string) => void;
	};

	let {
		value = $bindable(''),
		readOnly = false,
		language = 'svelte',
		class: className = '',
		height = 'min-h-64',
		onValueChange
	}: Props = $props();

	let container: HTMLDivElement;
	let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;
	let monaco: typeof import('monaco-editor') | null = null;

	onMount(async () => {
		const monacoInstance = await loader.init();
		monaco = monacoInstance;
		if (!container) return;

		editor = monacoInstance.editor.create(container, {
			value,
			language: language === 'svelte' ? 'html' : language,
			readOnly,
			theme: 'vs-dark',
			automaticLayout: true,
			minimap: { enabled: false },
			fontSize: 14,
			fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
			fontLigatures: true,
			roundedSelection: true,
			scrollBeyondLastLine: false,
			padding: { top: 12 }
		});

		if (!readOnly && (onValueChange || true)) {
			editor.onDidChangeModelContent(() => {
				const v = editor?.getValue() ?? '';
				value = v;
				onValueChange?.(v);
			});
		}
	});

	$effect(() => {
		if (!editor || editor.getValue() === value) return;
		editor.setValue(value);
	});

	$effect(() => {
		if (!editor) return;
		editor.updateOptions({ readOnly });
	});

	$effect(() => {
		if (!editor || !monaco) return;
		const model = editor.getModel();
		if (model) monaco.editor.setModelLanguage(model, language === 'svelte' ? 'html' : language);
	});

	onDestroy(() => {
		editor?.dispose();
		editor = null;
	});
</script>

<div
	class="overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-lg {height} {className}"
	style="font-family: 'Fira Code', 'JetBrains Mono', monospace;"
>
	<div bind:this={container} class="h-full w-full min-h-48"></div>
</div>
