import { db } from "@/lib/firebase/firestore";
import { Artist } from "@/models/artist";
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
} from "firebase/firestore";

export async function saveArtistToDb(artist: Artist) {
	try {
		const artistRef = doc(db, "artists", artist.id);
		await setDoc(artistRef, artist, { merge: true });
	} catch (error) {
		console.error(
			"Errore durante il salvataggio dell'artista su Firestore:",
			error
		);
		throw new Error("Impossibile salvare l'artista. Riprova più tardi.");
	}
}

export async function getFollowedArtistsFromDb(
	userId: string
): Promise<Artist[]> {
	try {
		const followsSnapshot = await getDocs(
			collection(db, `users/${userId}/artists`)
		);
		const artistIds = followsSnapshot.docs.map(
			(doc) => doc.data().artistId
		);

		if (artistIds.length === 0) return [];

		const batchSize = 10;
		const artistBatches = [];

		for (let i = 0; i < artistIds.length; i += batchSize) {
			const batchIds = artistIds.slice(i, i + batchSize);
			const q = query(
				collection(db, "artists"),
				where("__name__", "in", batchIds)
			);
			artistBatches.push(getDocs(q));
		}

		const batchSnapshots = await Promise.all(artistBatches);

		const artists: Artist[] = batchSnapshots.flatMap((snap) =>
			snap.docs.map((doc) => doc.data() as Artist)
		);

		artists.sort((a, b) => a.name.localeCompare(b.name));

		return artists;
	} catch (error) {
		console.error("Errore nel recuperare gli artisti seguiti:", error);
		throw new Error(
			"Impossibile recuperare gli artisti seguiti. Riprova più tardi."
		);
	}
}

