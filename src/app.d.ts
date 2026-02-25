// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module 'canvas-confetti' {
	function confetti(options?: { particleCount?: number; spread?: number; origin?: { x?: number; y?: number } }): void | Promise<void>;
	export default confetti;
}
