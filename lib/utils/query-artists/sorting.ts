import type { Artist } from "@/models/artist";

export const sortArtistsBy = {
	name: (artists: Artist[]): Artist[] =>
		[...artists].sort((a, b) => a.name.localeCompare(b.name)),

	release_date: (artists: Artist[]): Artist[] =>
		[...artists].sort((a, b) => {
			const maxA = Math.max(
				...a.albums.map((album) =>
					new Date(album.release_date).getTime()
				)
			);
			const maxB = Math.max(
				...b.albums.map((album) =>
					new Date(album.release_date).getTime()
				)
			);

			return maxB - maxA;
		}),
};
