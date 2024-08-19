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
	triageStatus: "needs-triage" | "waiting" | "no-status";
};

export type GitHubIssue = {
	title: string;
	url: string;
	labels: { name: string };
	updated_at: string;
	// `login` is the GitHub username
	assignees: { login: string }[];
};

export const transformIssueData = (gitHubIssues: GitHubIssue[]): Issue => {
	const waitingForCommunityTag = "Waiting for: Community";
	const waitingForOwnerTag = "Waiting for: Product Owner";
	const postHackweek = "Post Hackweek";

	const includedTags = new Set([waitingForCommunityTag, waitingForOwnerTag, postHackweek]);

	return gitHubIssues
		.filter((issue) => issue.labels.some((label) => includedTags.has(label.name)))
		.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
		.map((issue: GitHubIssue, index: number) => ({
			rank: index + 1,
			title: issue.title,
			state: issue.state,
			url: issue.html_url,
			labels: issue.labels.map((label: any) => label.name),
			assignees: issue.assignees?.map((assignee: any) => assignee.login),
			updatedAt: new Date(issue.updated_at),
			timeLeft: calculateTriageTimeLeft(new Date(issue.updated_at)),
			triageStatus: issue.labels.some((label) => label.name === waitingForOwnerTag)
				? "needs-triage"
				: issue.labels.some((label) => label.name === waitingForCommunityTag)
					? "waiting"
					: "no-status"
		}));
};

const now = new Date();
const waitingForOwnerTag = "Waiting for: Product Owner";

export const dummyIssues = [
	{
		title: "Need help with Nuxt",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000)
	},
	{
		title: "Can you help me with deploying?",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 4 * 60 * 60 * 1000)
	},
	{
		title: "Just want to say hello",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 7 * 60 * 60 * 1000)
	},
	{
		name: "Whitney Francis",
		title: "Node and Nuxt and Next and Nest are confusing",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 10 * 60 * 60 * 1000)
	},
	{
		name: "Leonard Krasner",
		title: "Don't know what is wrong",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 11 * 60 * 60 * 1000)
	},
	{
		name: "Floyd Miles",
		title: "Cannot find myself",
		labels: [{ name: waitingForOwnerTag }],
		updated_at: new Date(now.getTime() - 15 * 60 * 60 * 1000)
	}
];
