import { tests } from '$lib/data/tests';

export const prerender = true;

export function entries() {
	return tests.map((t) => ({ testId: t.id }));
}
