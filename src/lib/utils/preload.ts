/**
 * Preload classroom assets (models) so they are cached before the 3D scene mounts.
 * Call when entering /learn — not on landing — to avoid unused-preload warnings.
 */

import { MODEL_PATHS } from '$lib/constants/scene';

const CLASSROOM_URLS: string[] = [
	MODEL_PATHS.penguin.black,
	MODEL_PATHS.penguin.emperor,
	MODEL_PATHS.penguin.dancing,
	MODEL_PATHS.terrain
];

let preloadStarted = false;

/** Start preloading classroom model URLs. Idempotent. */
export function preloadClassroomAssets(): void {
	if (preloadStarted || typeof window === 'undefined') return;
	preloadStarted = true;
	for (const url of CLASSROOM_URLS) {
		fetch(url, { credentials: 'same-origin', mode: 'cors' }).catch(() => {});
	}
}
