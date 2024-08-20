import { defineEventHandler, useRuntimeConfig } from "#imports";

export default defineEventHandler((event) => {
	try {
		const config = useRuntimeConfig();

		const owner = "getsentry";
		const repo = "sentry-javascript";

		return $fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
			method: "GET",
			headers: {
				Accept: "application/vnd.github+json",
				"X-GitHub-Api-Version": "2022-11-28",
				Authorization: `Bearer ${config.gitHubToken}`,
				"Content-Type": "application/json"
			}
		});
	} catch (error) {
		console.error("Error fetching issues:", error);
	}
});
