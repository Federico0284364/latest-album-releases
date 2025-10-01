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