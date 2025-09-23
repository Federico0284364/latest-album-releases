'use client'
import AlbumCard from "./AlbumCard";
import { useSpotifyStore } from "@/store/store";

export default function LatestReleases() {
  const newAlbums = useSpotifyStore((state) => state.newAlbums);

	return (
		<>
			<h1>Latest releases</h1>
			<ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
				{newAlbums.map((album) => {
					return (
						<AlbumCard
							album={album}
							imageSrc={album.images?.[0]?.url}
							className="w-full"
							artistNameIsVisible={true}
							key={"new-album" + album.id}
						/>
					);
				})}
			</ul>
		</>
	);
}
