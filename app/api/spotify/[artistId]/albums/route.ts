import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase/admin/firebaseAdmin";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ artistId: string }> }
) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const idToken = authHeader.split(" ")[1];

	try {
		const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
		const uid = decodedToken.uid;
		// l'utente è autenticato, procedi
		console.log("Utente loggato:", uid);
	} catch (error) {
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}

	const artistId = (await params).artistId;
	if (!artistId) {
		return NextResponse.json(
			{ error: "Missing artist id" },
			{ status: 400 }
		);
	}

	const { searchParams } = new URL(req.url);
	const albumType = searchParams.get("include_groups");

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
