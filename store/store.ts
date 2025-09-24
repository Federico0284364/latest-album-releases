"use client";

import { create } from "zustand";
import { Artist } from "@/models/artist";
import { User } from "firebase/auth";
import { Album, AlbumCollection } from "@/models/album";
import { toggleFollowArtistToDb } from "@/lib/firebase/database-functions/followFunctionsToDb";
import { MyUser } from "@/models/user";
import type { Settings } from "@/models/settings";

type SpotifyStore = {
	user: MyUser | null;
	settings: Settings;
	inputValue: string;
	selectedArtist?: Artist;
	followedArtistsList: Artist[];
	newAlbums: Album[];

	setUser(user: MyUser | null): void;
	setSettings(settings: Settings): void;
	updateSetting<S extends keyof Settings, K extends keyof Settings[S]>(
		section: S,
		key: K,
		value: Settings[S][K]
	): void;
	setInputValue(value: string): void;
	setSelectedArtist(artist?: Artist): void;
	setFollowedArtistsList(artists: Artist[]): void;
	setNewAlbums(albums: Album[]): void;

	handleFollow(artist: Artist): Promise<void>;

	resetStore: () => void;
};

export const useSpotifyStore = create<SpotifyStore>((set, get) => {
	function setUser(user: MyUser | null): void {
		set({ user });
	}

	function setSettings(settings: Settings): void {
		set({ settings });
	}

	function updateSetting<
		S extends keyof Settings,
		K extends keyof Settings[S]
	>(section: S, key: K, value: Settings[S][K]) {
		const settings = get().settings;
		set({
			settings: {
				...settings,
				[section]: {
					...settings[section],
					[key]: value,
				},
			},
		});
	}

	function setInputValue(value: string): void {
		set({ inputValue: value });
	}

	function setSelectedArtist(artist?: Artist): void {
		set({ selectedArtist: artist });
	}

	function setFollowedArtistsList(artists: Artist[]): void {
		set({ followedArtistsList: artists });
	}

	function setNewAlbums(albums: Album[]): void {
		albums.sort((a, b) => {
			return (
				new Date(b.release_date).getTime() -
				new Date(a.release_date).getTime()
			);
		});
		set({ newAlbums: albums.slice(0, 100) });
	}

	async function handleFollow(artist: Artist) {
		const user = get().user;
		if (!artist || !user) return;
		try {
			await toggleFollowArtistToDb(user?.uid, artist);
		} catch (error) {
			throw error;
		}
	}
	function resetStore(){
			set({
				user: null,
				selectedArtist: undefined,
				followedArtistsList: [],
				newAlbums: [],
				settings: {} as Settings,
			})}

	return {
		user: null,
		settings: {
			email: {
				weeklyEmails: true,
			},
		},
		inputValue: "",
		selectedArtist: undefined,
		followedArtistsList: [],
		newAlbums: [],

		setUser,
		setSettings,
		updateSetting,
		setInputValue,
		setSelectedArtist,
		setFollowedArtistsList,
		setNewAlbums,

		handleFollow,

		resetStore
	};
});
