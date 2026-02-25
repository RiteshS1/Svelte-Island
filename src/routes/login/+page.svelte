<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { game } from '$lib/state/game.svelte'
	import { gsap } from 'gsap'
	import { onMount } from 'svelte'

	let explorerName = $state('');
	let activeTab = $state<'login' | 'signup'>('login');
	let logoEl: HTMLElement;
	let formPanel: HTMLElement;

	onMount(() => {
		if (logoEl) {
			gsap.to(logoEl, {
				y: -8,
				duration: 2,
				ease: 'sine.inOut',
				repeat: -1,
				yoyo: true
			});
		}
		gsap.from(formPanel, {
			x: 40,
			opacity: 0,
			duration: 0.7,
			ease: 'power2.out',
			delay: 0.2
		});
	});

	function handleSubmit() {
		const name = explorerName.trim() || 'Explorer';
		game.login(name);
	}
</script>

<svelte:head>
	<title>Enter the Island — Svelte-Island</title>
</svelte:head>

<div class="flex min-h-screen">
	<!-- Left: Aurora Night gradient + floating logo -->
	<div
		class="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-teal-400 px-8 py-12"
	>
		<div
			bind:this={logoEl}
			class="text-center font-bold text-white/95 drop-shadow-lg"
			style="font-family: 'Quicksand', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem);"
		>
			Svelte-Island
		</div>
		<p class="mt-4 text-sm text-white/70">Your expedition awaits.</p>
	</div>

	<!-- Right: White form panel -->
	<div
		bind:this={formPanel}
		class="flex w-full flex-col justify-center bg-white px-8 py-12 shadow-xl md:w-[420px] md:min-w-[420px]"
	>
		<h2 class="text-2xl font-bold text-slate-800" style="font-family: 'Quicksand', sans-serif;">
			Enter the Island
		</h2>

		<!-- Tabs: Login / Signup -->
		<div class="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1">
			<button
				type="button"
				class="flex-1 rounded-md py-2 text-sm font-medium transition-colors {activeTab === 'login'
					? 'bg-white text-slate-800 shadow-sm'
					: 'text-slate-600 hover:text-slate-800'}"
				onclick={() => (activeTab = 'login')}
			>
				Login
			</button>
			<button
				type="button"
				class="flex-1 rounded-md py-2 text-sm font-medium transition-colors {activeTab === 'signup'
					? 'bg-white text-slate-800 shadow-sm'
					: 'text-slate-600 hover:text-slate-800'}"
				onclick={() => (activeTab = 'signup')}
			>
				Signup
			</button>
		</div>

		<form
			class="mt-6 flex flex-col gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			<div>
				<label for="explorer-name" class="block text-sm font-medium text-slate-700">
					Explorer Name
				</label>
				<input
					id="explorer-name"
					type="text"
					bind:value={explorerName}
					placeholder="Your name"
					class="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
				/>
			</div>
			<Button
				type="submit"
				class="mt-2 w-full bg-[#ff3e00] py-6 text-base font-semibold text-white hover:bg-[#ff3e00]/90"
			>
				Enter the Island
			</Button>
		</form>

		<p class="mt-6 text-center text-xs text-slate-500">
			Mock auth — no backend. You’ll be redirected to the dashboard.
		</p>
	</div>
</div>
