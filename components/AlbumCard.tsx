import Card from "./Card";
import Image from "next/image";
import type { Album } from "@/models/album";
import { makeDatePretty } from "@/lib/utils/date";
import { twMerge } from "tailwind-merge";
import { capitalize } from "@/lib/utils/text";
import { formatAlbumType } from "@/lib/utils/album-type";
import { Fragment } from "react";

type Props = {
	album: Album;
	imageSrc: string;
	className?: string;
	showAlbumType?: boolean;
	showArtistName?: boolean;
	showCard?: boolean;
	showReleaseDate?: boolean;
};

export default function AlbumCard({
	album,
	imageSrc,
	className,
	showAlbumType = false,
	showArtistName = false,
	showCard = true,
	showReleaseDate = true,
}: Props) {
	let albumType: string = formatAlbumType(
		album.album_type,
		album.total_tracks
	);

	return (
		<Card
			data-testid={"card"}
			className={twMerge(
				"w-full border-border-muted border-1",
				className, 
				!showCard && 'contents'
			)}
		>
			{HorizontalContent()}
		</Card>
	);

	function HorizontalContent() {
		return (
			<a
				className="p-1 flex gap-4 items-center"
				href={album.external_urls.spotify}
				target="__blank"
			>
				<Image
					className=" rounded-sm"
					src={imageSrc}
					alt={`${album.name} cover`}
					width={100}
					height={100}
				/>

				<div className="flex-1">
					{showAlbumType && (
						<p
							className={twMerge(
								"text-fg-muted text-sm italic w-fit px-1.5 py-0.5 rounded-full",
								album.album_type === "album"
									? "bg-blue-500/40"
									: "bg-fg/50 text-black"
							)}
						>
							{capitalize(albumType)}
						</p>
					)}
					<h2 className="text-lg mt-2 text-fg">{album.name}</h2>
					<ul className={twMerge( showArtistName ? "mb-2" : "mb-2")}>
						{showArtistName &&
							album.artists.map((artist, index) => (
								<span
									key={"album card" + artist.id}
									className="text-sm text-fg-muted overflow-ellipsis"
								>
									{index > 0 && <span>, </span>}
									<span className="overflow-ellipsis whitespace-nowrap">{artist.name}</span>
								</span>
							))}
					</ul>

					<p className="text-fg-muted flex flex-wrap justify-between text-sm">
						<span className="text-xs sm:text-md mr-3">
							{album.total_tracks +
								(album.total_tracks > 1 ? " tracks" : " track")}
						</span>
						{showReleaseDate && <span className="text-xs sm:text-md">
							{makeDatePretty(new Date(album.release_date))}
						</span>}
					</p>
				</div>
			</a>
		);
	}

	function VerticalContent() {
		return (
			<a href={album.external_urls.spotify} target="__blank">
				<div className="gap-3 p-5">
					<Image
						className="w-full rounded-sm"
						src={imageSrc}
						alt={`${album.name} cover`}
						width={100}
						height={100}
					/>
				</div>
				{showAlbumType && (
					<p
						className={twMerge(
							"text-fg-muted text-sm italic w-fit px-1.5 py-0.5 rounded-full",
							album.album_type === "album"
								? "bg-blue-500/40"
								: "bg-fg/50 text-black"
						)}
					>
						{capitalize(albumType)}
					</p>
				)}
				<h2 className="text-xl mt-4 text-fg">{album.name}</h2>
				<ul className={showArtistName ? "mb-2" : "mb-2"}>
					{showArtistName &&
						album.artists.map((artist) => (
							<h3
								key={"album card" + artist.id}
								className="text-md text-fg-muted"
							>
								{artist.name}
							</h3>
						))}
				</ul>

				<p className="text-fg-muted flex flex-wrap justify-between text-sm">
					<span className="text-sm sm:text-md mr-3">
						{album.total_tracks +
							(album.total_tracks > 1 ? " tracks" : " track")}
					</span>
					<span className="text-sm sm:text-md">
						{makeDatePretty(new Date(album.release_date))}
					</span>
				</p>
			</a>
		);
	}
}
