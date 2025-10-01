import { adminDb } from "../admin/firebaseAdmin";
import type { Settings } from "@/models/settings";

export async function getSettingsFromDbAdmin(userId: string) {
	const userRef = adminDb
		.collection("users")
		.doc(userId)

	const userSnap = await userRef.get();
	const user = userSnap.data();
	const settings = user?.settings;
	
	return settings as Settings;
}
