"use client";

import { twMerge } from "tailwind-merge";
import { Artist } from "@/models/artist";
import { useSpotifyStore } from "@/store/store";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import Image from "next/image";
import AlbumCard from "./AlbumCard";
import { sortAlbumsBy } from "@/lib/utils/query-albums/sorting";
import { makeDatePretty } from "@/lib/utils/date";
import { toggleFollowArtistToDb } from "@/lib/firebase/database-functions/followFunctionsToDb";

type Props = {
	className?: string;
};

export default function FollowedArtists({ className }: Props) {
	useEffect(() => {
		let size;
		function handleResize() {
			if (window.innerWidth > 1280) {
				size = 7;
			} else if (window.innerWidth > 1024) {
				size = 6;
			} else if (window.innerWidth > 768) {
				size = 5;
			} else if (window.innerWidth > 640) {
				size = 4;
			} else {
				size = 3;
			}
			setNumberOfAlbums(size);
		}

		window.addEventListener("resize", handleResize);
		handleResize();

		// pulizia evento
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const user = useSpotifyStore((state) => state.user);
	const followedArtistsList = useSpotifyStore(
		(state) => state.followedArtistsList
	);
	
	const handleFollow = useSpotifyStore((state) => state.handleFollow);

	const [numberOfAlbums, setNumberOfAlbums] = useState<number>();
	const [openArtist, setOpenArtist] = useState<Artist>();
	const albums = sortAlbumsBy.release_date(
		openArtist?.albums?.slice(0, numberOfAlbums)
	);

	async function handleOpenArtist(artist: Artist) {
		setOpenArtist(artist);
	}

	async function handleUnfollow(artistId: string) {
		const artist = followedArtistsList.find((art) => art.id === artistId);
		if (!user || !artist) return;
		const previousOpenArtist = { ...openArtist } as Artist;
		setOpenArtist(undefined);
		try {
			await handleFollow({...artist, following: true});
		} catch (error) {
			setOpenArtist(previousOpenArtist);
		}
	}

	return (
		<aside className={twMerge("", className)}>
			
			<motion.ul layout className="flex flex-col gap-1">
				{followedArtistsList?.map((artist) => {
					return (
						<li
							onClick={() => handleOpenArtist(artist)}
							key={artist.id}
							className="text-fg bg-medium rounded-2xl p-2"
						>
							<h1 className="text-2xl">{artist.name}</h1>
							{openArtist?.id === artist.id && (
								<div className="flex flex-col mt-4 items-center">
									<fieldset
										id="last-releases"
										className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 border border-neutral-700 p-6 gap-8"
									>
										<legend className="px-2">
											Last releases
										</legend>
										{albums?.map((album) => {
											return (
												<li key={'a' + album.id}>
													<a
														className="flex-col flex"
														href={
															album.external_urls
																.spotify
														}
													>
														<Image
															width={100}
															height={100}
															className="w-full mb-2 rounded-sm"
															src={
																album.images[0]
																	.url
															}
															alt={`${album.id} album cover`}
														/>
														<h3 className="text-md sm:text-lg break-words">
															{album.name}
														</h3>
														<p className="text-sm text-fg-muted">
															{makeDatePretty(
																new Date(
																	album.release_date
																)
															)}
														</p>
													</a>
												</li>
											);
										})}
									</fieldset>

									<Button
										className="h-9 mt-4 w-[50%] max-w-100 mb-2"
										variant="danger"
										onClick={() =>
											handleUnfollow(artist.id)
										}
									>
										Unfolllow
									</Button>
								</div>
							)}
						</li>
					);
				})}
			</motion.ul>
		</aside>
	);
}
