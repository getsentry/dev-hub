import * as Sentry from "@sentry/nuxt";

// Only run `init` when DSN is available
if (process.env.SENTRY_DSN) {
	Sentry.init({
		dsn: "https://5d2dc2cbcf5120c343569d1d3d87e071@o447951.ingest.us.sentry.io/4507825948983296"
	});
}
