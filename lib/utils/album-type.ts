export function formatAlbumType(albumType: string, numberOfTracks: number) {
	let albumTypeText = albumType;
	if (albumTypeText === "single" && numberOfTracks > 3) {
		albumTypeText = "EP";
	}

	return albumTypeText;
}
