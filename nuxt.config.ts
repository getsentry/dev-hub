// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxt/test-utils/module", "@nuxt/eslint", "@nuxt/ui"],
	imports: {
		autoImport: false
	},
	runtimeConfig: {
		// server-side
		gitHubToken: process.env.GITHUB_TOKEN,
		// client-side
		public: { gitHubToken: process.env.GITHUB_TOKEN }
	}
});
