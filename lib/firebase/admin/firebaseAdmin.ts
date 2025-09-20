import admin from "firebase-admin";

// Debug variabili d'ambiente
console.log("ENV check:", {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? "OK" : "MISSING",
});

// Inizializza Admin SDK solo se non già inizializzato
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // trasforma "\n" in veri ritorni a capo
    }),

  });
}

export const adminDb = admin.firestore();
