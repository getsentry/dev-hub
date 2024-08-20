<script setup lang="ts">
import { type GitHubUser, useFetch, useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();

const { data: gitHubUser } = await useFetch("https://api.github.com/user", {
	method: "GET",
	headers: {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		Authorization: `Bearer ${config.public.gitHubToken}`,
		"Content-Type": "application/json"
	}
});

const links = [
	{
		label: gitHubUser.value.login,
		avatar: { src: gitHubUser.value.avatar_url }
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
