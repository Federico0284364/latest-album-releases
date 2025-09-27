import type { Artist } from "@/models/artist";

export const sortArtistsBy = {
	name: (artists: Artist[]): Artist[] =>
		[...artists].sort((a, b) => a.name.localeCompare(b.name)),
};
