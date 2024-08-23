<script setup lang="ts">
import { onMounted, ref, watch } from "#imports";
import {
	type Issue,
	type User,
	transformCommentData,
	transformIssueData,
	extractTriageParticipants,
	LABEL_WAITING_FOR_COMMUNITY,
	LABEL_WAITING_FOR_OWNER,
	LABEL_POST_HACKWEEK,
	type GitHubIssue
} from "~/utils/gitHub";
import { useRuntimeConfig } from "#imports";
import { computed } from "vue";
import { format } from "date-fns";

const columns = [
	{ key: "rank", label: "#", sortable: false },
	{ key: "title", label: "Title", sortable: false },
	{ key: "timeLeft", label: "Time Left", sortable: false },
	{ key: "triageStatus", label: "Status", sortable: false },
	{ key: "answeredBy", label: "Answered By", sortable: false },
	{ key: "assignees", label: "Assignees", sortable: false },
	{ key: "actions", label: "Actions", sortable: false }
];

const openInGitHub = (url: string) => {
	window.open(url, "_blank");
};

const issues = ref<Issue[]>([]);
const issuesPending = ref(true);

const commentsMap = ref<
	Map<number, { loaded: boolean; participants: User[]; comments: Comment[] | null }>
>(new Map());
const commentsPending = ref(true);

const loadIssuesWithComments = async (status: string) => {
	console.log("status", status);

	const labelQuery =
		status === "needs-triage"
			? LABEL_WAITING_FOR_OWNER
			: `${LABEL_POST_HACKWEEK},${LABEL_WAITING_FOR_OWNER},${LABEL_WAITING_FOR_COMMUNITY}`;

	try {
		const data: GitHubIssue[] = await $fetch(`api/ghIssues?labels=${labelQuery}`);
		issues.value = transformIssueData(data);
	} catch (error) {
		console.error("Error loading issues:", error);
	} finally {
		issuesPending.value = false;

		issues.value.forEach((issue) => {
			loadComments(issue.rank, issue.commentsUrl);
		});
	}
};

const loadComments = async (rank: number, commentsUrl: string) => {
	try {
		commentsPending.value = true;

		if (issuesPending.value === false) {
			const config = useRuntimeConfig();
			const data = await $fetch(commentsUrl, {
				method: "GET",
				headers: {
					Accept: "application/vnd.github+json",
					"X-GitHub-Api-Version": "2022-11-28",
					Authorization: `Bearer ${config.public.gitHubToken}`,
					"Content-Type": "application/json"
				}
			});

			const transformedComments = transformCommentData(data);
			commentsMap.value.set(rank, {
				loaded: true,
				comments: transformedComments.length > 0 ? transformedComments : null,
				triageParticipants: transformedComments
					? extractTriageParticipants(transformedComments)
					: []
			});
		}
	} catch (error) {
		console.error("Error loading comments:", error);
	} finally {
		commentsPending.value = false;
	}
};

// Filters
const triageStatus: { key: Issue["triageStatus"] | "all"; label: string; value: boolean } = [
	{
		key: "all",
		label: "All"
	},
	{
		key: "needs-triage",
		label: "Needs Triage"
	}
];

const selectedTriageStatus = ref(triageStatus[0]);

const getCommentsDataForRow = (rank: number) => {
	return computed(() => commentsMap.value.get(rank) ?? { loaded: false });
};

onMounted(() => {
	loadIssuesWithComments(selectedTriageStatus.value.key);
});

watch(selectedTriageStatus, (newStatus) => {
	issuesPending.value = true;
	loadIssuesWithComments(newStatus.key);
});
</script>

<template>
	<UCard class="mt-10 mb-10">
		<!-- Filters -->
		<div class="flex items-center justify-between gap-3 px-4 py-3">
			<USelectMenu
				v-model="selectedTriageStatus"
				:options="triageStatus"
				placeholder="Status"
				class="w-40"
			/>
		</div>

		<UTable :rows="issues" :columns="columns" :loading="issuesPending">
			<template #timeLeft-data="{ row }">
				<span size="xs" class="whitespace-nowrap">{{ row.timeLeft }}</span>
			</template>

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

			<template #answeredBy-data="{ row }">
				<div class="flex items-start justify-start gap-1">
					<UAvatar
						v-for="(participant, index) in getCommentsDataForRow(row.rank).value.triageParticipants"
						:key="participant.username"
						:title="participant.username"
						:src="participant.avatarUrl"
						:alt="participant.username"
						:style="{ transform: `translateX(-${index * 10}px)` }"
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
				<div class="pt-4">
					<p v-if="getCommentsDataForRow(row.rank).value.loaded === false" ]]>
						Loading comments...
					</p>
					<p
						v-else-if="
							getCommentsDataForRow(row.rank).value.loaded === true &&
							getCommentsDataForRow(row.rank).value.comments === null
						"
						class="font-light text-slate-500 mb-3 ml-3"
					>
						No Comments
					</p>

					<h2
						v-if="getCommentsDataForRow(row.rank).value.comments"
						class="text-lg font-semibold ml-3"
					>
						Comments
					</h2>
					<UCard v-for="comment in getCommentsDataForRow(row.rank).value.comments" class="m-3">
						<template #header>
							<div class="flex gap-3">
								<UAvatar :src="comment.user.avatarUrl" :alt="comment.user.username" />
								<p class="font-semibold">{{ comment.user.username }}</p>
								<p class="text-slate-500">{{ format(comment.createdAt, "MMM dd, HH:mm") }}</p>
							</div>
						</template>
						<MarkdownRenderer :source="comment.body" />
					</UCard>
				</div>
			</template>
		</UTable>
	</UCard>
</template>
