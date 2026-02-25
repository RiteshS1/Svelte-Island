<script lang="ts">
	import { onMount } from 'svelte';
	import { game } from '$lib/state/game.svelte';
	import { lessons, isLessonUnlocked, FIRST_LESSON_SLUG } from '$lib/data/lessons';
	import { MUSIC_MOOD_LABELS, type MusicMood } from '$lib/constants/audio';
	import { LOADER_SKY_SWITCH_DURATION_MS } from '$lib/constants/loader';
	import { Button } from '$lib/components/ui/button';
	import {
		BookOpen,
		Home,
		Lock,
		Map,
		Menu,
		Music,
		Moon,
		PanelLeftClose,
		PanelLeftOpen,
		Pause,
		Play,
		Square,
		Sun,
		X
	} from 'lucide-svelte';

	const moods: MusicMood[] = ['study', 'zen', 'sad', 'myfavourite'];

	let isMobile = $state(false);
	let mobileMenuOpen = $state(false);

	onMount(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		isMobile = mq.matches;
		const handler = () => {
			isMobile = mq.matches;
			if (!mq.matches) mobileMenuOpen = false;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleSkyToggle() {
		game.showLoader('transition');
		game.toggleSkyPhase();
		setTimeout(() => game.hideLoader(), LOADER_SKY_SWITCH_DURATION_MS);
	}

	const sidebarOpen = $derived(isMobile ? mobileMenuOpen : game.sidebarOpen);
	const showAsOverlay = $derived(isMobile);
</script>

<!-- Mobile: hamburger (glass style) -->
{#if isMobile && !mobileMenuOpen}
	<button
		type="button"
		class="glass-icy fixed left-4 top-4 z-30 flex size-10 items-center justify-center rounded-xl text-slate-700 shadow-lg hover:bg-white/40"
		onclick={() => (mobileMenuOpen = true)}
		aria-label="Open menu"
	>
		<Menu class="h-6 w-6" />
	</button>
{/if}

{#if isMobile && mobileMenuOpen}
	<button
		type="button"
		class="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm"
		aria-label="Close menu"
		onclick={closeMobileMenu}
	></button>
{/if}

<aside
	class="glass-icy font-heading fixed left-0 top-0 z-20 flex h-screen flex-col transition-[transform,width] duration-300 ease-in-out {showAsOverlay
		? (mobileMenuOpen ? 'w-72 translate-x-0' : '-translate-x-full w-72')
		: game.sidebarOpen
			? 'w-64 translate-x-0'
			: 'w-16 translate-x-0'}"
	aria-label="Lesson navigation"
>
	<div class="flex h-16 shrink-0 items-center justify-between border-b border-white/20 px-3">
		{#if sidebarOpen}
			<a href="/dashboard" class="flex items-center gap-2 overflow-hidden" onclick={isMobile ? closeMobileMenu : undefined}>
				<img
					src="/assets/images/logo-image-no-bg.png"
					alt="Svelte-Island"
					class="h-8 w-auto object-contain"
				/>
			</a>
			{#if isMobile}
				<button
					type="button"
					class="flex size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-white/50"
					onclick={closeMobileMenu}
					aria-label="Close menu"
				>
					<X class="h-5 w-5" />
				</button>
			{/if}
		{:else}
			<a href="/dashboard" class="flex size-10 items-center justify-center rounded-lg text-sky-600 hover:bg-white/50">
				<BookOpen class="h-5 w-5" />
			</a>
		{/if}
	</div>

	<nav class="flex-1 overflow-y-auto overflow-x-hidden p-3">
		{#if sidebarOpen}
			<div class="mb-2 flex flex-col gap-1.5 px-2">
				<p class="text-xs font-semibold uppercase tracking-wide text-slate-600">Island Map</p>
				<div
					class="relative flex rounded-lg border border-white/30 bg-white/20 p-0.5 transition-all duration-300"
					role="group"
					aria-label="Sky: Day or Night"
				>
					<div
						class="absolute top-0.5 bottom-0.5 rounded-md bg-sky-500/90 shadow-sm transition-all duration-300 ease-out {game.skyPhase === 'night'
							? 'left-1/2 right-0.5'
							: 'left-0.5 right-1/2'}"
						aria-hidden="true"
					></div>
					<button
						type="button"
						class="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors duration-200 {game.skyPhase === 'day'
							? 'text-white'
							: 'text-slate-600 hover:text-slate-800'}"
						title="Day sky"
						onclick={() => {
							if (game.skyPhase === 'night') handleSkyToggle();
						}}
						aria-pressed={game.skyPhase === 'day'}
						aria-label="Day"
					>
						<Sun class="h-3.5 w-3.5 shrink-0" />
						<span>Day</span>
					</button>
					<button
						type="button"
						class="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors duration-200 {game.skyPhase === 'night'
							? 'text-white'
							: 'text-slate-600 hover:text-slate-800'}"
						title="Night sky"
						onclick={() => {
							if (game.skyPhase === 'day') handleSkyToggle();
						}}
						aria-pressed={game.skyPhase === 'night'}
						aria-label="Night"
					>
						<Moon class="h-3.5 w-3.5 shrink-0" />
						<span>Night</span>
					</button>
				</div>
				<div class="mt-2">
					<p class="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
						Penguin
					</p>
					<div
						class="relative flex rounded-lg border border-white/30 bg-white/20 p-0.5 transition-all duration-300"
						role="group"
						aria-label="Penguin: Animate or Idle"
					>
						<div
							class="absolute top-0.5 bottom-0.5 rounded-md bg-sky-500/90 shadow-sm transition-all duration-300 ease-out {!game.penguinAnimationOn
								? 'left-1/2 right-0.5'
								: 'left-0.5 right-1/2'}"
							aria-hidden="true"
						></div>
						<button
							type="button"
							class="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors duration-200 {game.penguinAnimationOn
								? 'text-white'
								: 'text-slate-600 hover:text-slate-800'}"
							title="Penguin animates"
							onclick={() => {
								if (!game.penguinAnimationOn) game.togglePenguinAnimation();
							}}
							aria-pressed={game.penguinAnimationOn}
							aria-label="Animate"
						>
							<Play class="h-3.5 w-3.5 shrink-0" />
							<span>Animate</span>
						</button>
						<button
							type="button"
							class="relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors duration-200 {!game.penguinAnimationOn
								? 'text-white'
								: 'text-slate-600 hover:text-slate-800'}"
							title="Penguin idle"
							onclick={() => {
								if (game.penguinAnimationOn) game.togglePenguinAnimation();
							}}
							aria-pressed={!game.penguinAnimationOn}
							aria-label="Idle"
						>
							<Square class="h-3.5 w-3.5 shrink-0" />
							<span>Idle</span>
						</button>
					</div>
				</div>
			</div>
			<ul class="space-y-1">
				{#each lessons as lesson}
					{@const unlocked = isLessonUnlocked(lesson, game.passedTests)}
					<li>
						{#if unlocked}
							<a
								href="/learn/{lesson.slug}"
								class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-white/60"
								title={lesson.title}
								onclick={isMobile ? closeMobileMenu : undefined}
							>
								{lesson.title}
							</a>
						{:else}
							<span
								role="status"
								class="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600"
								title="Complete the previous module test to unlock"
							>
								<Lock class="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
								{lesson.title}
							</span>
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			{#if !isMobile}
				<a
					href="/learn/{FIRST_LESSON_SLUG}"
					class="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-white/50 hover:text-slate-800"
					title="Lessons"
				>
					<Map class="h-5 w-5" />
				</a>
			{/if}
		{/if}
	</nav>

	<div class="shrink-0 border-t border-white/20 p-3">
		{#if sidebarOpen}
			<div class="mb-3">
				<p class="mb-1.5 flex items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
					<Music class="h-3.5 w-3.5" />
					Mood
				</p>
				<div class="mb-2 flex items-center gap-1.5">
					<button
						type="button"
						class="flex size-8 items-center justify-center rounded-md transition-transform duration-200 hover:scale-105 active:scale-95 {game.musicPaused
							? 'bg-sky-500 text-white'
							: 'bg-white/50 text-slate-600 hover:bg-white/70'}"
						title={game.musicPaused ? 'Play music' : 'Pause music'}
						onclick={() => game.toggleMusicPaused()}
						aria-label={game.musicPaused ? 'Play' : 'Pause'}
					>
						{#if game.musicPaused}
							<Play class="h-4 w-4" />
						{:else}
							<Pause class="h-4 w-4" />
						{/if}
					</button>
					<span class="text-xs text-slate-600">{game.musicPaused ? 'Paused' : 'Playing'}</span>
				</div>
				<div class="flex flex-wrap gap-1">
					{#each moods as mood}
						<button
							type="button"
							class="rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 {game.musicMood === mood
								? 'scale-105 bg-sky-500 text-white ring-1 ring-sky-400/50'
								: 'bg-white/50 text-slate-600 hover:bg-white/70'}"
							title={MUSIC_MOOD_LABELS[mood]}
							onclick={() => (game.musicMood = mood)}
						>
							{MUSIC_MOOD_LABELS[mood]}
						</button>
					{/each}
				</div>
			</div>
			<a
				href="/dashboard"
				class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-white/50 hover:text-slate-900"
				onclick={isMobile ? closeMobileMenu : undefined}
			>
				<Home class="h-4 w-4 shrink-0" />
				Dashboard
			</a>
			{#if game.user}
				<p class="mt-2 truncate px-3 text-xs text-slate-600">{game.user.name} · {game.user.xp} XP</p>
			{/if}
		{:else}
			{#if !isMobile}
				<a
					href="/dashboard"
					class="flex size-10 items-center justify-center rounded-lg text-slate-600 hover:bg-white/50 hover:text-slate-800"
					title="Dashboard"
				>
					<Home class="h-5 w-5" />
				</a>
			{/if}
		{/if}
	</div>

	{#if !isMobile}
		<div class="absolute -right-3 top-20 z-30">
			<Button
				variant="outline"
				size="icon"
				class="glass-icy size-8 rounded-full hover:opacity-90"
				onclick={() => game.toggleSidebar()}
				aria-label={game.sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
			>
				{#if game.sidebarOpen}
					<PanelLeftClose class="h-4 w-4 text-slate-700" />
				{:else}
					<PanelLeftOpen class="h-4 w-4 text-slate-700" />
				{/if}
			</Button>
		</div>
	{/if}
</aside>
