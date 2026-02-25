<script lang="ts">
	import { fly } from 'svelte/transition';
	import { game } from '$lib/state/game.svelte';
	import { LOADER_IMAGES, LOADER_MESSAGE } from '$lib/constants/loader';

	const imageSrc = $derived(
		game.loaderImageSrc ?? LOADER_IMAGES[game.loaderVariant]
	);
</script>

{#if game.loaderVisible}
	<div
		class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/70 backdrop-blur-sm"
		transition:fly={{ y: 20, duration: 300 }}
	>
		<div
			class="flex flex-col items-center justify-center gap-6 rounded-2xl p-8 text-center"
			transition:fly={{ y: 10, duration: 400, delay: 100 }}
		>
			<img
				src={imageSrc}
				alt="Loading"
				class="h-24 w-auto object-contain drop-shadow-2xl animate-pulse sm:h-32"
			/>
			<p class="text-sm font-medium text-white/90 sm:text-base" style="font-family: 'Quicksand', sans-serif;">
				{LOADER_MESSAGE}
			</p>
		</div>
	</div>
{/if}
