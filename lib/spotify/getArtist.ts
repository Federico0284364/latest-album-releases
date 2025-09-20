"use client";

import { Artist } from "@/models/artist";

type ArtistData = {
	name?: string,
	id?: string
}

export async function getArtist({name, id}: ArtistData) {
	try {
		let artist: Artist;

		if (id){
			const res = await fetch(`/api/spotify/artist?id=${id}`);
			artist = await res.json();
		} else {
			const res = await fetch(`/api/spotify/artist?name=${name}`)
			artist = await res.json();
		}

		return { ...artist } as Artist;
	} catch (error) {
		console.error("Errore nel fetch artista:", error);
		return undefined;
	}
}
