"use client";

import { useEffect, useState } from "react";
import {
	auth,
	provider,
	signInWithPopup,
	signOut,
} from "@/lib/firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function CustomLogButton() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	if (loading) {
		return <p>Loading...</p>;
	}

	const handleLogin = async () => {
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Errore login:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push("/");
		} catch (error) {
			console.error("Errore logout:", error);
		}
	};

	return (
		<div className="flex flex-col items-center text-white gap-4 p-4">
			{user ? (
				<>
					
					<button
						onClick={handleLogout}
						className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
					>
						Logout
					</button>
				</>
			) : (
				<>
					
					<button
						onClick={handleLogin}
						className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
					>
						Login with Google
					</button>
				</>
			)}
		</div>
	);
}
