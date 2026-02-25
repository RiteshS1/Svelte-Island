/**
 * Audio asset paths for background music (mood setter).
 * Used by root layout and sidebar mood selector.
 */

export type MusicMood = 'study' | 'zen' | 'sad' | 'myfavourite';

export const AUDIO_PATHS: Record<MusicMood, string> = {
	study: '/assets/audio/study.mp3',
	zen: '/assets/audio/zen.mp3',
	sad: '/assets/audio/sad.mp3',
	myfavourite: '/assets/audio/myfavourite.mp3'
} as const;

export const MUSIC_MOOD_LABELS: Record<MusicMood, string> = {
	study: 'Study',
	zen: 'Zen',
	sad: 'Sad',
	myfavourite: 'My Favourite'
} as const;
