"use client";
import AlbumCard from "./AlbumCard";
import { useSpotifyStore } from "@/store/store";
import { useState, useMemo } from "react";
import { sortAlbumsBy } from "@/lib/utils/query-albums/sorting";
import { filterAlbumsBy } from "@/lib/utils/query-albums/filters";
import SpotifyLogo from "./SpotifyLogo";

export default function LatestReleases() {
	const newAlbums = useSpotifyStore((state) => state.newAlbums);
	const [filter, setFilter] = useState<
		"" | "album" | "single" | "compilation"
	>("");
	const filteredNewAlbums = useMemo(() => {
		return filterAlbumsBy.album_type(newAlbums, filter);
	}, [filter, newAlbums]);

	return (
		<>
			<div className=" w-fit py-1 px-2 rounded mb-2 gap-2">
				<span>Filter: </span>
				<select
					className="bg-medium text-white p-2 rounded ml-2"
					value={filter}
					onChange={(e) =>
						setFilter(
							e.target.value as
								| ""
								| "album"
								| "single"
								| "compilation"
						)
					}
				>
					<option value="">none</option>
					<option value="album">albums</option>
					<option value="single">singles</option>
					<option value="compilation">compilations</option>
				</select>
			</div>

			{filteredNewAlbums.length ? (
				<>
					<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
						{filteredNewAlbums.slice(0, 20).map((album) => {
							return (
								<AlbumCard
									showAlbumType={!filter}
									album={album}
									imageSrc={album.images?.[0]?.url}
									className="w-full"
									showArtistName={true}
									key={"new-album" + album.id}
								/>
							);
						})}
					</ul>
					<p className="mt-3 w-full flex justify-center">
						<SpotifyLogo
							variant={"white"}
							text={"See more on"}
							className="mt-2"
							href={`https://open.spotify.com/playlist/37i9dQZEVXbnko3ujMtUqh`}
						/>
					</p>
				</>
			): null}
		</>
	);
}
