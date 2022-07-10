import { sveltekit } from '@sveltejs/kit/vite';

import nodePolyfills from "rollup-plugin-polyfill-node";
const production = process.env.NODE_ENV === "production";


export default {
	plugins: [
		sveltekit(),

		// ↓ Needed for development mode
		!production &&
		nodePolyfills({
			include: ["node_modules/**/*.js", new RegExp("node_modules/.vite/.*js")]
		})
	],

	build: {
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills()
			]
		},
		// ↓ Needed for build if using WalletConnect and other providers
		commonjsOptions: {
			transformMixedEsModules: true
		}
	},

	envPrefix: 'CLIENT_'
};
