import { useRuntimeConfig } from "#imports";
import { calculateTriageTime } from "./triageTime";

export type User = {
	username: string;
	avatarUrl: string;
};

export type Issue = {
	title: string;
	state: string;
	url: string;
	commentsUrl: string;
	labels: string[];
	assignees: User[];
	updatedAt: Date;
	timeLeft: Date;
	triageStatus: "needs-triage" | "waiting" | "no-status";
};

export type Comment = {
	htmlUrl: string;
	issueUrl: string;
	user: User;
	createdAt: Date;
	body: string;
	authorIsTriager: boolean;
};

export type GitHubUser = {
	login: string;
	avatar_url: string;
};

export type GitHubIssue = {
	title: string;
	url: string;
	comments_url: string;
	labels: { name: string };
	updated_at: string;
	// `login` is the GitHub username
	assignees: GitHubUser[];
};

export type GitHubComment = {
	html_url: string;
	issue_url: string;
	created_at: string;
	body: string;
	user: GitHubUser;
	author_association:
		| "OWNER"
		| "MEMBER"
		| "CONTRIBUTOR"
		| "COLLABORATOR"
		| "FIRST_TIME_CONTRIBUTOR"
		| "FIRST_TIMER"
		| "NONE";
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
			commentsUrl: issue.comments_url,
			labels: issue.labels.map((label: any) => label.name),
			assignees:
				issue.assignees?.map((assignee: any) => ({
					username: assignee.login,
					avatarUrl: assignee.avatar_url
				})) || [],
			updatedAt: new Date(issue.updated_at),
			timeLeft: calculateTriageTime(new Date(issue.updated_at)),
			triageStatus: issue.labels.some((label) => label.name === waitingForOwnerTag)
				? "needs-triage"
				: issue.labels.some((label) => label.name === waitingForCommunityTag)
					? "waiting"
					: "no-status"
		}));
};

export const transformCommentData = (gitHubComments: GitHubComment[]): Comment[] => {
	return gitHubComments.map((comment: GitHubComment) => ({
		htmlUrl: comment.html_url,
		issueUrl: comment.issue_url,
		user: {
			username: comment.user.login,
			avatarUrl: comment.user.avatar_url
		},
		createdAt: new Date(comment.created_at),
		body: comment.body,
		authorIsTriager:
			comment.author_association === "MEMBER" || comment.author_association === "OWNER"
	}));
};

export const extractTriageParticipants = (comments: Comment[]): User[] => {
	const participants = new Set<User>();

	comments.forEach((comment) => {
		if (comment.authorIsTriager) {
			participants.add(comment.user);
		}
	});

	return Array.from(participants);
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
