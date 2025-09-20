
import { adminDb } from "../admin/firebaseAdmin";

export async function getAllUsersFromDbAdmin(){
	try {
		const usersSnap = await adminDb.collection('users').get();
		const users = usersSnap.docs.map(user => user.data())
		return users;
	} catch (error){
		throw error;
	}
	
}