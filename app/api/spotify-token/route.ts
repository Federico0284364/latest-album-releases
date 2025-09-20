import { NextResponse } from "next/server";

let cachedToken = "";
let tokenExpiresAt = 0;

export async function POST() {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		return NextResponse.json(
			{ error: "Missing Spotify client ID or secret in env" },
			{ status: 500 }
		);
	}

	const now = Date.now();

	// Se token valido, restituiscilo
	if (cachedToken && now < tokenExpiresAt) {
		return NextResponse.json({
			access_token: cachedToken,
			expires_in: (tokenExpiresAt - now) / 1000,
		});
	}

	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");

	const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
		"base64"
	);

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${basicAuth}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{ error: errorData },
				{ status: response.status }
			);
		}

		const data = await response.json();
		console.log(data);

		cachedToken = data.access_token;
		tokenExpiresAt = now + (data.expires_in - 60) * 1000;

		return NextResponse.json(
			{ access_token: data.access_token, expires_in: data.expires_in },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
