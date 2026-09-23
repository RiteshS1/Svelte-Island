<script lang="ts">
	/**
	 * Infinite horizontal marquee (industry-standard CSS pattern):
	 * - Viewport clips overflow
	 * - Track holds two identical content groups (50% translate loop)
	 * - Pause on :hover / :focus-within of the viewport (not the moving track)
	 * - Second group is aria-hidden for screen readers
	 * - Respects prefers-reduced-motion
	 */
	import type { Snippet } from 'svelte';

	type Props = {
		/** Duration for one full loop (half-track). Default 40s. */
		durationSec?: number;
		/** Accessible name for the region */
		label?: string;
		class?: string;
		children: Snippet;
	};

	let {
		durationSec = 40,
		label = 'Scrolling content',
		class: className = '',
		children
	}: Props = $props();
</script>

<div
	class="marquee {className}"
	style="--marquee-duration: {durationSec}s"
	role="region"
	aria-label={label}
>
	<div class="marquee__viewport">
		<div class="marquee__track">
			<div class="marquee__group">
				{@render children()}
			</div>
			<!-- Duplicate for seamless loop; hidden from AT -->
			<div class="marquee__group" aria-hidden="true">
				{@render children()}
			</div>
		</div>
	</div>
</div>

<style>
	.marquee {
		width: 100%;
	}

	.marquee__viewport {
		overflow: hidden;
		width: 100%;
		/* Soft edge mask so cards don't clip harshly */
		mask-image: linear-gradient(
			to right,
			transparent,
			black 4%,
			black 96%,
			transparent
		);
	}

	.marquee__track {
		display: flex;
		width: max-content;
		animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
		will-change: transform;
	}

	/* Pause when pointer is over the viewport OR focus is inside a card */
	.marquee__viewport:hover .marquee__track,
	.marquee__viewport:focus-within .marquee__track {
		animation-play-state: paused;
	}

	.marquee__group {
		display: flex;
		flex-shrink: 0;
		align-items: stretch;
		gap: 1rem;
		padding-inline: 0.5rem;
	}

	@keyframes marquee-scroll {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			/* Exactly one group width — requires two equal groups */
			transform: translate3d(-50%, 0, 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee__track {
			animation: none;
			/* Static: show first group only; overflow still scrollable if needed */
			max-width: 100%;
			flex-wrap: wrap;
			justify-content: center;
			transform: none;
		}

		.marquee__group[aria-hidden='true'] {
			display: none;
		}

		.marquee__viewport {
			mask-image: none;
			overflow-x: auto;
		}
	}
</style>
