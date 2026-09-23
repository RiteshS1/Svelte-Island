<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import loader from '@monaco-editor/loader';

	type Props = {
		/** Controlled source text — parent owns the content (do not use $bindable here). */
		value?: string;
		readOnly?: boolean;
		language?: string;
		class?: string;
		height?: string;
		/** When editable, called after the user edits the buffer */
		onValueChange?: (value: string) => void;
	};

	let {
		value = '',
		readOnly = false,
		language = 'svelte',
		class: className = '',
		height = 'min-h-64',
		onValueChange
	}: Props = $props();

	let container: HTMLDivElement;
	let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null;
	let monaco: typeof import('monaco-editor') | null = null;
	/** Skip echoing editor→parent while we push a new parent value into Monaco */
	let applyingExternalValue = false;

	onMount(async () => {
		const monacoInstance = await loader.init();
		monaco = monacoInstance;
		if (!container) return;

		editor = monacoInstance.editor.create(container, {
			value: value ?? '',
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

		const ed = editor;
		if (!readOnly && ed) {
			ed.onDidChangeModelContent(() => {
				if (applyingExternalValue) return;
				const v = ed.getValue() ?? '';
				onValueChange?.(v);
			});
		}
	});

	/** Keep Monaco buffer in sync when the parent lesson/snippet changes */
	$effect(() => {
		const next = value ?? '';
		const ed = editor;
		if (!ed) return;
		if (ed.getValue() === next) return;
		applyingExternalValue = true;
		ed.setValue(next);
		applyingExternalValue = false;
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
