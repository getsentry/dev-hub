import { useRuntimeConfig } from "#imports";
import * as Sentry from "@sentry/nuxt";

Sentry.init({
	dsn: useRuntimeConfig().public.sentry.dsn
});
