<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { getTestById } from '$lib/data/tests';
	import { getCheckpointSlugOfModule } from '$lib/data/lessons';
	import { game } from '$lib/state/game.svelte';
	import { LOADER_SUCCESS_DURATION_MS } from '$lib/constants/loader';
	import { Button } from '$lib/components/ui/button';
	import type { Question } from '$lib/data/tests';

	const testId = $derived($page.params.testId ?? '');
	const test = $derived(getTestById(testId));

	$effect(() => {
		game.requireUser();
	});

	$effect(() => {
		if (!test) return;
		const passed = game.passedTests;
		if (test.moduleId >= 2 && !passed.includes(`test-${test.moduleId - 1}`)) {
			goto('/dashboard');
			return;
		}
		if (test.id === 'test-master' && !passed.includes('test-5')) {
			goto('/dashboard');
		}
	});

	let currentIndex = $state(0);
	let answers = $state<Record<string, number | string>>({});
	let submitted = $state(false);
	let showExplanation = $state<string | null>(null);
	/** After Finish when not all answers are correct */
	let failedSummary = $state<{ score: number; total: number } | null>(null);

	// Reset state when switching to a different test (e.g. URL change)
	$effect(() => {
		const id = testId;
		currentIndex = 0;
		answers = {};
		submitted = false;
		showExplanation = null;
		failedSummary = null;
	});

	const question = $derived(test?.questions[currentIndex]);
	const total = $derived(test?.questions.length ?? 0);
	const isLast = $derived(total > 0 && currentIndex === total - 1);
	const currentCorrect = $derived(
		question && showExplanation ? isCorrect(question) : null
	);
	function getCorrectAnswerText(q: Question): string {
		if (q.type === 'mcq' && q.options && q.correctAnswer !== undefined) {
			return q.options[q.correctAnswer] ?? '';
		}
		if (q.type === 'code' && q.solutionCode) return `Expected to include: ${q.solutionCode}`;
		if (q.type === 'fill' && q.blankAnswer) return q.blankAnswer;
		return '';
	}

	function selectMcq(qId: string, optionIndex: number) {
		if (submitted) return;
		answers = { ...answers, [qId]: optionIndex };
	}

	function setCodeAnswer(qId: string, value: string) {
		if (submitted) return;
		answers = { ...answers, [qId]: value };
	}

	function next() {
		if (!showExplanation) return;
		showExplanation = null;
		submitted = false;
		if (isLast) {
			finish();
			return;
		}
		currentIndex++;
	}

	function finish() {
		if (!test) return;
		const score = test.questions.filter((q) => isCorrect(q)).length;
		const allCorrect = score === test.questions.length;
		if (allCorrect) {
			failedSummary = null;
			game.showLoader('challenge-complete', '/assets/images/logo-with-fire-water.png');
			game.passTest(test.id);
			setTimeout(() => {
				game.hideLoader();
				if (test.id === 'test-master' || test.moduleId >= 5) {
					goto('/dashboard');
				} else {
					game.setUnlockedModuleId(test.moduleId);
					const checkpointSlug = getCheckpointSlugOfModule(test.moduleId);
					if (checkpointSlug) goto(`/learn/${checkpointSlug}`);
					else goto('/dashboard');
				}
			}, LOADER_SUCCESS_DURATION_MS);
		} else {
			failedSummary = { score, total: test.questions.length };
		}
	}

	function retryTest() {
		currentIndex = 0;
		answers = {};
		submitted = false;
		showExplanation = null;
		failedSummary = null;
	}

	function isCorrect(q: Question): boolean {
		if (q.type === 'mcq') {
			const selected = answers[q.id] as number | undefined;
			return q.correctAnswer !== undefined && selected === q.correctAnswer;
		}
		if (q.type === 'fill') {
			const user = String((answers[q.id] as string) ?? '').trim().toLowerCase();
			const expected = (q.blankAnswer ?? '').trim().toLowerCase();
			return expected.length > 0 && user === expected;
		}
		// code: user's code must contain the solution snippet to count correct
		const code = (answers[q.id] as string) ?? '';
		if (!q.solutionCode || code.trim().length === 0) return false;
		return code.includes(q.solutionCode);
	}

	function submit() {
		if (!question) return;
		showExplanation = question.explanation;
		submitted = true;
	}
</script>

<svelte:head>
	<title>{test?.title ?? 'Test'} — Svelte-Island</title>
</svelte:head>

{#if !test}
	<div class="flex min-h-screen items-center justify-center bg-slate-100">
		<div class="rounded-xl bg-white p-8 shadow-lg">
			<p class="text-slate-600">Test not found.</p>
			<a href="/dashboard" class="mt-4 inline-block text-sky-600 underline">Back to Dashboard</a>
		</div>
	</div>
{:else if failedSummary}
	<div class="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-white px-4 py-8 sm:px-6 sm:py-12">
		<div class="mx-auto max-w-2xl">
			<div class="rounded-2xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm sm:p-8">
				<h1 class="text-xl font-bold text-slate-800 font-heading sm:text-2xl">
					Not quite yet
				</h1>
				<p class="mt-3 text-slate-600">
					You scored {failedSummary.score} / {failedSummary.total}. Pass every question to unlock the next module.
				</p>
				<div class="mt-6 flex flex-wrap gap-3">
					<Button onclick={retryTest} class="bg-[#ff3e00] text-white hover:bg-[#ff3e00]/90">
						Try again
					</Button>
					<a href="/dashboard">
						<Button variant="outline">Back to Dashboard</Button>
					</a>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-white px-4 py-8 sm:px-6 sm:py-12">
		<div class="mx-auto max-w-2xl">
			<div class="mb-6 sm:mb-8 rounded-2xl border border-white/50 bg-white/60 p-4 sm:p-6 shadow-lg backdrop-blur-sm">
				<h1 class="text-xl sm:text-2xl font-bold text-slate-800 font-heading">
					{test.title}
				</h1>
				<p class="mt-1 text-slate-600">
					Question {currentIndex + 1} of {total}
				</p>
			</div>

			{#if question}
				<div class="rounded-2xl border border-white/50 bg-white/60 p-6 shadow-lg backdrop-blur-sm">
					<p class="mb-4 font-medium text-slate-800">{question.text}</p>

					{#key question.id}
						{#if question.type === 'mcq' && question.options}
							<ul class="space-y-2">
								{#each question.options as option, i}
									<li>
										<label
											class="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-sky-50 {submitted && (answers[question.id] as number) === i
												? (i === question.correctAnswer
													? 'border-green-400 bg-green-50'
													: 'border-red-300 bg-red-50')
												: ''}"
										>
											<input
												type="radio"
												name={question.id}
												checked={(answers[question.id] as number) === i}
												onchange={() => selectMcq(question.id, i)}
												disabled={submitted}
												class="h-4 w-4"
											/>
											<span>{option}</span>
										</label>
									</li>
								{/each}
							</ul>
						{:else if question.type === 'fill'}
							<input
								type="text"
								class="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 placeholder:text-slate-400"
								placeholder="Type your answer..."
								value={(answers[question.id] as string) ?? ''}
								oninput={(e) => setCodeAnswer(question.id, e.currentTarget.value)}
								disabled={submitted}
							/>
						{:else if question.type === 'code'}
							<textarea
								class="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-sm"
								rows="8"
								placeholder={question.starterCode}
								value={(answers[question.id] as string) ?? question.starterCode ?? ''}
								oninput={(e) => setCodeAnswer(question.id, e.currentTarget.value)}
								disabled={submitted}
							></textarea>
						{/if}
					{/key}

					{#if showExplanation && question}
						<div
							class="mt-6 rounded-lg border p-4 text-sm {currentCorrect
								? 'border-green-300 bg-green-50 text-green-900'
								: 'border-red-300 bg-red-50 text-red-900'}"
							role="status"
							aria-live="polite"
						>
							{#if currentCorrect}
								<p class="font-semibold">🎉 Correct!</p>
								<p class="mt-2 text-slate-700">{showExplanation}</p>
							{:else}
								<p class="font-semibold">❌ Incorrect</p>
								<p class="mt-2 text-slate-700">{showExplanation}</p>
								{#if getCorrectAnswerText(question)}
									<p class="mt-3 font-medium text-slate-800">
										Correct answer: {getCorrectAnswerText(question)}
									</p>
								{/if}
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<div class="mt-6 flex flex-wrap items-center justify-end gap-2">
				{#if showExplanation}
					<Button onclick={next}>
						{isLast ? 'Finish' : 'Next'}
					</Button>
				{:else}
					<Button
						onclick={submit}
						disabled={
							(question?.type === 'mcq' && answers[question.id] === undefined) ||
							(question?.type === 'fill' && !String(answers[question?.id] ?? '').trim())
						}
					>
						{isLast ? 'Check answer' : 'Check'}
					</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
