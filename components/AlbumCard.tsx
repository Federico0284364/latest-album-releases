import Card from "./Card";
import Image from "next/image";
import type { Album } from "@/models/album";
import { makeDatePretty } from "@/lib/utils/date";
import { twMerge } from "tailwind-merge";
import { capitalize } from "@/lib/utils/text";

type Props = {
	album: Album;
	imageSrc: string;
	className?: string;
	showAlbumType?: boolean;
	showArtistName?: boolean;
};

export default function AlbumCard({
	album,

	imageSrc,
	className,
	showAlbumType = false,
	showArtistName = false,
}: Props) {
	return (
		<Card className={twMerge("w-60", className)}>
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
				{showAlbumType && <p
					className={twMerge(
						"text-fg-muted text-sm italic w-fit px-1.5 py-0.5 rounded-full",
						album.album_type === "album"
							? "bg-blue-500/40"
							: "bg-fg/50 text-black"
					)}
				>
					{capitalize(album.album_type)}
				</p>}
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

				<p className="text-fg-muted flex justify-between text-sm">
					<span className="">
						{album.total_tracks +
							(album.total_tracks > 1 ? " tracks" : " track")}
					</span>
					<span className="">
						{makeDatePretty(new Date(album.release_date))}
					</span>
				</p>
			</a>
		</Card>
	);
}
