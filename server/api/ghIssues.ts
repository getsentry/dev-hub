import { defineEventHandler, getQuery } from "#imports";

export default defineEventHandler(async (event) => {
	try {
		const { labels, token }: { labels?: string; token: string } = { ...getQuery(event) };

		const owner = "getsentry";
		const repo = "sentry-javascript";

		if (!labels) {
			throw new Error("No labels provided");
		}

		// Each label needs a separate request to the GitHub API
		const results = await Promise.all(
			labels.split(",").map(async (label) => {
				return await $fetch(
					`https://api.github.com/repos/${owner}/${repo}/issues?labels=${label}`,
					{
						method: "GET",
						headers: {
							Accept: "application/vnd.github+json",
							"X-GitHub-Api-Version": "2022-11-28",
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json"
						}
					}
				);
			})
		);

		return results.flat();
	} catch (error) {
		console.error("Error fetching issues:", error);
		return { error: "Error fetching issues" };
	}
});
