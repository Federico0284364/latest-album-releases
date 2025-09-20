// lib/handleFollow.ts
import { useSpotifyStore } from "@/store/store";
import { Artist } from "@/models/artist";

/**
 * Funzione che gestisce solo l'unfollow di un artista.
 */
export async function unfollowArtist(artist: Artist): Promise<void> {
	const {
		user,
		followedArtistsList,
		setFollowedArtistsList,
	} = useSpotifyStore.getState();

	if (!user?.uid) return;
  if (!artist.following){
    return
  }

	const previousFollowedList = [...followedArtistsList];

	// Aggiorna stato locale rimuovendo l'artista
	setFollowedArtistsList(
		followedArtistsList.filter((a) => a.id !== artist.id)
	);

	try {
		const res = await fetch(
			`/api/user-data/${user.uid}?artistId=${encodeURIComponent(artist.id)}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			}
		);

		if (!res.ok) throw new Error("Errore nella chiamata fetch");
	} catch (error) {
		console.error("Errore aggiornamento server:", error);

		// rollback stato precedente
		setFollowedArtistsList(previousFollowedList);
	}
}
