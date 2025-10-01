"use client";
import AlbumCard from "./AlbumCard";
import { useSpotifyStore } from "@/store/store";
import { useState, useMemo, Fragment } from "react";
import { sortAlbumsBy } from "@/lib/utils/query-albums/sorting";
import { filterAlbumsBy } from "@/lib/utils/query-albums/filters";
import SpotifyLogo from "./SpotifyLogo";
import { Album } from "@/models/album";
import { isWithinLastDays } from "@/lib/utils/date";

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
					<option value="">None</option>
					<option value="album">Albums</option>
					<option value="single">Singles / EPs</option>
					<option value="compilation">Compilations</option>
				</select>
			</div>

			{filteredNewAlbums.length ? (
				<div className="w-full flex flex-col">
					<ul className="flex flex-wrap gap-2 sm:gap-2 justify-between sm:justify-start">
						{filteredNewAlbums.slice(0, 20).map((album, index) => {
							let showDate;
							const today = new Date();
							const albumDate = new Date(album?.release_date);
							const lastAlbumDate = new Date(filteredNewAlbums[index - 1]?.release_date)

							if (index === 0 && isWithinLastDays(albumDate, 7)){
								showDate = 'Last 7 days'
							} else if (
								(!isWithinLastDays(albumDate, 7) && (isWithinLastDays(lastAlbumDate, 7))) || (!isWithinLastDays(albumDate, 7) && albumDate.getMonth() !== lastAlbumDate.getMonth()) 
							) {
								showDate =  albumDate.toLocaleDateString('en-US', {month: 'long'})
							}

							return (
								<Fragment key={"new album" + album.id}>
									{showDate && <p className="w-full border-1 border-border text-xl bg-highlight rounded-sm px-2 py-1 mt-8 mb-2">{showDate}</p>}
									<AlbumCard
										showAlbumType={!filter || filter === 'single'}
										album={album}
										imageSrc={album.images?.[0]?.url}
										className="w-[calc(50%-0.4rem)] sm:w-[calc(33%-0.5rem)] md:w-[calc(25%-0.5rem)] lg:w-[calc(20%-0.5rem)] xl:w-[calc(17%-0.8rem)]"
										showArtistName={true}
										key={"new-album" + album.id}
									/>
								</Fragment>
							);
						})}
					</ul>

					<p className="mt-3 w-full flex justify-center">
						<SpotifyLogo
							variant={"white"}
							text={"See more on"}
							className="mt-2"
							href={`https://open.spotify.com`}
						/>
					</p>
				</div>
			) : null}
		</>
	);
}
