import { db } from "../firestore";
import { collection, doc, getDocs, setDoc, getDoc, updateDoc } from "firebase/firestore";
import type { Settings } from "@/models/settings";
import type { MyUser } from "@/models/user";

export async function saveSettingToDb<
	S extends Extract<keyof Settings, string>,
	K extends keyof Settings[S]
>(userId: string, section: S, key: K, value: Settings[S][K]) {
	const userRef = doc(db, "users", userId);
	const fieldPath = `settings.${section}.${String(key)}`;
	await updateDoc(userRef, { [fieldPath]: value });
}

export async function getSettingsFromDb(userId: string) {
	const userRef = doc(db, "users", userId);
	const userSnap = await getDoc(userRef);

	if (!userSnap.exists()) {
		throw new Error(`User with id '${userId}' not found in Firestore.`);
	}

	const user = userSnap.data() as MyUser;
	const settings: Settings = user.settings;
	
	return settings;
}
