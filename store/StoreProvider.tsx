"use client";

import { Album } from "@/models/album";
import { Artist } from "@/models/artist";
import { useSpotifyStore } from "./store";
import { ReactNode, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firestore";
import { getToken } from "@/lib/spotify/getToken";
import { getFollowedArtistsFromDb } from "@/lib/firebase/database-functions/artistFunctionsToDb";
import { saveUserDataToDb } from "@/lib/firebase/database-functions/userFunctionsToDb";

export default function StoreProvider({ children }: { children: ReactNode }) {
	const setUser = useSpotifyStore((state) => state.setUser);
	const setFollowedArtistsList = useSpotifyStore(
		(state) => state.setFollowedArtistsList
	);
	const setNewAlbums = useSpotifyStore((state) => state.setNewAlbums)
	const user = useSpotifyStore((state) => state.user);

	useEffect(() => {
		if (!user || !user.uid) {
			setFollowedArtistsList([]);
			return;
		}
		saveUserDataToDb(user);

		async function fetchFollowedArtistsList(userId: string) {
			await getToken();
			const artists: Artist[] = await getFollowedArtistsFromDb(userId);
			artists.map((artist) => ({ ...artist, following: true }));
			setFollowedArtistsList(artists);

			const albums: Album[] = [];
			artists.forEach((artist) => {
				artist.albums.forEach((album) => {
					albums.push(album);
				});
			});			
			setNewAlbums(albums);
		}

		fetchFollowedArtistsList(user.uid);
	}, [user]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	return <>{children}</>;
}
