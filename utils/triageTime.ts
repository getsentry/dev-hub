export const calculateTriageTimeLeft = (updatedAt: Date): string => {
	const futureDate = new Date(updatedAt.getTime() + 48 * 60 * 60 * 1000);
	const now = new Date();
	const timeDiff = futureDate.getTime() - now.getTime();

	if (timeDiff <= 0) {
		return "overdue";
	}

	const hours = Math.floor(timeDiff / (1000 * 60 * 60));
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}h ${minutes}m`;
};
