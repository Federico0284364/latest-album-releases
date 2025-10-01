
import { db } from "@/lib/firebase/firestore";
import { setDoc, getDoc, doc } from "firebase/firestore";
import type { MyUser } from "@/models/user";


export async function saveUserDataToDb(user: MyUser) {
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

export async function getUserDataFromDb(userId: string){
	const docRef = doc(db, "users", userId);
	const docSnap = getDoc(docRef);
	const userData = (await docSnap).data() as MyUser;

	return userData;
}