<script lang="ts">
	import { game } from '$lib/state/game.svelte';
	import { lessons, isLessonUnlocked, FIRST_LESSON_SLUG } from '$lib/data/lessons';
	import { Button } from '$lib/components/ui/button';
	import CodeViewer from '$lib/components/CodeViewer.svelte';
	import { BookOpen, Lock, LogOut, Sparkles } from 'lucide-svelte';

	const sampleSnippet =
		'let count = $state(0);\n<button onclick={() => count++}>\n  Clicks: {count}\n</button>';
</script>

<svelte:head>
	<title>Dashboard — Svelte-Island</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-white px-4 py-8 sm:px-6 sm:py-12">
	<div class="mx-auto max-w-3xl space-y-6 sm:space-y-8">
		<!-- Welcome card -->
		<div
			class="rounded-2xl border border-white/50 bg-white/40 p-8 shadow-lg shadow-sky-100/20 backdrop-blur-xl"
		>
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 class="text-2xl font-bold text-slate-800 font-heading">
						Welcome, {game.user?.name ?? 'Explorer'}!
					</h1>
					<p class="mt-1 text-slate-600">
						You're on the island. Pick a lesson and earn XP.
					</p>
				</div>
				<div class="flex items-center gap-4">
					<div class="rounded-xl border border-white/50 bg-white/50 px-4 py-2 text-center">
						<span class="block text-xs font-medium uppercase tracking-wide text-slate-500">XP</span>
						<span class="text-xl font-bold text-slate-800">{game.user?.xp ?? 0}</span>
					</div>
					<div class="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-2 text-center">
						<span class="block text-xs font-medium uppercase tracking-wide text-slate-500">Rank</span>
						<span class="text-lg font-semibold text-amber-800">{game.user?.rank ?? 'Rookie'}</span>
					</div>
				</div>
			</div>
			<div class="mt-6 flex flex-wrap gap-3">
				<a href="/learn/{FIRST_LESSON_SLUG}">
					<Button class="gap-2 bg-[#ff3e00] text-white hover:bg-[#ff3e00]/90">
						<Sparkles class="h-4 w-4" />
						Start Learning
					</Button>
				</a>
				<Button variant="outline" onclick={() => game.logout()} class="gap-2">
					<LogOut class="h-4 w-4" />
					Log out
				</Button>
			</div>
		</div>

		<!-- Code peek (reusable CodeViewer) -->
		<div class="rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg shadow-sky-100/20 backdrop-blur-xl">
			<h2 class="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800 font-heading">
				Svelte 5 peek
			</h2>
			<p class="mb-4 text-sm text-slate-600">A quick look at reactive runes — same viewer you'll use in lessons.</p>
			<CodeViewer value={sampleSnippet} readOnly={true} language="svelte" height="min-h-40" />
		</div>

		<!-- Lesson list -->
		<div class="rounded-2xl border border-white/50 bg-white/40 p-6 shadow-lg shadow-sky-100/20 backdrop-blur-xl">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800 font-heading">
				<BookOpen class="h-5 w-5 text-sky-600" />
				Lessons
			</h2>
			<ul class="space-y-3">
				{#each lessons as lesson}
					{@const unlocked = isLessonUnlocked(lesson, game.passedTests)}
					<li>
						{#if unlocked}
							<a
								href="/learn/{lesson.slug}"
								class="flex items-center justify-between rounded-xl border border-white/50 bg-white/50 px-4 py-3 transition-colors hover:bg-white/80 hover:border-sky-200/50"
							>
								<span class="flex items-center gap-2 font-medium text-slate-800">{lesson.title}</span>
								<span class="rounded-full bg-sky-100 px-2 py-0.5 text-sm font-medium text-sky-700">
									Module {lesson.module}{#if lesson.type === 'checkpoint'} · ✓{/if}
								</span>
							</a>
						{:else}
							<div
								class="flex cursor-not-allowed items-center justify-between rounded-xl border border-white/50 bg-white/30 px-4 py-3"
								title="Complete the previous module test to unlock"
							>
								<span class="flex items-center gap-2 font-medium text-slate-500">
									<Lock class="h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
									{lesson.title}
								</span>
								<span class="rounded-full bg-sky-100 px-2 py-0.5 text-sm font-medium text-sky-700">
									Module {lesson.module}{#if lesson.type === 'checkpoint'} · ✓{/if}
								</span>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
