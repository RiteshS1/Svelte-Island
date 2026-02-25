<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const status = $derived($page.status ?? 500);
	const message = $derived(
		typeof $page.error === 'object' && $page.error && 'message' in $page.error
			? String(($page.error as { message: string }).message)
			: ''
	);
</script>

<svelte:head>
	<title>{status} — Svelte-Island</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 px-4">
	<div class="rounded-2xl border border-white/50 bg-white p-8 shadow-lg">
		<h1 class="text-xl font-bold text-slate-800 font-heading">
			{status === 404 ? 'Page not found' : 'Something went wrong'}
		</h1>
		<p class="mt-2 text-slate-600">{message || (status === 404 ? 'This page does not exist.' : 'An unexpected error occurred.')}</p>
		<div class="mt-6 flex gap-3">
			<button
				type="button"
				class="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
				onclick={() => goto('/dashboard')}
			>
				Go to Dashboard
			</button>
			<button
				type="button"
				class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
				onclick={() => window.history.back()}
			>
				Go back
			</button>
		</div>
	</div>
</div>
