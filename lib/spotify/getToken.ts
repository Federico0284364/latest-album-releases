export async function getToken() {
	const tokenRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-token`,
		{
			method: "POST",
		}
	);

	if (!tokenRes.ok) {
		console.error("Errore nel recuperare il token:", await tokenRes.text());
		throw new Error("errore nel fetch del token");
	}

	const tokenData = await tokenRes.json();
	const accessToken = tokenData.access_token;

	return accessToken;
}
