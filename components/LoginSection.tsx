"use client";

import { useSpotifyStore } from "@/store/store";
import LoginButton from "./CustomLoginButton";
import UserGreeting from "./UserGreeting";

export default function LoginSection() {
	const user = useSpotifyStore((state) => state.user);

	return <>{user ? <UserGreeting /> : <LoginButton />}</>;
}
