import Card from "./Card";
import Image from "next/image";
import type { Album } from "@/models/album";
import { makeDatePretty } from "@/lib/utils/date";
import { twMerge } from "tailwind-merge";

type Props = {
	album: Album;
	imageSrc: string;
	className?: string;
	artistNameIsVisible?: boolean;
};

export default function AlbumCard({
	album,
	imageSrc,
	className,
	artistNameIsVisible = false,
}: Props) {
	return (
		<Card className={twMerge("w-60", className)}>
			<a href={album.external_urls.spotify} target="__blank">
				<div className="flex gap-3 p-5">
					<Image
						className="w-full rounded-sm"
						src={imageSrc}
						alt={`${album.name} cover`}
						width={100}
						height={100}
					/>
				</div>

				<h2 className="text-xl mt-4 text-fg">{album.name}</h2>
				<ul className={artistNameIsVisible ? 'mb-2' : 'mb-2'}>
					{artistNameIsVisible &&
						album.artists.map((artist) => (
							<h3 className="text-md text-fg-muted">{artist.name}</h3>
						))}
				</ul>
				<p className="text-fg-muted flex justify-between text-sm">
					<span className="">{album.total_tracks + " tracks"}</span>
					<span className="">
						{makeDatePretty(new Date(album.release_date))}
					</span>
				</p>
			</a>
		</Card>
	);
}
