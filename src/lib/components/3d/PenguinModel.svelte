<script lang="ts">
	import { GLTF as GltfComponent, useGltfAnimations } from '@threlte/extras';
	import type { ThrelteGltf } from '@threlte/extras';
	import { writable } from 'svelte/store';

	let { url, position, scale, playAnimation = false } = $props<{
		url: string;
		position: [number, number, number];
		scale: [number, number, number];
		playAnimation?: boolean;
	}>();

	let gltf = $state<ThrelteGltf | undefined>(undefined);
	const gltfStore = writable<ThrelteGltf | undefined>(undefined);
	$effect(() => {
		gltfStore.set(gltf);
	});

	const { actions } = useGltfAnimations(gltfStore);

	$effect(() => {
		const act = $actions as Record<string, { play: () => void; stop: () => void }> | undefined;
		if (!act || Object.keys(act).length === 0) return;
		if (playAnimation) {
			Object.values(act).forEach((a) => a.stop());
			Object.values(act)[0].play();
		} else {
			Object.values(act).forEach((a) => a.stop());
			const idle = act['Idle'] ?? act['idle'];
			if (idle) idle.play();
		}
	});
</script>

<GltfComponent
	{url}
	bind:gltf={gltf}
	{position}
	{scale}
/>
