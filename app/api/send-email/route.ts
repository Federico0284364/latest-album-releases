import { NextRequest, NextResponse } from "next/server";
import { MyUser } from "@/models/user";
import { getAllUsersFromDbAdmin } from "@/lib/firebase/database-functions/userFunctionsToDbAdmin";
import { getFollowedArtistsFromDbAdmin } from "@/lib/firebase/database-functions/artistFunctionsToDbAdmin";
import { Album } from "@/models/album";
import { Artist } from "@/models/artist";
import { sendEmail } from "@/lib/email/send-email";
import { isWithinLastDays } from "@/lib/utils/date";
import { getSettingsFromDbAdmin } from "@/lib/firebase/database-functions/settingFunctionsToDbAdmin";

export async function GET(req: NextRequest) {
	if (
		req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const today = new Date();
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(today.getDate() - 7);

	try {
		const users = await getAllUsersFromDbAdmin();

		if (!users || users.length === 0) {
			return NextResponse.json(
				{ error: "Nessun utente trovato" },
				{ status: 404 }
			);
		}

		const usersData = await Promise.all(
			users.map(async (user) => {
				const followedArtists = await getFollowedArtistsFromDbAdmin(
					user.uid
				);

				return {
					uid: user.uid,
					email: user.email,
					name: user.displayName,
					followedArtists: followedArtists as Artist[],
				} as MyUser;
			})
		);

		for (const user of usersData) {
			const settings = await getSettingsFromDbAdmin(user.uid);
			if (!settings?.email?.weeklyEmails) {
				continue;
			}

			const followedArtists = user.followedArtists;
			let newAlbums: Album[] = [];
			let oldAlbums: Album[] = [];

			if (!followedArtists || followedArtists.length === 0) {
				continue;
			}

			for (const artist of followedArtists) {
				const albums = artist.albums;

				newAlbums.push(
					...albums.filter((album) => {
						const releaseDate = new Date(album.release_date);
						return isWithinLastDays(releaseDate, 7);
					})
				);

				oldAlbums.push(
					...albums.filter((album) => {
						const releaseDate = new Date(album.release_date);
						return !isWithinLastDays(releaseDate, 365);
					})
				);
			}

			oldAlbums = oldAlbums.sort(() => Math.random() - 0.5).slice(0, 3);
			await sendEmail(user, newAlbums, oldAlbums);
		}

		console.log("✅ Email inviate con successo.");
		return NextResponse.json(
			{ message: "Email inviata con successo" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("🔥 Errore durante l'invio delle email:", error);
		return NextResponse.json(
			{ error: "Errore nell'invio email" },
			{ status: 500 }
		);
	}
}
