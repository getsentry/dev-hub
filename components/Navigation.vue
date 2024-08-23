<script setup lang="ts">
import { computed } from "vue";
import { useGitHubUser } from "~/composables/useGitHubUser";

const { gitHubUser } = useGitHubUser();

const links = computed(() => [
	{
		label: gitHubUser.value?.login ?? "Add GitHub token",
		avatar: { src: gitHubUser.value?.avatar_url },
		to: "/userSettings"
	},
	{
		label: "Triaging",
		icon: "i-ph:list-checks-bold",
		to: "/triaging"
	}
]);
</script>

<template>
	<UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800" />
</template>
