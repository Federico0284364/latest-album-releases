import { Artist } from "@/models/artist";
import { albums } from "@/mock/albums"; // se vuoi collegare alcuni album reali

export const artist: Artist = {
  external_urls: {
    spotify: "https://open.spotify.com/artist/1234567890",
  },
  followers: {
    href: null,
    total: 12000,
  },
  genres: ["pop", "rock"],
  href: "https://api.spotify.com/v1/artists/1234567890",
  id: "1234567890",
  images: [
    {
      url: "https://via.placeholder.com/300",
      height: 300,
      width: 300,
    },
    {
      url: "https://via.placeholder.com/150",
      height: 150,
      width: 150,
    },
  ],
  name: "Test Artist",
  popularity: 85,
  type: "artist",
  uri: "spotify:artist:1234567890",
  albums: albums.slice(0, 2),
};
