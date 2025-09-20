import { NextResponse } from "next/server";

export async function GET(
	req: Request,
	context: { params: { artistId: string } }
) {
	const artistId = context.params.artistId;

	const { searchParams } = new URL(req.url);
	const albumType = searchParams.get("include_groups");

	try {
		if (!artistId) {
		return NextResponse.json(
			{ error: "Missing artist id" },
			{ status: 400 }
		);
	}
	
		const tokenRes = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-token`,
			{
				method: "POST",
			}
		);

		if (!tokenRes.ok) {
			console.error(
				"Errore nel recuperare il token:",
				await tokenRes.text()
			);
			return NextResponse.json(
				{ error: "Failed to get token" },
				{ status: 500 }
			);
		}

		const tokenData = await tokenRes.json();
		const accessToken = tokenData.access_token;

		const spotifyRes = await fetch(
			`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=${albumType}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!spotifyRes.ok) {
			console.error("Errore Spotify:", await spotifyRes.text());
			return NextResponse.json(
				{ error: "Can't retrieve artist's albums data" },
				{ status: spotifyRes.status }
			);
		}

		const albums = await spotifyRes.json();
		return NextResponse.json(albums);
	} catch (error) {
		console.error("Errore nella chiamata:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

