import { lessons } from '$lib/data/lessons';

export const prerender = true;

export function entries() {
	return lessons.map((l) => ({ lessonId: l.slug }));
}
