<script lang="ts">
	import { onMount } from 'svelte'

	type Layer = 'root' | 'learn';

	let { layer = 'root' }: { layer?: Layer } = $props();

	let ParticlesComponent = $state<typeof import('@tsparticles/svelte').default | null>(null);
	let particlesInit: typeof import('@tsparticles/svelte').particlesInit;

	const PARTICLE_ALPHA_MAP = '/assets/images/particle_alpha_map_256x256.png';

	const snowOptions = {
		fullScreen: { enable: false },
		particles: {
			number: { value: 90 },
			color: { value: '#ffffff' },
			shape: {
				type: 'image',
				options: {
					image: { src: PARTICLE_ALPHA_MAP }
				}
			},
			opacity: {
				value: { min: 0.8, max: 1 },
				animation: { enable: true, speed: 0.5, minimumValue: 0.3 }
			},
			size: { value: { min: 10, max:15 } },
			move: {
				enable: true,
				direction: 'bottom' as const,
				speed: { min: 1, max: 2.5 },
				straight: false,
				outModes: { default: 'out' as const }
			}
		},
		background: { color: 'transparent' }
	};

	onMount(async () => {
		const mod = await import('@tsparticles/svelte');
		const slim = await import('@tsparticles/slim');
		particlesInit = mod.particlesInit;
		ParticlesComponent = mod.default;
		await particlesInit(async (engine) => {
			await slim.loadSlim(engine);
		});
	});
</script>

{#if ParticlesComponent}
	<div
		class="snowfall-layer pointer-events-none fixed inset-0 h-full w-full {layer === 'learn'
			? 'z-5'
			: 'z-0'}"
	>
		<ParticlesComponent
			id={layer === 'learn' ? 'snowfall-particles-learn' : 'snowfall-particles'}
			options={snowOptions}
			class="h-full w-full"
		/>
	</div>
{/if}
