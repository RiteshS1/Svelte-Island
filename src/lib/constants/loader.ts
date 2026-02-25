/**
 * Loader overlay: image paths and durations.
 * Used by LoaderOverlay and layout/test for app start, transition, and challenge-complete.
 */

export const LOADER_IMAGES = {
	'app-start': '/assets/images/logo-one-liner.png',
	'transition': '/assets/images/logo-image-no-bg.png',
	'challenge-complete': '/assets/images/logo-with-fire-water.png'
} as const;

/** Minimum 3 seconds for loader visibility */
export const LOADER_APP_START_DURATION_MS = 3000;
export const LOADER_TRANSITION_DURATION_MS = 3000;
export const LOADER_SUCCESS_DURATION_MS = 3000;

/** Brief loader when switching day/night sky to mask scene lag */
export const LOADER_SKY_SWITCH_DURATION_MS = 1200;

export const LOADER_MESSAGE = 'On your way to mastering Svelte...';
