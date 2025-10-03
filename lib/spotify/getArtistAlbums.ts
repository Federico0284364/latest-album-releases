"use client";

import { Album } from "@/models/album";
import { getAuth } from "firebase/auth";

export type AlbumType = string;

export async function getArtistAlbums(artistId: string, albumType: AlbumType): Promise<Album[] | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!artistId) {
    console.warn("getArtistAlbums chiamato senza artistId");
    return undefined;
  }

  if (albumType === "any") {
    albumType = "album,single";
  }

  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.warn("Utente non loggato");
      return undefined;
    }

    // Prendi il token Firebase ID
    const token = await user.getIdToken();

    const url = `${baseUrl ?? ""}/api/spotify/${encodeURIComponent(artistId)}/albums?include_groups=${encodeURIComponent(albumType)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Errore risposta API albums:", res.status, errorText);
      return undefined;
    }

    const data = await res.json();

    const albums: Album[] = data.items.map((album: Album) => ({
      artistId,
      ...album,
    }));

    return albums;
  } catch (error) {
    console.error("Errore nel fetch album dell'artista:", error);
    return undefined;
  }
}
