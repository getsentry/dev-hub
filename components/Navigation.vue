<script setup lang="ts">
import { useFetch } from "#imports";
import { getGitHubToken } from "~/utils/tokenStorage";

const { data: gitHubUser } = await useFetch("https://api.github.com/user", {
	method: "GET",
	headers: {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		Authorization: `Bearer ${getGitHubToken()}`,
		"Content-Type": "application/json"
	},
	server: false
});

const links = [
	{
		label: gitHubUser?.value?.login ?? "Not logged in",
		avatar: { src: gitHubUser?.value?.avatar_url }
	},
	{
		label: "Triaging",
		icon: "i-ph:list-checks-bold",
		to: "/triaging"
	},
	{
		label: "Settings",
		icon: "i-ph:gear-six",
		to: "/settings"
	}
];
</script>

<template>
	<UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
</template>
