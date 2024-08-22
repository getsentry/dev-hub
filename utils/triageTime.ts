import {
	addHours,
	addDays,
	format,
	getDay,
	isAfter,
	isBefore,
	setHours,
	setMinutes,
	startOfDay,
	getMinutes,
	getHours
} from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

export const TIMEZONE_VIE = "Europe/Vienna";
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 17;
const BUSINESS_HOURS_PER_DAY = 8;
const TOTAL_TRIAGE_WORKING_HOURS = 2 * BUSINESS_HOURS_PER_DAY;

// from: https://github.com/getsentry/eng-pipes/blob/main/holidays.yml
const HOLIDAYS_VIE = [
	"2024-01-01",
	"2024-03-29",
	"2024-04-01",
	"2024-05-01",
	"2024-05-09",
	"2024-05-20",
	"2024-05-30",
	"2024-08-15",
	"2024-10-25",
	"2024-11-01",
	"2024-12-09",
	"2024-12-24",
	"2024-12-25",
	"2024-12-26",
	"2024-12-27",
	"2024-12-28",
	"2024-12-29",
	"2024-12-30",
	"2024-12-31"
];

function isHoliday(date: Date): boolean {
	const formattedDate = format(date, "yyyy-MM-dd");
	return HOLIDAYS_VIE.includes(formattedDate);
}

function isWeekend(date: Date): boolean {
	const day = getDay(date);
	return day === 0 || day === 6; // Sunday or Saturday
}

export function calculateTriageTime(updatedAt: Date, nowForTesting?: Date): string {
	const now = nowForTesting || new Date();

	let zonedUpdatedAt = toZonedTime(updatedAt.toISOString(), TIMEZONE_VIE);

	if (isWeekend(zonedUpdatedAt) || isHoliday(zonedUpdatedAt)) {
		// Move to the next business day
		do {
			zonedUpdatedAt = addDays(zonedUpdatedAt, 1);
		} while (isWeekend(zonedUpdatedAt) || isHoliday(zonedUpdatedAt));

		zonedUpdatedAt = setHours(zonedUpdatedAt, BUSINESS_START_HOUR);
		zonedUpdatedAt = setMinutes(zonedUpdatedAt, 0);
	} else {
		// Check if current time is outside business hours
		const businessStartTime = setHours(startOfDay(zonedUpdatedAt), BUSINESS_START_HOUR);
		const businessEndTime = setHours(startOfDay(zonedUpdatedAt), BUSINESS_END_HOUR);
		if (isBefore(zonedUpdatedAt, businessStartTime)) {
			zonedUpdatedAt = businessStartTime;
		} else if (isAfter(zonedUpdatedAt, businessEndTime)) {
			// Move to the next business day
			do {
				zonedUpdatedAt = addDays(zonedUpdatedAt, 1);
			} while (isWeekend(zonedUpdatedAt) || isHoliday(zonedUpdatedAt));

			zonedUpdatedAt = setHours(zonedUpdatedAt, BUSINESS_START_HOUR);
			zonedUpdatedAt = setMinutes(zonedUpdatedAt, 0);
		}
	}

	let remainingHours = TOTAL_TRIAGE_WORKING_HOURS;
	let endTime = zonedUpdatedAt;
	while (remainingHours > 0) {
		const businessEndTime = setHours(startOfDay(endTime), BUSINESS_END_HOUR);
		const hoursInCurrentDay = Math.min(
			remainingHours,
			BUSINESS_HOURS_PER_DAY - (endTime.getHours() - BUSINESS_START_HOUR)
		);
		endTime = addHours(endTime, hoursInCurrentDay);
		remainingHours -= hoursInCurrentDay;

		if (remainingHours > 0) {
			// Move to the next business day
			do {
				endTime = addDays(endTime, 1);
			} while (getDay(endTime) === 0 || getDay(endTime) === 6 || isHoliday(endTime));
			endTime = setHours(endTime, BUSINESS_START_HOUR);
			endTime =
				getHours(endTime) >= 17 ? setMinutes(endTime, 0) : setMinutes(endTime, getMinutes(endTime));
		}
	}

	if (isAfter(now, endTime)) {
		return "overdue";
	}

	return format(endTime, "EEE HH:mm", { timeZone: TIMEZONE_VIE });
}
