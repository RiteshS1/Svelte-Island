<script lang="ts">
	import { useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { getSkyColor } from '$lib/constants/scene';
	import { game } from '$lib/state/game.svelte';

	const { scene } = useThrelte();
	$effect(() => {
		if (scene) scene.background = new THREE.Color(getSkyColor(game.skyPhase));
	});
</script>
