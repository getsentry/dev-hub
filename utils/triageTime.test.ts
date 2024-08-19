import { describe, it, expect } from "vitest";
import { calculateTriageTimeLeft } from "./triageTime";

describe("calculateTriageTimeLeft", () => {
	const testCases = [
		{
			updatedAt: new Date(),
			expected: "47h 59m",
			description: "should return correct time when updatedAt is right now"
		},
		{
			updatedAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
			expected: "23h 59m",
			description: "should return correct time left when updatedAt is 24 hours ago"
		},
		{
			updatedAt: new Date(new Date().getTime() - 14 * 60 * 60 * 1000 - 15 * 60 * 1000),
			expected: "33h 44m",
			description: "should return correct time left when updatedAt is 14 hours and 15 minutes ago"
		},
		{
			updatedAt: new Date(new Date().getTime() - 1 * 60 * 60 * 1000 - 30 * 60 * 1000),
			expected: "46h 29m",
			description: "should return correct time left when updatedAt is 1 hour and 30 minutes ago"
		},
		{
			updatedAt: new Date(new Date().getTime() - 49 * 60 * 60 * 1000),
			expected: "overdue",
			description: 'should return "overdue" when updatedAt is more than 48 hours ago'
		}
	];

	describe.each(testCases)("$description", ({ updatedAt, expected }) => {
		it(`returns ${expected}`, () => {
			const result = calculateTriageTimeLeft(updatedAt);
			expect(result).toBe(expected);
		});
	});
});
