import { Album, AlbumGroup, ReleaseDatePrecision, Artist, Type, ExternalUrls, Image } from '../models/album';

export const albums: Album[] = [
  {
    album_type: AlbumGroup.Album,
    total_tracks: 10,
    available_markets: ["US", "GB", "IT"],
    external_urls: { spotify: "https://open.spotify.com/album/1" },
    href: "https://api.spotify.com/v1/albums/1",
    id: "1",
    images: [
      { url: "https://via.placeholder.com/640", height: 640, width: 640 },
      { url: "https://via.placeholder.com/300", height: 300, width: 300 },
      { url: "https://via.placeholder.com/64", height: 64, width: 64 },
    ],
    name: "Dummy Album One",
    release_date: new Date("2024-01-01"),
    release_date_precision: ReleaseDatePrecision.Day,
    type: AlbumGroup.Album,
    uri: "spotify:album:1",
    artists: [
      {
        external_urls: { spotify: "https://open.spotify.com/artist/1" },
        href: "https://api.spotify.com/v1/artists/1",
        id: "1",
        name: "Artist One",
        type: Type.Artist,
        uri: "spotify:artist:1",
      },
    ],
    album_group: AlbumGroup.Album,
  },
  {
    album_type: AlbumGroup.Compilation,
    total_tracks: 8,
    available_markets: ["US", "CA", "FR"],
    external_urls: { spotify: "https://open.spotify.com/album/2" },
    href: "https://api.spotify.com/v1/albums/2",
    id: "2",
    images: [
      { url: "https://via.placeholder.com/640", height: 640, width: 640 },
      { url: "https://via.placeholder.com/300", height: 300, width: 300 },
      { url: "https://via.placeholder.com/64", height: 64, width: 64 },
    ],
    name: "Dummy Album Two",
    release_date: new Date("2024-02-15"),
    release_date_precision: ReleaseDatePrecision.Day,
    type: AlbumGroup.Compilation,
    uri: "spotify:album:2",
    artists: [
      {
        external_urls: { spotify: "https://open.spotify.com/artist/2" },
        href: "https://api.spotify.com/v1/artists/2",
        id: "2",
        name: "Artist Two",
        type: Type.Artist,
        uri: "spotify:artist:2",
      },
    ],
    album_group: AlbumGroup.Compilation,
  },
];
