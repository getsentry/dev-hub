import { describe, it, expect } from "vitest";
import { calculateTriageTime, TIMEZONE_VIE } from "./triageTime";
import { toZonedTime, format, fromZonedTime } from "date-fns-tz";
import { set } from "date-fns";

describe("calculateTriageTime", () => {
	const testCases = [
		{
			updatedAt: fromZonedTime("2024-11-06 15:12", TIMEZONE_VIE), // Wednesday
			fakeNow: fromZonedTime("2024-11-07 15:12", TIMEZONE_VIE),
			expected: "Fri 15:12",
			description: "should return correct time for weekday time"
		},
		{
			updatedAt: fromZonedTime("2024-11-05 08:59", TIMEZONE_VIE), // Tuesday
			fakeNow: fromZonedTime("2024-11-06 15:12", TIMEZONE_VIE),
			expected: "Wed 17:00",
			description: "should return correct time when current time is before business hours"
		},
		{
			updatedAt: fromZonedTime("2024-11-05 09:00", TIMEZONE_VIE), // Tuesday
			fakeNow: fromZonedTime("2024-11-06 15:12", TIMEZONE_VIE),
			expected: "Wed 17:00",
			description:
				"should return correct time when current time is exactly at the start of business hours"
		},
		{
			updatedAt: fromZonedTime("2024-11-04 17:00", TIMEZONE_VIE), // Monday
			fakeNow: fromZonedTime("2024-11-05 15:12", TIMEZONE_VIE),
			expected: "Wed 17:00",
			description:
				"should return correct time when current time is exactly at the end of business hours"
		},
		{
			updatedAt: fromZonedTime("2024-11-04 17:01", TIMEZONE_VIE), // Monday
			fakeNow: fromZonedTime("2024-11-05 15:12", TIMEZONE_VIE),
			expected: "Wed 17:00",
			description: "should end triaging time at 17:00 if updatedAt on Weekday is after 17:00"
		},
		{
			updatedAt: fromZonedTime("2024-11-03 17:01", TIMEZONE_VIE), // Sunday
			fakeNow: fromZonedTime("2024-11-04 15:12", TIMEZONE_VIE),
			expected: "Tue 17:00",
			description: "should end triaging time at 17:00 if updatedAt on Weekend is after 17:00"
		},
		{
			updatedAt: fromZonedTime("2024-11-03 15:12", TIMEZONE_VIE), // Sunday
			fakeNow: fromZonedTime("2024-11-04 15:12", TIMEZONE_VIE),
			expected: "Tue 17:00",
			description: "should start triaging time on Monday for Sunday time"
		},
		{
			updatedAt: fromZonedTime("2024-11-01 15:12", TIMEZONE_VIE), // Friday Holiday
			fakeNow: fromZonedTime("2024-11-01 15:12", TIMEZONE_VIE),
			expected: "Tue 17:00",
			description: "should start triaging time on Monday for Friday holiday"
		},
		{
			updatedAt: fromZonedTime("2024-11-01 15:12", TIMEZONE_VIE), // Friday Holiday
			fakeNow: fromZonedTime("2024-11-06 15:12", TIMEZONE_VIE),
			expected: "overdue",
			description: 'should return "overdue" when updatedAt is more than 16 business hours ago'
		}
	];

	testCases.forEach(({ fakeNow, updatedAt, expected, description }) => {
		it(description, () => {
			const result = calculateTriageTime(updatedAt, fakeNow);
			expect(result).toBe(expected);
		});
	});
});
