import { useRuntimeConfig } from "#imports";

const TOKEN_KEY = "access-token";

export const getGitHubToken = () => {
	if (import.meta.client) {
		const localToken = localStorage.getItem(TOKEN_KEY);

		if (localToken) {
			return localToken;
		} else {
			const config = useRuntimeConfig();
			return config.gitHubToken;
		}
	}
};

export const setGitHubToken = (token: string) => {
	if (import.meta.client) {
		localStorage.setItem(TOKEN_KEY, token);
	}
};
