const TOKEN_KEY = "access-token";

export const getGitHubToken = () => {
	if (import.meta.client) {
		const localToken = localStorage.getItem(TOKEN_KEY);

		if (localToken) {
			return localToken;
		}

		return "";
	}
};

export const setGitHubToken = (token: string) => {
	if (import.meta.client) {
		localStorage.setItem(TOKEN_KEY, token);
	}
};
