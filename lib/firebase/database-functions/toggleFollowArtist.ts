import { db } from '@/lib/firebase/firestore';
import { useSpotifyStore } from "@/store/store";
import { Artist } from "@/models/artist";
import { doc, runTransaction } from "firebase/firestore";

/**
 * Funzione che gestisce follow/unfollow artista.
 * Aggiorna store locale e Firestore con transazione
 */
export async function toggleFollowArtist(artist: Artist): Promise<void> {
  const {
    user,
    followedArtistsList,
    setFollowedArtistsList,
    selectedArtist,
    setSelectedArtist,
  } = useSpotifyStore.getState();

  if (!user?.uid) return;

  const followRef = doc(db, "user_follows", `${user.uid}_${artist.id}`);

  const previousSelectedArtist = { ...selectedArtist } as Artist;
  const previousFollowedList = [...followedArtistsList];

  const updatedArtist: Artist = { ...artist, following: !artist.following };
  updateLocalState(updatedArtist, updatedArtist.following);

  try {
    if (!navigator.onLine) {
      throw new Error("Sei offline");
    }

    // Firestore transazione
    await runTransaction(db, async (transaction) => {
      const followDoc = await transaction.get(followRef);

      if (followDoc.exists()) {
        if (updatedArtist.following === false) {
          transaction.delete(followRef); // unfollow
        } else {
          // già seguito, non fare nulla
        }
      } else {
        if (updatedArtist.following === true) {
          transaction.set(followRef, {
            userId: user.uid,
            artistId: artist.id,
            followedAt: new Date(),
          });
        } else {
        }
      }
    });
  } catch (error) {
    console.error("Errore aggiornamento server:", error);
    // rollback stato locale
    setFollowedArtistsList(previousFollowedList);
    setSelectedArtist(previousSelectedArtist);
    throw new Error("Errore di comunicazione con DB");
  }
}

/**
 * Aggiorna lo stato locale ottimistico
 */
function updateLocalState(artist: Artist, following: boolean) {
  useSpotifyStore.setState((state) => {
    const updatedList = following
      ? [...state.followedArtistsList, artist]
      : state.followedArtistsList.filter((a) => a.id !== artist.id);

    return {
      selectedArtist: artist,
      followedArtistsList: updatedList,
    };
  });
}
