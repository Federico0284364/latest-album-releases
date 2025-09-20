import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const artistId = searchParams.get("id");
	const artistName = searchParams.get("name");

	if (!artistName) {
		return NextResponse.json(
			{ error: "Missing artist name" },
			{ status: 400 }
		);
	}

	try {
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

		let artist;

		if (artistId) {
			const spotifyRes = await fetch(
				`https://api.spotify.com/v1/artists/${artistId}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			checkResponse(spotifyRes);

			const data = await spotifyRes.json();
			artist = data;
		} else if (artistName) {
			const spotifyRes = await fetch(
				`https://api.spotify.com/v1/search?q=${encodeURIComponent(
					artistName
				)}&type=artist`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			checkResponse(spotifyRes);

			const data = await spotifyRes.json();
			artist = data.artists.items[0];
		} else {
			return NextResponse.json(
				{ error: "Missing artist identificator code" },
				{ status: 400 }
			);
		}

		

		

		return NextResponse.json(artist);
	} catch (error) {
		console.error("Errore nella chiamata:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

async function checkResponse(res: Response){
	if (!res || !res.ok) {
			console.error("Errore Spotify:", await res.text());
			 throw new Error(`Spotify error: ${res.status} 'Can't retrieve artist's data`);
		}
}
