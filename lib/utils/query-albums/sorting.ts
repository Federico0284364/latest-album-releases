import type { Album } from "@/models/album";

export const sortAlbumsBy = {
	name: (albums: Album[]): Album[] =>
		[...albums].sort((a, b) => a.name.localeCompare(b.name)),

	release_date: (albums: Album[] | undefined): Album[] | undefined => {
		if (!albums) {
			return;
		}

		return [...albums].sort(
			(a, b) =>
				new Date(b.release_date).getTime() -
				new Date(a.release_date).getTime()
		);
	},

	album_type: (albums: Album[]): Album[] =>
		[...albums].sort((a, b) => a.album_type.localeCompare(b.album_type)),
};
