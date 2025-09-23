"use client";
import { ReactNode } from "react";
import { useState } from "react";
import MenuButton from "./MenuButton";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
	children: ReactNode;
};

export default function DrawerMenu({ children }: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	function handleClick() {
		setIsOpen((prevState) => !prevState);
	}

	return (
		<div>
			<MenuButton onClick={handleClick} isOpen={isOpen}/>

			<AnimatePresence>
				{isOpen && (
					<Card
						onClick={handleClick}
						initial={{ x: 1000 }}
						animate={{ x: 0 }}
						transition={{ type: "tween" }}
						className="text-xl origin-top p-6 flex flex-col bg-dark absolute right-0 top-26 bottom-0 w-[100vw] whitespace-nowrap"
						exit={{ x: 1000 }}
					>
						{children}
					</Card>
				)}
			</AnimatePresence>
		</div>
	);
}
