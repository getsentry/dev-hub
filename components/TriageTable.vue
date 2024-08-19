<script setup lang="ts">
const columns = [
	{
		key: "title",
		label: "Title",
		sortable: true
	},
	{
		key: "triageStatus",
		label: "Status",
		sortable: true
	},
	{
		key: "actions",
		label: "Actions",
		sortable: false
	}
];

const issues = [
	{
		title: "Need help with Nuxt",
		triageStatus: "completed"
	},
	{
		title: "Can you help me with deploying?",
		triageStatus: "completed"
	},
	{
		title: "Just want to say hello",
		triageStatus: "inProgress"
	},
	{
		name: "Whitney Francis",
		title: "Node and Nuxt and Next and Nest are confusing"
	},
	{
		name: "Leonard Krasner",
		title: "Don't know what is wrong"
	},
	{
		name: "Floyd Miles",
		title: "Cannot find myself"
	}
];

const openInGitHub = () => {
	alert("Todo: open in GitHub");
};
</script>

<template>
	<UContainer>
		<UCard class="mt-10">
			<UTable :rows="issues" :columns="columns">
				<template #triageStatus-data="{ row }">
					<UBadge
						size="xs"
						:label="row.triageStatus === 'completed' ? 'Completed' : 'In Progress'"
						:color="row.triageStatus === 'completed' ? 'purple' : 'yellow'"
						:variant="row.triageStatus === 'completed' ? 'soft' : 'solid'"
					/>
				</template>
				<template #actions-data="{ row }">
					<UButton icon="i-ph:github-logo" size="sm" variant="link" @click="openInGitHub" />
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
