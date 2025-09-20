import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin/firebaseAdmin";
import { updateAlbumsToDb } from "@/lib/firebase/database-functions/updateAlbumsToDb";
import { FieldPath } from "firebase-admin/firestore";

// Delay helper
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET(req: NextRequest) {
  try {
    const stateRef = adminDb.collection("state").doc("batch");
    const stateSnap = await stateRef.get();
    const stateData = stateSnap.data() || {};
    let lastUpdatedId = stateData.lastUpdatedId || ""; // ID dell'ultimo artista processato

    // Prendi batch di artisti ordinati per ID
    let query = adminDb.collection("artists").orderBy(FieldPath.documentId()).limit(5);
    if (lastUpdatedId) {
      query = query.startAfter(lastUpdatedId); // riparte dopo l'ultimo ID
    }

    const artistsSnap = await query.get();
    const artistDocs = artistsSnap.docs;

    if (artistDocs.length === 0) {
      lastUpdatedId = "";
    }

    for (const doc of artistDocs) {
      const id = doc.id;
      await updateAlbumsToDb(id);
      await sleep(300); // per rate limit Spotify
    }

    // Aggiorna lo stato con l'ID dell'ultimo artista processato
    if (artistDocs.length > 0) {
      lastUpdatedId = artistDocs[artistDocs.length - 1].id;
      await stateRef.set({ lastUpdatedId });
    }

    return NextResponse.json({ status: "ok", updated: artistDocs.length });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}
