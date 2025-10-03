import admin from "firebase-admin";
import type { App } from "firebase-admin/app";

let adminApp: App;
if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  adminApp = admin.app();
}

export const adminDb = admin.firestore();
export { adminApp };
