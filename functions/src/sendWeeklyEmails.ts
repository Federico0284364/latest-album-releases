// functions/src/sendWeeklyEmails.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,     // email reale da cui inviare
    pass: process.env.GMAIL_PASSWORD, // app password o token SMTP
  },
});

// Scheduler v1: .schedule().onRun()
export const sendWeeklyEmails = functions.pubsub
  .schedule("every 1 minutes")      // per test puoi usare ogni minuto
  .timeZone("Europe/Rome")          // imposta la tua timezone
  .onRun(async (context) => {
    const db = admin.firestore();
    const usersSnap = await db.collection("users").get();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 20); // per test

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const email = userData.email;

      const artistsSnap = await db.collection(`users/${userId}/artists`).get();
      const newAlbums: { artist: string; albums: { title: string; releaseDate: string }[] }[] = [];

      for (const artistRef of artistsSnap.docs) {
        const artistId = artistRef.id;
        const artistDoc = await db.doc(`artists/${artistId}`).get();

        if (artistDoc.exists) {
          const artistData = artistDoc.data()!;
          const albums: { title: string; releaseDate: string }[] = artistData.albums || [];
          const recent = albums.filter(a => new Date(a.releaseDate) >= oneWeekAgo);

          if (recent.length > 0) {
            newAlbums.push({ artist: artistData.name, albums: recent });
          }
        }
      }

      if (newAlbums.length > 0) {
        const html = `
          <h2>Nuove uscite della settimana 🎶</h2>
          ${newAlbums
            .map(a => `<h3>${a.artist}</h3><ul>${a.albums.map(al => `<li>${al.title} (${al.releaseDate})</li>`).join("")}</ul>`)
            .join("")}
        `;

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Le nuove uscite dai tuoi artisti preferiti",
          html,
        });
      }
    }
  });
