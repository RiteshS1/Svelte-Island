<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Button } from '$lib/components/ui/button';
	import { BookOpen, Code2, Trophy, Github, Twitter, Globe } from 'lucide-svelte';

	gsap.registerPlugin(ScrollTrigger);

	let heroHeading: HTMLElement;
	let heroSub: HTMLElement;
	let codeBlock: HTMLElement;
	let ctaBtn: HTMLElement;
	let trustedTicker: HTMLElement;
	let howCard1: HTMLElement;
	let howCard2: HTMLElement;
	let howCard3: HTMLElement;
	let whySection: HTMLElement;
	let faqSection: HTMLElement;
	let recSection: HTMLElement;

	const codeLines = `let count = $state(0);
<button onclick={() => count++}>
  Clicks: {count}
</button>`;
	let displayedCode = $state('');

	const trustedStack = ['Svelte 5', 'Threlte', 'Tailwind', 'Vite', 'TypeScript'];

	const whyPoints = [
		{
			title: 'Compiler-first',
			body: 'Svelte ships less JavaScript by compiling away the framework. Your app stays fast without a virtual DOM tax.'
		},
		{
			title: 'Runes reactivity',
			body: '$state, $derived, and $effect make reactivity explicit and fine-grained—easier to reason about than magic stores.'
		},
		{
			title: 'Less boilerplate',
			body: 'Components look like HTML with a little script. You write less ceremony and more product.'
		}
	];

	const faqs = [
		{
			q: 'Is Svelte-Island free?',
			a: 'Yes. It is an open learning playground—no paywall, no account server. Progress stays in your browser.'
		},
		{
			q: 'Do I need React experience?',
			a: 'No. If you know HTML, CSS, and a bit of JavaScript, you can start. React knowledge helps but is not required.'
		},
		{
			q: 'Is auth real?',
			a: 'No—login is mock. You pick a display name; session and quiz progress are saved in localStorage only.'
		},
		{
			q: 'What is a Rune?',
			a: 'Runes are Svelte 5’s reactivity primitives ($state, $derived, $effect, $props). They replace much of the old store and export-let patterns.'
		}
	];

	const recommendations = [
		{
			quote:
				"The *real* touted advantage of Svelte's direct-to-JS compilation shouldn't be 'it's faster', but instead should be this glorious advantage: In Svelte, you can just use all of your existing JavaScript code anywhere you want, more naturally, without BEING OWNED BY THE VIRTUAL DOM.",
			who: 'Zed A. Shaw',
			handle: '@lzsthw',
			href: 'https://x.com/lzsthw/status/1139706194304655360',
			date: 'Jun 15, 2019'
		},
		{
			quote:
				'Been using @sveltejs for a few projects lately, it\'s quite a nice alternative to React, fewer gotchas and complexity and Codex handles it really well.',
			who: 'Peter Steinberger',
			handle: '@steipete',
			href: 'https://x.com/steipete/status/2055402519841411165',
			date: 'May 15, 2026'
		},
		{
			quote:
				'👍🏽@Sveltejs has a dirt-simple compiler API - literally svelte.compile(source) - but most apps need a bundler solution! This thread digs through rollup-plugin-svelte today - only 338 lines of code!',
			who: 'swyx',
			handle: '@swyx',
			href: 'https://x.com/swyx/status/1223334283693084672',
			date: 'Jan 31, 2020'
		},
		{
			quote:
				"Svelte is the easiest JavaScript framework to learn. Recently, it was ranked #1 as the Most Loved Framework in StackOverflow's Survey. Let's find out why. Svelte Thread.",
			who: 'Kevin',
			handle: '@kvncnls',
			href: 'https://x.com/kvncnls/status/1442814601448411142',
			date: 'Sept 28, 2021'
		}
	];

	const marqueeItems = [...recommendations, ...recommendations];

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

		[whySection, faqSection, recSection].forEach((el) => {
			if (!el) return;
			gsap.from(el, {
				scrollTrigger: {
					trigger: el,
					start: 'top 88%',
					toggleActions: 'play none none none'
				},
				y: 36,
				opacity: 0,
				duration: 0.65,
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
			<p class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#ff3e00]">Svelte-Island</p>
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

	<!-- How it Works -->
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
					Read real Svelte snippets in Monaco as you learn.
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
					Pass challenges to unlock modules and climb ranks.
				</p>
			</div>
		</div>
	</section>

	<!-- Why Svelte? -->
	<section bind:this={whySection} class="relative border-t border-white/40 bg-white/30 py-24">
		<div class="mx-auto max-w-3xl px-6">
			<h2 class="text-center text-3xl font-bold text-slate-800">Why Svelte?</h2>
			<p class="mx-auto mt-3 max-w-xl text-center text-slate-600">
				Three reasons teams and indie builders pick Svelte for UI work.
			</p>
			<ul class="mt-12 space-y-10">
				{#each whyPoints as point, i}
					<li>
						<p class="text-sm font-semibold uppercase tracking-wide text-[#ff3e00]">
							{String(i + 1).padStart(2, '0')}
						</p>
						<h3 class="mt-1 text-xl font-bold text-slate-800">{point.title}</h3>
						<p class="mt-2 text-slate-600">{point.body}</p>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- FAQs -->
	<section bind:this={faqSection} class="relative mx-auto max-w-3xl px-6 py-24">
		<h2 class="text-center text-3xl font-bold text-slate-800">FAQs</h2>
		<p class="mx-auto mt-3 max-w-xl text-center text-slate-600">
			Quick answers before you start the expedition.
		</p>
		<div class="mt-10 space-y-3">
			{#each faqs as item}
				<details
					class="group border-b border-slate-300/60 py-4 open:pb-5"
				>
					<summary
						class="cursor-pointer list-none text-lg font-semibold text-slate-800 marker:content-none [&::-webkit-details-marker]:hidden"
					>
						<span class="flex items-center justify-between gap-4">
							{item.q}
							<span class="text-slate-400 transition group-open:rotate-45">+</span>
						</span>
					</summary>
					<p class="mt-3 text-slate-600">{item.a}</p>
				</details>
			{/each}
		</div>
	</section>

	<!-- Recommendations — infinite horizontal marquee -->
	<section bind:this={recSection} class="relative overflow-hidden border-t border-white/40 bg-sky-50/50 py-24">
		<div class="mx-auto max-w-3xl px-6">
			<h2 class="text-center text-3xl font-bold text-slate-800">Why people recommend Svelte</h2>
			<p class="mx-auto mt-3 max-w-xl text-center text-slate-600">
				Real posts from X — hover to pause the scroll.
			</p>
		</div>
		<div class="mt-12 w-full overflow-hidden">
			<div
				class="animate-marquee flex w-max gap-4 px-4 hover:[animation-play-state:paused] active:[animation-play-state:paused]"
				aria-label="Recommended posts about Svelte"
			>
				{#each marqueeItems as rec, i (i)}
					<a
						href={rec.href}
						target="_blank"
						rel="noopener noreferrer"
						class="flex w-[min(85vw,22rem)] shrink-0 flex-col rounded-2xl border border-white/10 bg-slate-900/85 p-5 text-left text-slate-100 shadow-lg backdrop-blur-md transition-colors hover:border-[#ff3e00]/40 hover:bg-slate-900"
					>
						<div class="mb-3 flex items-start justify-between gap-3">
							<div class="min-w-0">
								<p class="truncate font-semibold text-white">{rec.who}</p>
								<p class="truncate text-sm text-slate-400">{rec.handle}</p>
							</div>
							<Twitter class="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
						</div>
						<p class="line-clamp-6 flex-1 text-sm leading-relaxed text-slate-200">
							“{rec.quote}”
						</p>
						<p class="mt-4 text-xs text-slate-500">{rec.date}</p>
					</a>
				{/each}
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
					href="https://github.com/RiteshS1"
					target="_blank"
					rel="noopener noreferrer"
					class="text-slate-400 transition-colors hover:text-white"
					aria-label="GitHub"
				>
					<Github class="h-5 w-5" />
				</a>
				<a
					href="https://x.com/delphic_RS"
					target="_blank"
					rel="noopener noreferrer"
					class="text-slate-400 transition-colors hover:text-white"
					aria-label="Twitter / X"
				>
					<Twitter class="h-5 w-5" />
				</a>
				<a
					href="https://riteshh.in/"
					target="_blank"
					rel="noopener noreferrer"
					class="text-slate-400 transition-colors hover:text-white"
					aria-label="Portfolio"
				>
					<Globe class="h-5 w-5" />
				</a>
			</div>
		</div>
	</footer>
</div>
