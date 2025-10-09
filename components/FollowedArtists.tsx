"use client";

import { twMerge } from "tailwind-merge";
import { Artist } from "@/models/artist";
import { useSpotifyStore } from "@/store/store";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import Image from "next/image";
import { sortAlbumsBy } from "@/lib/utils/query-albums/sorting";
import { isToday, makeDatePretty } from "@/lib/utils/date";
import Notification from "./Notification";
import { sortArtistsBy } from "@/lib/utils/query-artists/sorting";
import LogInWarning from "./LoginWarning";

type Props = {
	className?: string;
};

export default function FollowedArtists({ className }: Props) {
	useEffect(() => {
		let size;
		function handleResize() {
			if (window.innerWidth > 640) {
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

	const [numberOfAlbums, setNumberOfAlbums] = useState<number>();
	const [openArtist, setOpenArtist] = useState<Artist>();
	const [unfollowedArtist, setUnfollowedArtist] = useState<Artist>();
	const [artistsSort, setArtistsSort] = useState<"release_date" | "name">(
		"release_date"
	);

	const user = useSpotifyStore((state) => state.user);
	const followedArtistsList = sortArtistsBy[artistsSort](
		useSpotifyStore((state) => state.followedArtistsList)
	);

	if (!user) {
		return (
			<LogInWarning>Log in to see your followed artists</LogInWarning>
		);
	}

	const albums =
		sortAlbumsBy
			.release_date(openArtist?.albums)
			?.slice(0, numberOfAlbums) ?? [];

	const handleFollow = useSpotifyStore((state) => state.handleFollow);

	async function handleOpenArtist(artist: Artist) {
		if (openArtist?.id === artist.id) {
			setOpenArtist(undefined);
		} else {
			setOpenArtist(artist);
		}
	}

	async function handleUnfollow(artistId: string) {
		const artist = followedArtistsList.find((art) => art.id === artistId);
		if (!user || !artist) return;
		const previousOpenArtist = { ...openArtist } as Artist;
		setOpenArtist(undefined);
		try {
			await handleFollow(artist, true);
			setUnfollowedArtist(previousOpenArtist);
		} catch (error) {
			setOpenArtist(previousOpenArtist);
		}
	}

	function handleHideUnfollowNotification() {
		setUnfollowedArtist(undefined);
	}

	function handleShowUnfollowNotification() {}

	return (
		<aside className={twMerge("flex justify-center", className)}>
			<Notification
				message={
					unfollowedArtist
						? `You have unfollowed ${unfollowedArtist?.name}`
						: ""
				}
				onClose={handleHideUnfollowNotification}
			/>

			<div>
				<div className="w-fit py-1 px-2 rounded mb-3 gap-2">
					<span>Sort by: </span>
					<select
						className="bg-medium text-white p-2 rounded ml-2"
						value={artistsSort}
						onChange={(e) =>
							setArtistsSort(
								e.target.value as "name" | "release_date"
							)
						}
					>
						<option value="release_date">Release date</option>
						<option value="name">Name</option>
					</select>
				</div>

				<motion.ul className="flex flex-col gap-1 w-[90vw] max-w-140">
					{followedArtistsList?.map((artist) => {
						return (
							<li
								onClick={() => handleOpenArtist(artist)}
								key={artist.id}
								className="text-fg bg-medium rounded-2xl border-1 border-border-muted py-2 px-4"
							>
								<div className="flex justify-between items-center">
									<h1 className="text-2xl">{artist.name}</h1>
									<ReleaseDate artist={artist} />
								</div>

								<AnimatePresence>
									{openArtist?.id === artist.id && (
										<motion.div
											key={artist.name + "albums"}
											initial={{ scaleY: 0.2 }}
											animate={{
												scaleY: 1,
												transformOrigin: "top",
												transition: {
													type: "tween",
													duration: 0.15,
												},
											}}
											exit={{
												scaleY: 0,
												opacity: 0,
												transformOrigin: "top",
												transition: {
													type: "tween",
													duration: 0.15,
												},
											}}
											className="flex flex-col mt-4 items-center"
										>
											<ul className="grid sm:grid-cols-4 grid-cols-3 border-border p-6 gap-8">
												{albums?.map((album) => {
													return (
														<li
															key={"a" + album.id}
														>
															<a
																className="flex-col flex"
																href={
																	album
																		.external_urls
																		.spotify
																}
															>
																<Image
																	width={100}
																	height={100}
																	className="w-full mb-2 rounded-sm"
																	src={
																		album
																			.images[0]
																			.url
																	}
																	alt={`${album.id} album cover`}
																/>
																<h3 className="text-md sm:text-lg break-words overflow-ellipsis line-clamp-4">
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
											</ul>

											<Button
												className="h-9 mt-4 w-[50%] max-w-100 mb-2"
												variant="danger"
												onClick={() =>
													handleUnfollow(artist.id)
												}
											>
												Unfolllow
											</Button>
										</motion.div>
									)}
								</AnimatePresence>
							</li>
						);
					})}
				</motion.ul>
			</div>
		</aside>
	);
}

function ReleaseDate({ artist }: { artist: Artist }) {
	let dateText = "";
	let dateClass = twMerge();
	const albums = artist?.albums;
	const orderedAlbums = sortAlbumsBy.release_date(albums);

	if (!orderedAlbums || !orderedAlbums.length) {
		return;
	}

	const lastAlbum = orderedAlbums[0];

	const lastReleaseDate = new Date(lastAlbum.release_date);
	const hasBeenReleasedToday = isToday(lastReleaseDate);

	if (hasBeenReleasedToday) {
		dateText = "Today";
	} else {
		dateText = makeDatePretty(lastReleaseDate);
	}

	return <span className="text-fg-muted text-sm">{dateText}</span>;
}
