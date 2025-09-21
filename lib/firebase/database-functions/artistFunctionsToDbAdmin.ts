
import { Artist } from "@/models/artist";
import { adminDb } from "@/lib/firebase/admin/firebaseAdmin"; // Assicurati di avere l'Admin SDK configurata

export async function getFollowedArtistsFromDbAdmin(
	userId: string
): Promise<Artist[]> {
	try {
		// Recupera tutti i riferimenti degli artisti seguiti dall'utente
		const followsSnapshot = await adminDb
			.collection("users")
			.doc(userId)
			.collection("artists")
			.get();
		const artistIds = followsSnapshot.docs.map(
			(doc) => doc.data().artistId
		);

		if (artistIds.length === 0) return [];

		const artists: Artist[] = [];

		// Firestore Admin SDK supporta fino a 500 documenti in una query "in"
		const batchSize = 500;
		for (let i = 0; i < artistIds.length; i += batchSize) {
			const batchIds = artistIds.slice(i, i + batchSize);
			const artistsSnapshot = await adminDb
				.collection("artists")
				.where("__name__", "in", batchIds)
				.get();

			artists.push(
				...artistsSnapshot.docs.map((doc) => {return {...doc.data(), following: true} as Artist})
			);
		}

		return artists;
	} catch (error) {
		console.error(
			"Errore nel recuperare gli artisti seguiti con Admin SDK:",
			error
		);
		throw new Error(
			"Impossibile recuperare gli artisti seguiti. Riprova più tardi."
		);
	}
}
