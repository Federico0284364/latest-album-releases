import { adminDb } from "../admin/firebaseAdmin";
import type { Settings } from "@/models/settings";

export async function getSettingsFromDbAdmin(userId: string) {
	const settingsRef = adminDb
		.collection("users")
		.doc(userId)
		.collection("settings");

	const settingsSnap = await settingsRef.get();
	const settings: Record<string, any> = {};

	settingsSnap.forEach((docSnap) => {
		settings[docSnap.id] = docSnap.data();
	});

	return settings as Settings;
}
