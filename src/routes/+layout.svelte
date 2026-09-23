<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import Snowfall from '$lib/components/Snowfall.svelte';
	import LoaderOverlay from '$lib/components/LoaderOverlay.svelte';
	import { AUDIO_PATHS } from '$lib/constants/audio';
	import { LOADER_APP_START_DURATION_MS } from '$lib/constants/loader';
	import { game } from '$lib/state/game.svelte';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();
	let audioEl: HTMLAudioElement;

	onMount(() => {
		// Loader already visible from game state default (avoids hard-reload flash)
		const t = setTimeout(() => {
			game.hideLoader();
		}, LOADER_APP_START_DURATION_MS);
		return () => clearTimeout(t);
	});

	beforeNavigate(({ from, to }) => {
		if (from?.url?.pathname === '/dashboard' && to?.url?.pathname?.startsWith('/learn')) {
			game.showLoader('transition');
		}
	});

	afterNavigate(() => {
		if (game.loaderVariant === 'transition') game.hideLoader();
	});

	$effect(() => {
		const mood = game.musicMood;
		const src = AUDIO_PATHS[mood];
		if (audioEl && src) {
			audioEl.src = src;
			if (game.musicPaused) {
				audioEl.pause();
			} else {
				audioEl.play().catch(() => {});
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<!-- Global shell: Snowfall (background), persistent Audio, Toaster, then page content -->
<div class="min-h-screen bg-background text-foreground font-sans">
	<Snowfall />
	<audio
		bind:this={audioEl}
		id="bg-music"
		class="hidden"
		src={AUDIO_PATHS[game.musicMood]}
		loop
		preload="auto"
		aria-hidden="true"
	></audio>
	<Toaster richColors position="top-right" />
	<LoaderOverlay />
	<main class="relative z-10" class:invisible={game.loaderVisible && game.loaderVariant === 'app-start'} aria-hidden={game.loaderVisible && game.loaderVariant === 'app-start'}>
		{@render children()}
	</main>
</div>
