import { ref, watch } from "vue";
import { type GitHubUser, useFetch } from "#imports";
import { getGitHubToken, setGitHubToken } from "~/utils/tokenStorage";

const gitHubToken = ref(getGitHubToken());
const gitHubUser = ref<null | GitHubUser>(null);
const updatedLocalStorage = ref(false);

async function fetchGitHubUser(token: string): Promise<GitHubUser | null> {
	const { data } = await useFetch("https://api.github.com/user", {
		method: "GET",
		headers: {
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		server: false
	});
	return data.value as GitHubUser | null;
}

watch(
	gitHubToken,
	async (newToken) => {
		if (newToken) {
			gitHubUser.value = await fetchGitHubUser(newToken);
		} else {
			gitHubUser.value = null;
		}
	},
	{ immediate: true }
);

watch(updatedLocalStorage, async (newValue) => {
	if (newValue && gitHubToken.value) {
		gitHubUser.value = await fetchGitHubUser(gitHubToken.value);
	}
});
export function useGitHubUser() {
	return {
		gitHubToken,
		gitHubUser,
		updatedLocalStorage,
		setGitHubToken: (token: string) => {
			setGitHubToken(token);
			gitHubToken.value = token;
			updatedLocalStorage.value = !updatedLocalStorage.value; // Toggle to trigger watch
		}
	};
}
