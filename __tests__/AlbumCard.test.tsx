import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AlbumCard from "@/components/AlbumCard";
import { albums } from "@/mock/albums";
import { makeDatePretty } from "@/lib/utils/date";
import { formatAlbumType } from "@/lib/utils/album-type";

describe("AlbumCard", () => {
	const album = albums[0];
	const imageSrc = album.images[0].url;

	it("renders album name and image", () => {
		render(<AlbumCard album={album} imageSrc={imageSrc} />);

		expect(screen.getByText(album.name)).toBeInTheDocument();

		const img = screen.getByAltText(`${album.name} cover`);
		expect(img).toBeInTheDocument();
	});

	it("renders album type if showAlbumType is true", () => {
		render(
			<AlbumCard album={album} imageSrc={imageSrc} showAlbumType={true} />
		);

		const albumTypeText = formatAlbumType(
			album.album_type,
			album.total_tracks
		);
		console.log(albumTypeText);
		expect(
			screen.getAllByText(new RegExp(albumTypeText, "i"))[0]
		).toBeInTheDocument();
	});

	it("renders artist names if showArtistName is true", () => {
		render(
			<AlbumCard
				album={album}
				imageSrc={imageSrc}
				showArtistName={true}
			/>
		);

		album.artists.forEach((artist) => {
			expect(screen.getByText(artist.name)).toBeInTheDocument();
		});
	});

	it("applies extra className to the Card wrapper", () => {
		const className = "custom-class";
		render(
			<AlbumCard
				album={album}
				imageSrc={imageSrc}
				className={className}
			/>
		);

		const card = screen.getByTestId('card');
		expect(card).toHaveClass("custom-class");
	});

	it("formats total_tracks and release_date correctly", () => {
		render(<AlbumCard album={album} imageSrc={imageSrc} />);

		const trackText = album.total_tracks > 1 ? "tracks" : "track";
		expect(
			screen.getByText(`${album.total_tracks} ${trackText}`)
		).toBeInTheDocument();

		const formattedDate = new Date(album.release_date)
			.getFullYear()
			.toString();
		expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();
	});
});
