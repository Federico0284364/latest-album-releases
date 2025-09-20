'use server'
import { adminDb } from "../admin/firebaseAdmin";

export async function updateAlbumsToDb(artistId: string) {
	const tokenRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify-token`,
		{
			method: "POST",
		}
	);
	const tokenData = await tokenRes.json();
	const accessToken = tokenData.access_token;

	const res = await fetch(
		`https://api.spotify.com/v1/artists/${artistId}/albums`,
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	);
	const data = await res.json();
	console.log(data)

	const oneWeekAgo = new Date();
	oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

	const albums = data.items;

	await adminDb.collection(`artists`).doc(artistId).update({
		albums,
		updatedAt: new Date().toISOString(),
});
}
