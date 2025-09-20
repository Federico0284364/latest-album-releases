import { db } from "@/lib/firebase/firestore";
import { Artist } from "@/models/artist";
import { setDoc, doc } from "firebase/firestore";
import type { User } from "firebase/auth";

export async function saveUserDataToDb(user: User) {
	try {
		const docRef = doc(db, "users", user.uid);

    const userData = {
			uid: user.uid,
			displayName: user.displayName ?? null,
			email: user.email,
		};

		await setDoc(docRef, userData, {merge: true});
	} catch (error) {
		console.error(
			"Errore durante il salvataggio dell'artista su Firestore:",
			error
		);
		throw new Error("Impossibile salvare l'artista. Riprova più tardi.");
	}
}
