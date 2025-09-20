"use client";

import { create } from "zustand";
import { Artist } from "@/models/artist";
import { User } from "firebase/auth";
import { toggleFollowArtist } from "@/lib/firebase/database-functions/toggleFollowArtist";
import { Album, AlbumCollection } from "@/models/album";
import { toggleFollowArtistToDb } from "@/lib/firebase/database-functions/followFunctionsToDb";

type SpotifyStore = {
	user: User | null;
	inputValue: string;
	selectedArtist?: Artist;
	followedArtistsList: Artist[];
	newAlbums: Album[];

	setUser(user: User | null): void;
	setInputValue(value: string): void;
	setSelectedArtist(artist?: Artist): void;
	setFollowedArtistsList(artists: Artist[]): void;
	setNewAlbums(albums: Album[]): void;

	handleFollow(artist: Artist): Promise<void>;
};

export const useSpotifyStore = create<SpotifyStore>((set, get) => {
	function setUser(user: User | null): void {
		set({ user });
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
		set({ newAlbums: albums.slice(0, 6) });
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

	return {
		user: null,
		inputValue: "",
		selectedArtist: undefined,
		followedArtistsList: [],
		newAlbums: [],

		setUser,
		setInputValue,
		setSelectedArtist,
		setFollowedArtistsList,
		setNewAlbums,

		handleFollow,
	};
});
