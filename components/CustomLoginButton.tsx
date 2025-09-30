"use client";

import { useEffect, useState } from "react";
import { auth, provider, signInWithPopup } from "@/lib/firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function LoginButton() {
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

  if (user) return null; // se loggato non mostra Login

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Errore login:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
    >
      Login with Google
    </button>
  );
}
