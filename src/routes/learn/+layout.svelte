<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import LearnSidebar from '$lib/components/layout/LearnSidebar.svelte';
	import Snowfall from '$lib/components/Snowfall.svelte';

	let { children } = $props();
	let ClassroomScene = $state<typeof import('$lib/components/3d/ClassroomScene.svelte').default | null>(null);
	let show3D = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(min-width: 768px)');
		show3D = mq.matches;
		const handler = () => {
			show3D = mq.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || !show3D || ClassroomScene) return;
		import('$lib/components/3d/ClassroomScene.svelte').then((m) => {
			ClassroomScene = m.default;
		});
	});
</script>

<svelte:head>
	<title>Learn — Svelte-Island</title>
</svelte:head>

<!-- Persistent full-screen container; 3D only on desktop (768px+) -->
<div class="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-white">
	<!-- Layer 0: 3D canvas only when not mobile -->
	{#if browser && show3D && ClassroomScene}
		<svelte:component this={ClassroomScene} />
	{/if}

	<!-- Layer 1: Sidebar (z-20) -->
	<LearnSidebar />

	<!-- Snow over classroom (above canvas, below UI) -->
	{#if browser}
		<Snowfall layer="learn" />
	{/if}

	<!-- Layer 2: Content slot; wrapper is pointer-events-none so slot content can use pointer-events-auto -->
	<div class="absolute inset-0 pointer-events-none z-10">
		{@render children()}
	</div>
</div>
