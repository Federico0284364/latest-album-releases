"use client";
import { ReactNode } from "react";
import { useState, useEffect } from "react";
import MenuButton from "./MenuButton";
import Card from "./Card";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

type Props = {
	children: ReactNode;
	className?: string
};

export default function DrawerMenu({ children, className }: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	function handleClick() {
		setIsOpen((prevState) => !prevState);
	}

	useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Pulizia al dismount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

	return (
		<div className={twMerge('z-1000', className)}>
			<MenuButton onClick={handleClick} isOpen={isOpen}/>

			<AnimatePresence>
				{isOpen && (
					<Card
						onClick={handleClick}
						initial={{ x: 1000 }}
						animate={{ x: 0 }}
						transition={{ type: "tween" }}
						className="text-xl origin-top p-6 flex flex-col bg-dark fixed right-0 top-26 bottom-0 w-[100vw] whitespace-nowrap"
						exit={{ x: 1000 }}
					>
						{children}
					</Card>
				)}
			</AnimatePresence>
		</div>
	);
}
