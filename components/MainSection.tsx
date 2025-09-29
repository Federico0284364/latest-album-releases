"use client";

import Input from "./Input";
import Button from "./Button";
import ArtistCard from "./ArtistCard";
import { useSpotifyStore } from "@/store/store";
import { useState, useTransition, useMemo, useEffect } from "react";
import { ChangeEvent } from "react";
import { getArtist } from "@/lib/spotify/getArtist";
import Spinner from "./Spinner";
import { getArtistAlbums } from "@/lib/spotify/getArtistAlbums";
import { Artist } from "@/models/artist";
import AlbumCard from "./AlbumCard";
import type { AlbumType } from "@/lib/spotify/getArtistAlbums";
import SpotifyLogo from "./SpotifyLogo";
import ScrollToTopButton from "./ScrollToTopButton";

export default function MainSection() {
	const [albumFilter, setAlbumFilter] = useState<AlbumType>("any");
	const [isFetchingArtist, startFetchingArtist] = useTransition();
	const [inputValue, setInputvalue] = useState("");
	const [inputHasChanged, setInputHasChanged] = useState<boolean>(false);
	const user = useSpotifyStore((state) => state.user);
	const selectedArtist = useSpotifyStore((state) => state.selectedArtist);
	const followedArtistsList = useSpotifyStore(
		(state) => state.followedArtistsList
	);
	const setSelectedArtist = useSpotifyStore(
		(state) => state.setSelectedArtist
	);
	const handleFollow = useSpotifyStore((state) => state.handleFollow);

	const following = useMemo(
		() =>
			followedArtistsList.some(
				(artist) => artist.id === selectedArtist?.id
			),
		[user, selectedArtist, followedArtistsList]
	);

	async function handleSearchArtist() {
		if (!inputHasChanged) {
			return;
		}
		setInputHasChanged(false);
		startFetchingArtist(async () => {
			try {
				const artistData: Artist | undefined = await getArtist({
					name: inputValue,
				});

				if (!artistData) {
					setSelectedArtist(undefined);
					return;
				}

				const albumsData = await getArtistAlbums(
					artistData.id,
					albumFilter
				);

				if (albumsData) {
					setSelectedArtist({
						...artistData,
						albums: albumsData,
					});
				}
			} catch (error) {
				console.error("Errore nel fetch artista:", error);
				setSelectedArtist(undefined);
			}
		});
	}

	async function handleToggle(artist: Artist) {
		try {
			await handleFollow(artist, following);
		} catch (error) {
			setSelectedArtist(artist);
		}
	}

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		setInputvalue(e.target.value);
		setInputHasChanged(true);
	}

	async function handleSendEmail() {
		const res = await fetch("/api/send-email", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`,
			},
		});

		console.log("email:", res);
	}

	async function handleUpdateArtists() {
		const res = await fetch("/api/update-artists", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log("artists", res);
	}

	return (
		<>
			{/* <Button className="text-lg" onClick={handleSendEmail}>
				Send Email
			</Button> */}

			<h1 className="text-xl ">Search for an artist to follow</h1>

			<Input
				onChange={handleInput}
				value={inputValue}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						handleSearchArtist();
					}
				}}
			/>
			<SpotifyLogo
				variant="green"
				text="Data provided by"
				href="https://open.spotify.com/"
			/>
			<Button
				className="mb-2 text-lg "
				onClick={handleSearchArtist}
				disabled={isFetchingArtist || !inputHasChanged}
			>
				Get Artist
			</Button>

			<div className="w-[90%]">
				{isFetchingArtist ? (
					<div className="flex flex-col items-center">
						<Spinner className="mt-16 mb-4" />
						<p>Connecting to Spotify...</p>
					</div>
				) : (
					selectedArtist &&
					selectedArtist.images?.[0]?.url && (
						<>
							<ArtistCard
								className="md:flex-row items-center mb-4"
								isLoggedIn={!!user}
								onFollow={handleToggle}
								following={following}
								artist={selectedArtist}
								key={selectedArtist.id}
								imageSrc={selectedArtist.images[0].url}
							/>
							<ul className="grid grid-cols-1 sm:grid-cols-2  gap-4 justify-center">
								{selectedArtist.albums
									?.slice(0, 19)
									.map((album) => {
										return (
											<AlbumCard
												key={"/" + album.id}
												className="w-full"
												imageSrc={album.images[0].url}
												album={album}
											/>
										);
									})}
							</ul>
							<p className="mt-3 w-full flex justify-center">
								<SpotifyLogo
									variant={"white"}
									text={"See more on"}
									className="mt-2"
									href={`https://open.spotify.com/artist/${selectedArtist.id}`}
								/>
							</p>
						</>
					)
				)}
			</div>
			<ScrollToTopButton />
		</>
	);
}
