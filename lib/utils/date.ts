export function makeDatePretty(date: Date) {
	return date.toLocaleDateString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function isWithinLastDays(releaseDate: Date, days = 7): boolean {
  const today = new Date();
  const cutoff = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  return releaseDate >= cutoff && releaseDate <= today;
}