/**
 * The Brain — global reactive state for Svelte-Island (Svelte 5 Runes).
 * Import { game } from '$lib/state/game.svelte' and use game.user, game.login(), etc.
 * Mock session + progress persist to localStorage.
 */

import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import type { MusicMood } from '$lib/constants/audio';

export type GameUser = {
	name: string;
	xp: number;
	rank: string;
};

const STORAGE_KEY = 'svelte-island-session';
const XP_PER_TEST = 50;
const XP_MASTER_BONUS = 50;

function rankForXp(xp: number): string {
	if (xp >= 300) return 'Rune Master';
	if (xp >= 200) return 'Island Guide';
	if (xp >= 100) return 'Explorer';
	if (xp >= 50) return 'Apprentice';
	return 'Rookie';
}

type PersistedSession = {
	user: GameUser | null;
	passedTests: string[];
	completedLessons: string[];
};

function loadSession(): PersistedSession | null {
	if (!browser) return null;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as PersistedSession;
		if (!parsed || typeof parsed !== 'object') return null;
		return {
			user: parsed.user ?? null,
			passedTests: Array.isArray(parsed.passedTests) ? parsed.passedTests : [],
			completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : []
		};
	} catch {
		return null;
	}
}

function persistSession(): void {
	if (!browser) return;
	try {
		const payload: PersistedSession = {
			user: state.user,
			passedTests: state.passedTests,
			completedLessons: state.completedLessons
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch {
		/* ignore quota / private mode */
	}
}

const saved = loadSession();

// Single reactive object: mutate properties only (no reassignment of the export).
const state = $state({
	user: (saved?.user ?? null) as GameUser | null,
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
	completedLessons: (saved?.completedLessons ?? []) as string[],
	/** Passed test IDs (e.g. 'test-1') to unlock next module. */
	passedTests: (saved?.passedTests ?? []) as string[],
	/** Loader overlay: visible on first paint to avoid landing flash before onMount */
	loaderVisible: true,
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
		if (!state.completedLessons.includes(slug)) {
			state.completedLessons = [...state.completedLessons, slug];
			persistSession();
		}
	},
	passTest(testId: string) {
		if (state.passedTests.includes(testId)) return;
		state.passedTests = [...state.passedTests, testId];
		if (state.user) {
			const bonus = testId === 'test-master' ? XP_MASTER_BONUS : 0;
			const xp = state.user.xp + XP_PER_TEST + bonus;
			state.user = {
				...state.user,
				xp,
				rank: rankForXp(xp)
			};
		}
		persistSession();
	},
	login(name: string) {
		const trimmed = name.trim() || 'Explorer';
		const xp = state.user?.xp ?? state.passedTests.length * XP_PER_TEST;
		state.user = {
			name: trimmed,
			xp,
			rank: rankForXp(xp)
		};
		persistSession();
		goto('/dashboard');
	},
	logout() {
		state.user = null;
		state.passedTests = [];
		state.completedLessons = [];
		if (browser) {
			try {
				localStorage.removeItem(STORAGE_KEY);
			} catch {
				/* ignore */
			}
		}
		goto('/');
	},
	/** Soft auth: redirect to login when no mock session. */
	requireUser() {
		if (!browser) return;
		if (!state.user) goto('/login');
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
