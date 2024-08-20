<script setup lang="ts">
import { onMounted, ref } from "vue";
import { dummyIssues, type Issue, transformCommentData, transformIssueData } from "~/utils/gitHub";
import { calculateTriageTimeLeft } from "~/utils/triageTime";
import { useFetch } from "#imports";
import { computed } from "vue";

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
const issuesPending = ref(true);

const commentsMap = ref<Map<number, Comment[]>>(new Map());
const commentsPending = ref(true);

const loadIssues = async () => {
	try {
		const data = await $fetch("api/ghIssues");
		issues.value = transformIssueData([...data, ...dummyIssues]);
	} catch (error) {
		console.error("Error loading issues:", error);
	} finally {
		issuesPending.value = false;
	}
};

onMounted(() => {
	loadIssues();
});

const loadComments = async (rank: number, commentsUrl: string) => {
	try {
		commentsPending.value = true;
		const data = await $fetch(commentsUrl);
		commentsMap.value.set(rank, transformCommentData(data));
	} catch (error) {
		console.error("Error loading comments:", error);
	} finally {
		commentsPending.value = false;
	}
};

const getCommentsForRow = (rank: number) => {
	return computed(() => commentsMap.value.get(rank) || []);
};
</script>

<template>
	<UContainer>
		<UCard class="mt-10">
			<UTable :rows="issues" :columns="columns" :loading="issuesPending">
				<template #triageStatus-data="{ row }">
					<UBadge
						size="xs"
						class="whitespace-nowrap"
						:label="row.triageStatus === 'needs-triage' ? 'Needs Triage' : 'Waiting'"
						:color="row.triageStatus === 'needs-triage' ? 'pink' : 'purple'"
						:variant="row.triageStatus === 'needs-triage' ? 'solid' : 'soft'"
					/>
				</template>

				<template #assignees-data="{ row }">
					<div class="flex flex-col items-start justify-start gap-1">
						<UBadge
							v-for="assignee in row.assignees"
							:key="assignee.username"
							:label="assignee.username"
							size="xs"
							color="purple"
							variant="soft"
							class="grow-0 whitespace-nowrap"
						/>
					</div>
				</template>

				<template #actions-data="{ row }">
					<UButton
						icon="i-ph:github-logo"
						size="sm"
						variant="link"
						@click="() => openInGitHub(row.url)"
						>Open</UButton
					>
				</template>

				<template #expand="{ row }">
					<div class="p-4">
						<UButton
							v-if="!getCommentsForRow(row.rank).value.length"
							@click="() => loadComments(row.rank, row.commentsUrl)"
							>Load Comments</UButton
						>

						<UCard v-for="comment in getCommentsForRow(row.rank).value" class="mt-3">
							<template #header>
								<div class="flex gap-3">
									<UAvatar :src="comment.user.avatarUrl" alt="Avatar" />
									<p class="font-semibold">{{ comment.user.username }}</p>
								</div>
							</template>
							<MarkdownRenderer :source="comment.body" />
						</UCard>
					</div>
				</template>
			</UTable>
		</UCard>
	</UContainer>
</template>
