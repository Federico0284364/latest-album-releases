import { Album } from "@/models/album";

export type AlbumType = string;

export async function getArtistAlbums(artistId: string, albumType: AlbumType) {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

	if (albumType === 'any'){
		albumType = 'album,single'
	} 
	try {
		const res = await fetch(`${baseUrl ? baseUrl : ''}/api/spotify/${artistId}/albums?include_groups=${encodeURIComponent(albumType)}`
);

		if (!res.ok) {
			const errorText = await res.text();
			console.error("Errore risposta API albums:", errorText);
			return undefined;
		}

		const data = await res.json();
		const albums = data.items.map((album: Album) => {
			return {
				artistId: artistId,
				...album
			}
		})
		return [ ...albums ] as Album[];
	} catch (error) {
		console.error("Errore nel fetch album dell'artista:", error);
		return undefined;
	}
}
