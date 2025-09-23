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

	album_type: (albums: Album[], preferred: "album" | "single" | 'compilation'): Album[] =>
		[...albums].sort((a, b) => {
			if (a.album_type === preferred && b.album_type !== preferred) {
				return -1;
			}
			if (b.album_type === preferred && a.album_type !== preferred) {
				return 1;
			}
			return a.album_type.localeCompare(b.album_type);
		}),
};
