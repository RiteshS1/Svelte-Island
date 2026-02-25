<script lang="ts">
	import { page } from '$app/stores';
	import {
		getLessonByIdOrSlug,
		getCheckpointSlugOfModule,
		isLessonUnlocked,
		FIRST_LESSON_SLUG,
		lessons
	} from '$lib/data/lessons';
	import { getTestById, getTestForModule } from '$lib/data/tests';
	import { game } from '$lib/state/game.svelte';
	import { Button } from '$lib/components/ui/button';
	import CodeViewer from '$lib/components/CodeViewer.svelte';
	import { marked } from 'marked';
	import { Lock } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const lessonId = $derived($page.params.lessonId ?? '');
	const lesson = $derived(getLessonByIdOrSlug(lessonId));

	let previousLessonId = $state<string | undefined>(undefined);

	$effect(() => {
		const slug = $page.params.lessonId ?? null;
		game.currentLessonSlug = slug;
		return () => {
			game.currentLessonSlug = null;
		};
	});

	/** After passing a test we redirect back to that module's checkpoint; show Hurray + confetti + unlock message. */
	$effect(() => {
		const modId = game.unlockedModuleId;
		const slug = lesson?.slug;
		if (!modId) return;
		if (!slug) return;
		const expectedSlug = getCheckpointSlugOfModule(modId);
		if (slug !== expectedSlug) {
			game.setUnlockedModuleId(null);
			return;
		}
		game.setUnlockedModuleId(null);
		toast.success("Hurray! Well done! You've unlocked the next three lessons! 🎉", { duration: 6000 });
		// @ts-ignore - optional dependency
		void import('canvas-confetti')
			.then((m: { default: (opts?: object) => void }) => {
				const confetti = m.default;
				confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
				setTimeout(() => confetti({ particleCount: 80, spread: 100, origin: { y: 0.5 } }), 200);
			})
			.catch(() => {});
	});

	/** When changing lessons (not from test), show an encouraging toast with emoji. */
	$effect(() => {
		const id = lessonId;
		const prev = previousLessonId;
		if (prev != null && prev !== id && game.unlockedModuleId == null) {
			const messages = [
				'Yay! Keep it up! 🌟',
				'Hurray! Well done! 🎉',
				'Great! Keep moving forward! ✨'
			];
			toast.success(messages[Math.floor(Math.random() * messages.length)], { duration: 3500 });
		}
		previousLessonId = id;
	});

	const htmlContent = $derived(lesson ? marked(lesson.markdownContent) : '');
	const unlocked = $derived(lesson ? isLessonUnlocked(lesson, game.passedTests) : false);
	const testForCheckpoint = $derived(
		lesson?.type === 'checkpoint' && lesson.module
			? lesson.module === 5
				? getTestById('test-master')
				: getTestForModule(lesson.module)
			: null
	);
	const challengeHref = $derived(testForCheckpoint ? `/test/${testForCheckpoint.id}` : '#');

	/** First unlocked lesson slug (for "Go to first lesson" when viewing locked). */
	const firstUnlockedSlug = $derived(
		lessons.find((l) => isLessonUnlocked(l, game.passedTests))?.slug ?? FIRST_LESSON_SLUG
	);
</script>

<svelte:head>
	<title>{lesson?.title ?? 'Lesson'} — Svelte-Island</title>
</svelte:head>

{#if !lesson}
	<div
		class="pointer-events-auto absolute right-4 top-4 bottom-4 left-4 sm:right-8 sm:top-8 sm:bottom-8 sm:left-auto sm:w-[45vw] flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/50 bg-white/60 shadow-2xl backdrop-blur-xl"
	>
		<p class="text-slate-600">Lesson not found.</p>
		<a href="/learn/{FIRST_LESSON_SLUG}" class="text-sky-600 underline hover:text-sky-700">Go to first lesson</a>
	</div>
{:else if !unlocked}
	<!-- Locked lesson: restricted view -->
	<div
		class="pointer-events-auto absolute right-4 top-4 bottom-4 left-4 sm:right-8 sm:top-8 sm:bottom-8 sm:left-auto sm:w-[45vw] flex flex-col items-center justify-center gap-6 rounded-2xl border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl"
	>
		<div class="flex flex-col items-center gap-4 text-center">
			<div class="rounded-full bg-amber-100 p-4">
				<Lock class="h-12 w-12 text-amber-600" aria-hidden="true" />
			</div>
			<h2 class="text-xl font-bold text-slate-800 font-heading">Lesson locked</h2>
			<p class="max-w-sm text-slate-600">
				Complete the previous module's test to unlock this lesson.
			</p>
			<div class="flex flex-wrap gap-3 justify-center">
				<a href="/learn/{firstUnlockedSlug}">
					<Button class="bg-[#ff3e00] text-white hover:bg-[#ff3e00]/90">Go to first unlocked lesson</Button>
				</a>
				<a href="/dashboard">
					<Button variant="outline">Back to Dashboard</Button>
				</a>
			</div>
		</div>
	</div>
{:else}
	<!-- Unlocked: full lesson content -->
	<div
		class="pointer-events-auto absolute right-4 top-4 bottom-4 left-4 sm:right-8 sm:top-8 sm:bottom-8 sm:left-auto sm:w-[45vw] overflow-y-auto rounded-2xl border border-white/50 bg-white/60 shadow-2xl backdrop-blur-xl"
	>
		<div class="flex flex-col p-6 sm:p-8">
			<!-- Header: title + Module badge -->
			<div class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
				<h1 class="text-xl sm:text-2xl font-bold text-slate-800 font-heading">
					{lesson.title}
				</h1>
				<span class="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
					Module {lesson.module}{#if lesson.type === 'checkpoint'} · Checkpoint{/if}
				</span>
			</div>

			<!-- Body: markdown prose -->
			<article
				class="prose prose-slate mt-6 max-w-none prose-headings:font-heading prose-p:text-slate-700 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-pre:bg-slate-800 prose-pre:text-slate-100"
			>
				{@html htmlContent}
			</article>

			<!-- Starter code (reusable CodeViewer, read-only for theory) -->
			{#if lesson.initialCode?.trim()}
				<div class="mt-6">
					<h3 class="mb-2 text-sm font-semibold text-slate-700">Starter code</h3>
					<CodeViewer value={lesson.initialCode} readOnly={true} language="svelte" height="min-h-48" />
				</div>
			{/if}

			<!-- Footer: Start Challenge (checkpoints only) -->
			{#if lesson.type === 'checkpoint' && testForCheckpoint}
				<div class="mt-8 border-t border-slate-200/80 pt-6">
					<a href={challengeHref}>
						<Button
							class="w-full bg-[#ff3e00] py-6 text-base font-semibold text-white hover:bg-[#ff3e00]/90"
						>
							Start Challenge
						</Button>
					</a>
				</div>
			{/if}
		</div>
	</div>
{/if}
