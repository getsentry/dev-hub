// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	modules: ["@nuxt/test-utils/module", "@nuxt/eslint", "@nuxt/ui", "@sentry/nuxt/module"],
	imports: {
		autoImport: false
	},
	runtimeConfig: {
		// server-side
		gitHubToken: process.env.GITHUB_TOKEN,
		// client-side
		public: {
			gitHubToken: process.env.GITHUB_TOKEN,
			sentry: {
				dsn: process.env.SENTRY_DSN
			}
		}
	},
	sentry: {
		sourceMapsUploadOptions: {
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
			authToken: process.env.SENTRY_AUTH_TOKEN
		}
	}
});
