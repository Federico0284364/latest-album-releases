import { db } from "@/lib/firebase/firestore";
import { doc, runTransaction } from "firebase/firestore";
import type { Artist } from "@/models/artist";
import { useSpotifyStore } from "@/store/store";

export async function toggleFollowArtistToDb(userId: string, artist: Artist) {
	const {
		user,
		followedArtistsList,
		setFollowedArtistsList,
		selectedArtist,
		setSelectedArtist,
	} = useSpotifyStore.getState();

	if (!user?.uid) return;

	const previousSelectedArtist = { ...selectedArtist } as Artist;
	const previousFollowedList: Artist[] = [...followedArtistsList];

	updateLocalState(artist);

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
		console.error("Errore nel toggle follow:", error);
		throw error;
	}
}

function updateLocalState(artist: Artist) {

	useSpotifyStore.setState((state) => {
		const updatedArtist = {...artist, following: !artist.following};
		const updatedList = updatedArtist.following
			? [...state.followedArtistsList, {...updatedArtist}]
			: state.followedArtistsList.filter((a) => a.id !== artist.id);

		return {
			selectedArtist: updatedArtist,
			followedArtistsList: updatedList,
		};
	});
}
