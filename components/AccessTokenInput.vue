<script setup lang="ts">
import { reactive } from "#imports";
import type { FormSubmitEvent } from "#ui/types";

const state = reactive({
	accessToken: undefined
});

const onSubmit = async (event: FormSubmitEvent) => {
	localStorage.setItem("access-token", event.data.accessToken);
};
</script>

<template>
	<UCard class="mt-10">
		<template #header>
			<h1 class="font-semibold">Connect your account</h1>
		</template>

		<p class="max-w-[80ch] mb-3">
			Create a personal access token in GitHub to start seeing issues. You can find the docs
			<UButton
				to="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token"
				target="_blank"
				variant="link"
				class="p-0"
				>here</UButton
			>
			or you go directly to your fine-grained personal access tokens in the
			<UButton
				to="https://github.com/settings/tokens?type=beta"
				target="_blank"
				variant="link"
				class="p-0"
				>GitHub settings</UButton
			>.
		</p>

		<p>
			Select "getsentry" in "Resource Owner" and define the repositories you want to have access to.
		</p>

		<UForm :schema="schema" :state="state" class="space-y-4 mt-5" @submit="onSubmit">
			<UFormGroup label="Personal Access Token">
				<UInput v-model="state.accessToken" placeholder="github_pat_11AH3AY..." icon="i-ph:key" />
			</UFormGroup>
			<UButton type="submit">Submit</UButton>
		</UForm>
	</UCard>
</template>
