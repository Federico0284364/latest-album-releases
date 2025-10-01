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
import {
	getSettingsFromDb,
	saveSettingsToDb,
} from "@/lib/firebase/database-functions/settingFunctionsToDb";
import { defaultSettings, Settings } from "@/models/settings";

export default function StoreProvider({ children }: { children: ReactNode }) {
	const user = useSpotifyStore((state) => state.user);
	const setUser = useSpotifyStore((state) => state.setUser);
	const selectedArtist = useSpotifyStore((state) => state.selectedArtist);
	const setSelectedArtist = useSpotifyStore(
		(state) => state.setSelectedArtist
	);
	const setFollowedArtistsList = useSpotifyStore(
		(state) => state.setFollowedArtistsList
	);
	const setNewAlbums = useSpotifyStore((state) => state.setNewAlbums);
	const setSettings = useSpotifyStore((state) => state.setSettings);
	const resetStore = useSpotifyStore((state) => state.resetStore);

	useEffect(() => {
		if (!user || !user.uid) {
			if (!selectedArtist) {
				setSelectedArtist(undefined);
			}
			setFollowedArtistsList([]);
			setSelectedArtist({
				...selectedArtist,
			} as Artist);

			return;
		}
		saveUserDataToDb(user);

		async function fetchFollowedArtistsList(userId: string) {
			await getToken();
			const artists: Artist[] = await getFollowedArtistsFromDb(userId);
			setFollowedArtistsList(artists);

			const albums: Album[] = [];
			artists.forEach((artist) => {
				artist.albums.forEach((album) => {
					albums.push(album);
				});
			});
			const uniqueAlbums = albums.filter(
				(album, index, self) =>
					index === self.findIndex((a) => a.id === album.id)
			);
			setNewAlbums(uniqueAlbums);
		}

		async function fetchSettings(userId: string) {
			const settingsFromDb: Settings = await getSettingsFromDb(userId);
			const settings: Settings = mergeSettingsWithDefaults(
				defaultSettings,
				settingsFromDb
			);
			
			setSettings(settings);
		}

		fetchFollowedArtistsList(user.uid);
		fetchSettings(user.uid);
	}, [user]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			if (!currentUser) {
				resetStore();
			}
			setUser(currentUser);
		});
		return () => unsubscribe();
	}, []);

	return <>{children}</>;
}

function mergeSettingsWithDefaults<T>(defaults: T, provided: Partial<T>): T {
	const result: any = Array.isArray(defaults) ? [] : {};

	for (const key in defaults) {
		if (Object.prototype.hasOwnProperty.call(defaults, key)) {
			const defaultValue = defaults[key];
			const providedValue = provided?.[key];

			if (
				defaultValue &&
				typeof defaultValue === "object" &&
				!Array.isArray(defaultValue)
			) {
				result[key] = mergeSettingsWithDefaults(
					defaultValue,
					providedValue || {}
				);
			} else {
				result[key] =
					providedValue !== undefined ? providedValue : defaultValue;
			}
		}
	}

	return result as T;
}
