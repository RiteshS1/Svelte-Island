import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// Avoid ENOSPC (file watchers limit) on Linux: use polling instead of inotify
		watch: {
			usePolling: true
		}
	},
	ssr: {
		noExternal: [
			'tsparticles',
			'@tsparticles/slim',
			'@tsparticles/engine',
			'@tsparticles/svelte'
		]
	}
});
