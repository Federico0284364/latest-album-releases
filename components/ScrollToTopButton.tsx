"use client";

import { ButtonHTMLAttributes, useEffect, useState } from "react";
import Button from "./Button";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function ScrollToTopButton({ className, ...props }: Props) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsVisible(window.scrollY > 200);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<AnimatePresence>
			{isVisible && <Button
				initial={{ y: 100 }}
				animate={{ y: 0 }}
				exit={{ y: 100 }}
				transition={{ duration: 0.2 }}
				className={twMerge(
					"text-fg bg-light hover:opacity-20 border-border rounded-full fixed bottom-4 right-4 z-100 w-12 h-12",
					className
				)}
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<svg
					viewBox="0 0 24 24"
					fill="currentColor"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"
						fill="hsl(212 100% 97%)"
					/>
				</svg>
			</Button>}
		</AnimatePresence>
	);
}
