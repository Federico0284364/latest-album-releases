import nodemailer from "nodemailer";
import { Album } from "@/models/album";
import { User } from "firebase/auth";
import { Artist } from "@/models/artist";


export async function sendEmail(user: User, newAlbums: Album[], followedArtists: Artist[]) {
  const to = user.email;
  if (!to) {
    console.warn(`Utente ${user.uid} senza email, salto invio`);
    return;
  }

  const subject = "Weekly new releases report ";

  const albumsListHTML = newAlbums
    .map((album) => {
      return `
        <li>
          <a href="${album.external_urls.spotify}">
            <img src="${album.images[0]?.url || ''}" alt="${album.name}" style="width:100px; vertical-align:middle; margin-right:10px; margin-bottom:12px" />
            <strong>${album.name}</strong> by <em>${album.artists[0]?.name || "Unknown artist"}</em> (${album.release_date})
          </a>
        </li>
      `;
    })
    .join("");

  const html = `
    <h2>Hi!</h2>
    <p>This is what came out in the last week:</p>
    <ul>
      ${albumsListHTML}
    </ul>
    <p>🎶 Happy listening!</p>
  `;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Tuo Nome" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`Email inviata a ${to}`);
  } catch (error) {
    console.error(`Errore invio email a ${to}:`, error);
  }
}
