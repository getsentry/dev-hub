import { useRuntimeConfig } from "#imports";
import { calculateTriageTimeLeft } from "./triageTime";

export type Issue = {
	title: string;
	state: string;
	url: string;
	labels: string[];
	assignees: string[];
	updatedAt: Date;
	timeLeft: Date;
	triageStatus: "in-progress" | "not-started" | "completed";
};

export const transformIssueData = (gitHubIssues: any[]): Issue => {
	const waitingForCommunityTag = "Waiting for: Community";
	const waitingForOwnerTag = "Waiting for: Product Owner";

	return gitHubIssues
		.map((issue: any) => ({
			title: issue.title,
			state: issue.state,
			url: issue.html_url,
			labels: issue.labels.map((label: any) => label.name),
			assignees: issue.assignees.map((assignee: any) => assignee.login),
			updatedAt: new Date(issue.updated_at),
			timeLeft: calculateTriageTimeLeft(new Date(issue.updated_at)),
			triageStatus: issue.labels.includes(waitingForCommunityTag)
				? "in-progress"
				: issue.labels.includes(waitingForOwnerTag)
					? "completed"
					: "not-started"
		}))
		.sort((a: Issue, b: Issue) => a.updatedAt.getTime() - b.updatedAt.getTime())
		.map((issue: Issue, index: number) => ({ ...issue, rank: index + 1 }));
};
