import nodemailer from "nodemailer";
import { Album } from "@/models/album";
import type { MyUser } from "@/models/user";
import { Artist } from "@/models/artist";

export async function sendEmail(user: MyUser, newAlbums: Album[], oldAlbums: Album[]) {
	const to = user.email;
	if (!to) {
		console.warn(`Utente ${user.uid} senza email, salto invio`);
		return;
	}

	const subject = "Weekly new releases report ";

  const albumsList = newAlbums.length ? newAlbums : oldAlbums;
	let albumsListHTML: string = "";

		albumsListHTML = albumsList
			.map((album) => {
				return `
        <li>
          <a href="${album.external_urls.spotify}">
            <img src="${album.images[0]?.url || ""}" alt="${
					album.name
				}" style="width:100px; vertical-align:middle; margin-right:10px; margin-bottom:12px" />
            <strong>${album.name}</strong> by <em>${
					album.artists[0]?.name || "Unknown artist"
				}</em> (${new Date(album.release_date).toLocaleDateString('it-IT', {year: 'numeric'})})
          </a>
        </li>
      `;
			})
			.join("");
	

	let html: string = "";

	if (newAlbums.length) {
		html = `
    <h2>Good morning, ${user.name}</h2>
    <p>This is what came out in the last week:</p>
    <ul>
      ${albumsListHTML}
    </ul>
    <p>🎶 Happy listening!</p>
  `;
	} else {
		html = `
    <h2>Good morning, ${user.name}</h2>
    <p>Unfortunately nothing came out last week :(</p>
    <p>In the meantime you can always take a trip down memory lane with this records:</p>
    <ul>
      ${albumsListHTML}
    </ul>
    <p>🎶 Happy listening!</p>
  `;
	}

	try {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASSWORD,
			},
		});

		await transporter.sendMail({
			from: `"" <${process.env.GMAIL_USER}>`,
			to,
			subject,
			html,
		});

		console.log(`Email inviata a ${to}`);
	} catch (error) {
		console.error(`Errore invio email a ${to}:`, error);
	}
}
