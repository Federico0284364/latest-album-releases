import { db } from "@/lib/firebase/firestore";
import { doc, runTransaction } from "firebase/firestore";
import type { Artist } from "@/models/artist";
import { useSpotifyStore } from "@/store/store";
import { Album } from "@/models/album";

export async function toggleFollowArtistToDb(
	userId: string,
	artist: Artist,
	isFollowing: boolean
) {
	const {
		user,
		followedArtistsList,
		setFollowedArtistsList,
		selectedArtist,
		setSelectedArtist,
		newAlbums,
		setNewAlbums,
	} = useSpotifyStore.getState();

	if (!user?.uid) return;

	const previousSelectedArtist = { ...selectedArtist } as Artist;
	const previousFollowedList: Artist[] = [...followedArtistsList];
	const previousNewAlbums: Album[] = [...newAlbums];

	updateLocalState(artist, isFollowing);

	try {
		if (!userId || !artist?.id) {
			throw new Error("ID artista e/o ID utente mancanti");
		}

		const followDoc = doc(db, "users", userId, "artists", artist.id);
		const artistDoc = doc(db, "artists", artist.id);

		await runTransaction(db, async (transaction) => {
			const docSnap = await transaction.get(followDoc);

			if (docSnap.exists()) {
				transaction.delete(followDoc);
			} else {
				transaction.set(followDoc, {
					artistId: artist.id,
					name: artist.name,
					followedAt: new Date(),
				});

				transaction.set(artistDoc, artist, { merge: true });
			}
		});
	} catch (error) {
		setFollowedArtistsList(previousFollowedList);
		setSelectedArtist(previousSelectedArtist);
		setNewAlbums(previousNewAlbums);
		console.error("Errore nel toggle follow:", error);
		throw error;
	}
}

function updateLocalState(artist: Artist, isFollowing: boolean) {
	const { followedArtistsList, setFollowedArtistsList } =
		useSpotifyStore.getState();

	const updatedList = isFollowing
		? followedArtistsList.filter((a) => a.id !== artist.id)
		: [
				...followedArtistsList.filter((art) => art.id !== artist.id),
				artist,
		  ];

	setFollowedArtistsList(updatedList);
}
