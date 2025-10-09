export function makeDatePretty(date: Date) {
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function isWithinLastDays(releaseDate: Date, days = 7): boolean {
	const today = new Date();
	today.setHours(0, 0, 0, 0); // normalizza oggi a mezzanotte

	const cutoff = new Date(today);
	cutoff.setDate(cutoff.getDate() - days);

	const normalizedReleaseDate = new Date(releaseDate);
	normalizedReleaseDate.setHours(0, 0, 0, 0);

	return normalizedReleaseDate >= cutoff && normalizedReleaseDate <= today;
}

export function isToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
