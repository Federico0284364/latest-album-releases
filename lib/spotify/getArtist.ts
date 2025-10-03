"use client";

import { Artist } from "@/models/artist";
import { getAuth } from "firebase/auth";

type ArtistData = {
  name?: string;
  id?: string;
};

export async function getArtist({ name, id }: ArtistData): Promise<Artist | undefined> {
  if (!id && !name) {
    console.warn("getArtist chiamato senza id né name");
    return undefined;
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("Utente non loggato");
      return undefined;
    }

    const token = await user.getIdToken();

    const url = id
      ? `/api/spotify/artist?id=${encodeURIComponent(id)}`
      : `/api/spotify/artist?name=${encodeURIComponent(name!)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Errore nel fetch artista:", res.status, await res.text());
      return undefined;
    }

    const artist: Artist = await res.json();
    return artist;
  } catch (error) {
    console.error("Errore nel fetch artista:", error);
    return undefined;
  }
}
