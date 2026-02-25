<script lang="ts">
	import { getLessonByIdOrSlug } from '$lib/data/lessons';
	import {
		DEFAULT_PENGUIN_PATH,
		getPenguinModelPath,
		getPenguinPosition,
		getPenguinScale,
		TERRAIN_POSITION,
		TERRAIN_SCALE,
		MODEL_PATHS,
		type PenguinModelType
	} from '$lib/constants/scene';
	import { game } from '$lib/state/game.svelte';
	import { Canvas, T } from '@threlte/core';
	import { GLTF as GltfComponent, OrbitControls } from '@threlte/extras';
	import type { ThrelteGltf } from '@threlte/extras';
	import * as THREE from 'three';
	import SceneBackground from './SceneBackground.svelte';
	import AuroraSky from './AuroraSky.svelte';
	import PenguinModel from './PenguinModel.svelte';

	const currentSlug = $derived(game.currentLessonSlug);
	const lesson = $derived(currentSlug ? getLessonByIdOrSlug(currentSlug) : null);
	const modelType = $derived((lesson?.modelType as PenguinModelType) ?? 'black');
	const penguinUrl = $derived(
		lesson ? getPenguinModelPath(lesson.modelType as PenguinModelType) : DEFAULT_PENGUIN_PATH
	);
	const penguinPosition = $derived(getPenguinPosition(modelType));
	const penguinScale = $derived(getPenguinScale(modelType));
	const playPenguinAnimation = $derived(
		(modelType === 'emperor' || modelType === 'dancing') && game.penguinAnimationOn
	);

	function onTerrainLoad(gltf: ThrelteGltf) {
		if (!gltf.scene) return;
		gltf.scene.traverse((obj) => {
			if (!(obj instanceof THREE.Mesh) || !obj.material) return;
			const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
			if (!(mat instanceof THREE.MeshStandardMaterial)) return;
			mat.color = mat.color.clone();
			mat.color.setHex(0xe0e8f0);
			mat.emissive?.setHex(0x202830);
		});
	}
</script>

<div class="absolute inset-0 z-0">
<Canvas>
	<SceneBackground />
	<AuroraSky />
	<T.PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50}>
		<OrbitControls
			maxPolarAngle={Math.PI / 2}
			enablePan={true}
			enableZoom={true}
			minDistance={4}
			maxDistance={16}
		/>
	</T.PerspectiveCamera>
	<T.DirectionalLight
		position={[5, 8, 5]}
		intensity={1.2}
		castShadow
		shadow-mapSize-width={1024}
		shadow-mapSize-height={1024}
	/>
	<T.AmbientLight intensity={0.5} />

	<!-- Terrain: below penguin (mountain in background); snow tint for visibility -->
	<GltfComponent
		url={MODEL_PATHS.terrain}
		position={TERRAIN_POSITION}
		scale={TERRAIN_SCALE}
		onload={onTerrainLoad}
	/>
	<!-- Penguin: black (pudgy) or animated emperor/dancing; animation runs inside Canvas via PenguinModel -->
	{#key penguinUrl}
		<PenguinModel
			url={penguinUrl}
			position={penguinPosition}
			scale={penguinScale}
			playAnimation={playPenguinAnimation}
		/>
	{/key}
</Canvas>
</div>
