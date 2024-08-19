<script setup lang="ts">
import { onMounted, ref } from "vue";
import { type Issue, transformIssueData } from "~/utils/gitHub";
import { calculateTriageTimeLeft } from "~/utils/triageTime";

const columns = [
	{ key: "rank", label: "#", sortable: false },
	{ key: "title", label: "Title", sortable: false },
	{ key: "timeLeft", label: "Time Left", sortable: false },
	{ key: "triageStatus", label: "Status", sortable: false },
	{ key: "assignees", label: "Assignees", sortable: false },
	{ key: "actions", label: "Actions", sortable: false }
];

const openInGitHub = (url: string) => {
	window.open(url, "_blank");
};

const issues = ref<Issue[]>([]);
const pending = ref(true);

const loadIssues = async () => {
	try {
		const data = await $fetch("api/ghIssues");
		issues.value = transformIssueData(data);
	} catch (error) {
		console.error("Error loading issues:", error);
	} finally {
		pending.value = false;
	}
};

onMounted(() => {
	loadIssues();
});
</script>

<template>
	<UContainer>
		<UCard class="mt-10">
			<UTable :rows="issues" :columns="columns" :loading="pending">
				<template #triageStatus-data="{ row }">
					<UBadge
						size="xs"
						:label="row.triageStatus === 'completed' ? 'Completed' : 'In Progress'"
						:color="row.triageStatus === 'completed' ? 'purple' : 'yellow'"
						:variant="row.triageStatus === 'completed' ? 'soft' : 'solid'"
					/>
				</template>

				<template #assignees-data="{ row }">
					<div class="flex flex-col items-start justify-start gap-1">
						<UBadge
							v-for="assignee in row.assignees"
							:key="assignee"
							:label="assignee"
							size="xs"
							color="purple"
							variant="soft"
							class="grow-0"
						/>
					</div>
				</template>

				<template #actions-data="{ row }">
					<UButton
						icon="i-ph:github-logo"
						size="sm"
						variant="link"
						@click="() => openInGitHub(row.url)"
					/>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
