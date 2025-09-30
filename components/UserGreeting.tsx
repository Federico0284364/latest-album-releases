"use client";

import { useSpotifyStore } from "@/store/store";
import Link from "next/link";

export default function UserGreeting() {
	const user = useSpotifyStore((state) => state.user);

	return (
		<Link href="/settings">
			<h1 className="text-fg text-xl sm:text-2xl mr-10">{`${getGreeting()}, ${user?.displayName?.split(" ")[0]}`}</h1>
			
		</Link>
	);
}

function getGreeting(): string {
	const hour = new Date().getHours();

	if (hour >= 6 && hour < 13) {
		return "Good morning";
	} else if (hour >= 13 && hour < 18) {
		return "Good afternoon";
	} else {
		return "Good evening";
	}
}
