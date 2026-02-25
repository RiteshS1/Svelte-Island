/**
 * The Brain — global reactive state for Svelte-Island (Svelte 5 Runes).
 * Import { game } from '$lib/state/game.svelte' and use game.user, game.login(), etc.
 */

import { goto } from '$app/navigation';
import type { MusicMood } from '$lib/constants/audio';

export type GameUser = {
	name: string;
	xp: number;
	rank: string;
};

// Single reactive object: mutate properties only (no reassignment of the export).
const state = $state({
	user: null as GameUser | null,
	sidebarOpen: true,
	musicMood: 'zen' as MusicMood,
	/** When true, background music is paused (default: off until user hits Play). */
	musicPaused: true,
	skyPhase: 'day' as 'day' | 'night',
	/** When true, penguin plays animation (emperor/dancing); when false, stays idle for focus. */
	penguinAnimationOn: true,
	/** Current lesson slug (set by learn/[lessonId] page so ClassroomScene can swap penguin). */
	currentLessonSlug: null as string | null,
	/** Slugs of completed lessons/checkpoints (for unlocking next module via tests). */
	completedLessons: [] as string[],
	/** Passed test IDs (e.g. 'test-1') to unlock next module. */
	passedTests: [] as string[],
	/** Loader overlay: visible, variant, optional custom image */
	loaderVisible: false,
	loaderVariant: 'app-start' as 'app-start' | 'transition' | 'challenge-complete',
	loaderImageSrc: null as string | null,
	/** Set to moduleId (e.g. 2) when redirecting to first lesson after passing a test; learn page shows confetti then clears. */
	unlockedModuleId: null as number | null
});

export const game = {
	get user() {
		return state.user;
	},
	get sidebarOpen() {
		return state.sidebarOpen;
	},
	get musicMood() {
		return state.musicMood;
	},
	get musicPaused() {
		return state.musicPaused;
	},
	get skyPhase() {
		return state.skyPhase;
	},
	get penguinAnimationOn() {
		return state.penguinAnimationOn;
	},
	get currentLessonSlug() {
		return state.currentLessonSlug;
	},
	get completedLessons() {
		return state.completedLessons;
	},
	get passedTests() {
		return state.passedTests;
	},
	get loaderVisible() {
		return state.loaderVisible;
	},
	get loaderVariant() {
		return state.loaderVariant;
	},
	get loaderImageSrc() {
		return state.loaderImageSrc;
	},
	get unlockedModuleId() {
		return state.unlockedModuleId;
	},
	set sidebarOpen(value: boolean) {
		state.sidebarOpen = value;
	},
	set musicMood(value: MusicMood) {
		state.musicMood = value;
	},
	set musicPaused(value: boolean) {
		state.musicPaused = value;
	},
	set skyPhase(value: 'day' | 'night') {
		state.skyPhase = value;
	},
	toggleSkyPhase() {
		state.skyPhase = state.skyPhase === 'day' ? 'night' : 'day';
	},
	togglePenguinAnimation() {
		state.penguinAnimationOn = !state.penguinAnimationOn;
	},
	set currentLessonSlug(value: string | null) {
		state.currentLessonSlug = value;
	},
	completeLesson(slug: string) {
		if (!state.completedLessons.includes(slug)) state.completedLessons = [...state.completedLessons, slug];
	},
	passTest(testId: string) {
		if (!state.passedTests.includes(testId)) state.passedTests = [...state.passedTests, testId];
	},
	login(name: string) {
		state.user = {
			name: name.trim() || 'Explorer',
			xp: 0,
			rank: 'Rookie'
		};
		goto('/dashboard');
	},
	logout() {
		state.user = null;
		goto('/');
	},
	toggleSidebar() {
		state.sidebarOpen = !state.sidebarOpen;
	},
	toggleMusicPaused() {
		state.musicPaused = !state.musicPaused;
	},
	showLoader(
		variant: 'app-start' | 'transition' | 'challenge-complete',
		imageSrc?: string | null
	) {
		state.loaderVisible = true;
		state.loaderVariant = variant;
		state.loaderImageSrc = imageSrc ?? null;
	},
	hideLoader() {
		state.loaderVisible = false;
	},
	setUnlockedModuleId(moduleId: number | null) {
		state.unlockedModuleId = moduleId;
	}
};
