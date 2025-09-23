export function capitalize(string: string):string {
	if (string.length === 0) return "";

	return string.length > 1
		? string[0].toUpperCase() + string.slice(1)
		: string.toUpperCase();
}