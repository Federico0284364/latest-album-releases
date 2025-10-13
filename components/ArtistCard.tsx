"use client";

import Image from "next/image";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { useState } from "react";
import { Artist } from "@/models/artist";
import Card from "./Card";

type Props = {
	imageSrc: string;
	artist: Artist;
	following: boolean;
	className?: string;
	isLoggedIn: boolean;
	onFollow: (artist: Artist) => void;
};

export default function ArtistCard({
	imageSrc,
	artist,
	following,
	className,
	isLoggedIn,
	onFollow,
}: Props) {
	return (
		<Card data-testid={'card'} className={twMerge('border-1 border-border-muted', className)}>
			<Image
				className="w-40 aspect-square rounded-full object-cover bg-dark"
				src={imageSrc}
				alt={artist.name + "image"}
				width={100}
				height={100}
			/>

			<div className="flex flex-col items-center">
				<h1 className="mt-4 text-3xl text-center">{artist.name}</h1>
				{isLoggedIn ? (
					<Button
						onClick={() => onFollow(artist)}
						variant={following ? "primary" : "secondary"}
						className="mt-3"
					>
						{following ? "Following" : "Follow"}
					</Button>
				) : (
					<p className="text-fg-muted text-sm mt-4">
						You haven't logged in yet
					</p>
				)}
			</div>
		</Card>
	);
}
