/* import { NextRequest, NextResponse } from "next/server";
import { MyUser } from "@/models/user";
import { getAllUsersFromDb } from "@/lib/firebase/database-functions/getAllUsersFromDb";
import { getFollowedArtistsFromDbAdmin } from "@/lib/firebase/database-functions/getFollowedArtistsFromDb-admin";
import { Album } from "@/models/album";
import { Artist } from "@/models/artist";
import { delay } from "@/lib/utils/delay";
import { sendEmail } from "@/lib/email/send-email";
import { isWithinLastDays } from "@/lib/utils/date";
import { getArtistAlbums } from "@/lib/spotify/getArtistAlbums";

export async function POST(req: NextRequest) {
	const today = new Date();
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(today.getDate() - 7);

	try {
		const users: MyUser[] | undefined = await getAllUsersFromDb();
		console.log("📦 Utenti trovati nel DB:", users?.length ?? 0);

		if (!users || users.length === 0) {
			console.log("❌ Nessun utente trovato.");
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
				console.log(
					`👤 Utente: ${user.email} | Artisti seguiti: ${followedArtists.length}`
				);
				return {
					uid: user.uid,
					email: user.email,
					followedArtists: followedArtists as Artist[],
				} as MyUser;
			})
		);

		for (const user of usersData) {
			const followedArtists = user.followedArtists;
			const newAlbums: Album[] = [];

			if (!followedArtists || followedArtists.length === 0) {
				console.log(
					`⚠️ Utente ${user.email} non segue nessun artista.`
				);
				continue;
			}

			for (const artist of followedArtists) {
				console.log(
					`🎵 Fetching album per artista: ${artist.name || artist.id}`
				);

				const albums = await getArtistAlbums(artist.id, "album");
				if (!albums) {
					console.error(`❌ Errore fetch per artista ${artist.id}`);
					continue;
				}

				console.log(
					`📀 Album totali trovati per ${artist.name || artist.id}: ${
						albums.length
					}`
				);

				await delay(2000);

				artist.albums = albums.filter((album) => {
					const releaseDate = new Date(album.release_date);
					return isWithinLastDays(releaseDate, 15);
				});

				console.log(
					`🆕 Nuovi album di ${
						artist.name || artist.id
					} (ultimi 7 giorni): ${artist.albums.length}`
				);
				newAlbums.push(...artist.albums);
			}

			console.log(
				`📧 Invio email a ${user.email} con ${newAlbums.length} nuovi album.`
			);
			await sendEmail(user, newAlbums, followedArtists);
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
 */