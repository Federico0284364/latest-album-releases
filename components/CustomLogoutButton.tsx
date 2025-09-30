"use client";

import { useEffect, useState } from "react";
import { auth, signOut } from "@/lib/firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null; // o loading spinner

  if (!user) return null; // se non loggato non mostra Logout

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Errore logout:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
