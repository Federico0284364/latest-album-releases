import { db } from "../firestore";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import type { Settings } from "@/models/settings";

export async function saveSettingsToDb<
	S extends Extract<keyof Settings, string>,
	K extends keyof Settings[S]
>(userId: string, section: S, key: K, value: Settings[S][K]) {
	const settingRef = doc(db, "users", userId, "settings", section);
	await setDoc(settingRef, { [key]: value }, { merge: true });
}

export async function getSettingsFromDb(userId: string) {
	const settingsRef = collection(db, "users", userId, "settings");
	const settingsSnap = await getDocs(settingsRef);
	const settingsArray = settingsSnap.docs.map((setting) => setting.data());
	
	const settings: Record<string, any> = {};
  settingsSnap.docs.forEach(docSnap => {
    settings[docSnap.id] = docSnap.data();
  });
	return settings as Settings;
}
