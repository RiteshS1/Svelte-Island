<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Button } from '$lib/components/ui/button';
	import { BookOpen, Code2, Trophy, Github, Twitter } from 'lucide-svelte';

	gsap.registerPlugin(ScrollTrigger);

	let heroHeading: HTMLElement;
	let heroSub: HTMLElement;
	let codeBlock: HTMLElement;
	let ctaBtn: HTMLElement;
	let trustedTicker: HTMLElement;
	let howCard1: HTMLElement;
	let howCard2: HTMLElement;
	let howCard3: HTMLElement;

	const codeLines = `let count = $state(0);
<button onclick={() => count++}>
  Clicks: {count}
</button>`;
	let displayedCode = $state('');

	const trustedStack = ['Svelte 5', 'Threlte', 'Tailwind', 'Vite', 'TypeScript'];

	onMount(() => {
		gsap.from([heroHeading, heroSub], {
			duration: 0.9,
			y: 40,
			opacity: 0,
			stagger: 0.2,
			ease: 'power3.out'
		});
		gsap.from(codeBlock, {
			duration: 0.8,
			x: 60,
			opacity: 0,
			delay: 0.3,
			ease: 'power2.out'
		});
		gsap.from(ctaBtn, {
			duration: 0.5,
			y: 20,
			opacity: 0,
			delay: 0.6,
			ease: 'power2.out'
		});

		// Trusted Stack: fade in up
		if (trustedTicker) {
			gsap.from(trustedTicker, {
				duration: 0.7,
				y: 24,
				opacity: 0,
				delay: 0.5,
				ease: 'power2.out'
			});
		}

		let i = 0;
		const typeNext = () => {
			if (i <= codeLines.length) {
				displayedCode = codeLines.slice(0, i);
				i++;
				setTimeout(typeNext, i < codeLines.length && codeLines[i - 1] === '\n' ? 120 : 40);
			} else {
				setTimeout(() => {
					i = 0;
					displayedCode = '';
					setTimeout(typeNext, 800);
				}, 2000);
			}
		};
		setTimeout(typeNext, 600);

		[howCard1, howCard2, howCard3].forEach((el, idx) => {
			if (!el) return;
			gsap.from(el, {
				scrollTrigger: {
					trigger: el,
					start: 'top 85%',
					toggleActions: 'play none none none'
				},
				y: 50,
				opacity: 0,
				duration: 0.6,
				delay: idx * 0.1,
				ease: 'power2.out'
			});
		});
	});
</script>

<svelte:head>
	<title>Svelte-Island — Learn Svelte 5 the Cool Way</title>
</svelte:head>

<div
	class="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-sky-300 via-sky-100 to-white"
	style="font-family: 'Quicksand', sans-serif;"
>
	<!-- Hero -->
	<section
		class="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center px-6 pt-20 md:flex-row md:items-center md:gap-12"
	>
		<div class="flex flex-1 flex-col text-center md:text-left">
			<h1
				bind:this={heroHeading}
				class="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl md:text-6xl lg:text-7xl"
			>
				Learn Svelte 5.<br />The Cool Way.
			</h1>
			<p bind:this={heroSub} class="mt-4 text-lg text-slate-600 md:text-xl">
				Runes, islands, and a penguin teacher. Gamified lessons on the frosty side of the web.
			</p>
			<div bind:this={ctaBtn} class="mt-8">
				<a href="/login">
					<Button
						class="rounded-xl bg-[#ff3e00] px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-orange-200 hover:bg-[#ff3e00]/90"
					>
						Start Expedition
					</Button>
				</a>
			</div>
		</div>
		<div
			bind:this={codeBlock}
			class="mt-12 w-full max-w-md shrink-0 md:mt-0 md:max-w-lg rounded-2xl border border-white/50 bg-white/40 p-6 font-mono text-sm text-slate-800 shadow-lg shadow-sky-100/20 backdrop-blur-xl"
		>
			<div class="mb-2 flex gap-2">
				<span class="h-3 w-3 rounded-full bg-red-400/80"></span>
				<span class="h-3 w-3 rounded-full bg-amber-400/80"></span>
				<span class="h-3 w-3 rounded-full bg-emerald-400/80"></span>
			</div>
			<pre class="whitespace-pre text-left overflow-x-auto"><code>{displayedCode}<span class="animate-pulse">|</span></code></pre>
		</div>
	</section>

	<!-- Trusted Stack Ticker -->
	<section class="relative border-t border-white/30 bg-white/20 py-8">
		<div
			bind:this={trustedTicker}
			class="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6"
		>
			{#each trustedStack as name}
				<span
					class="text-lg font-medium text-slate-600 opacity-60 grayscale select-none"
					style="font-family: 'Quicksand', sans-serif;"
				>
					{name}
				</span>
			{/each}
		</div>
	</section>

	<!-- How it Works (Bento) -->
	<section class="relative mx-auto max-w-6xl px-6 py-24">
		<h2
			class="mb-12 text-center text-3xl font-bold text-slate-800"
			style="font-family: 'Quicksand', sans-serif;"
		>
			How Svelte-Island Works
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<div
				bind:this={howCard1}
				class="rounded-xl border border-white/20 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
			>
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-blue-500/20 p-2">
						<BookOpen class="h-6 w-6 text-blue-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-800">1. Learn Concepts</h3>
				</div>
				<p class="mt-3 text-slate-600">
					Bite-sized theory on Runes & Reactivity.
				</p>
			</div>
			<div
				bind:this={howCard2}
				class="rounded-xl border border-white/20 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
			>
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-orange-500/20 p-2">
						<Code2 class="h-6 w-6 text-orange-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-800">2. Interactive Lab</h3>
				</div>
				<p class="mt-3 text-slate-600">
					Write real code in the browser with Monaco.
				</p>
			</div>
			<div
				bind:this={howCard3}
				class="rounded-xl border border-white/20 bg-white/40 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
			>
				<div class="flex items-center gap-3">
					<div class="rounded-lg bg-amber-500/20 p-2">
						<Trophy class="h-6 w-6 text-amber-600" />
					</div>
					<h3 class="text-xl font-bold text-slate-800">3. Earn XP</h3>
				</div>
				<p class="mt-3 text-slate-600">
					Unlock badges and levels as you master Svelte.
				</p>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="relative border-t border-slate-700/50 bg-slate-900 py-12 text-slate-300">
		<div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
			<div class="flex flex-col items-center gap-1 md:items-start">
				<span
					class="text-lg font-bold text-white"
					style="font-family: 'Quicksand', sans-serif;"
				>
					Svelte-Island
				</span>
				<span class="text-sm">Made with ❤️ by Ritesh Sharma</span>
			</div>
			<div class="flex items-center gap-6">
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-slate-400 transition-colors hover:text-white"
					aria-label="GitHub"
				>
					<Github class="h-5 w-5" />
				</a>
				<a
					href="https://twitter.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-slate-400 transition-colors hover:text-white"
					aria-label="Twitter / X"
				>
					<Twitter class="h-5 w-5" />
				</a>
			</div>
		</div>
	</footer>
</div>
