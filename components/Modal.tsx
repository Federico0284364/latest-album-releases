"use client";

import Button from "./Button";
import Card from "./Card";
import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

type Props = MotionProps &
	React.HTMLAttributes<HTMLDivElement> & {
		className?: string;
		isOpen: boolean;
		onClose: () => void;
		children: ReactNode;
	};

export default function Modal({
	className,
	isOpen,
	onClose,
	children,
	...props
}: Props) {
	if (!isOpen) {
		return null;
	}

	return (
		<motion.div
			layout
			onClick={onClose}
			className=" flex justify-center items-center bg-black/60 z-1000 fixed top-0 right-0 bottom-0 left-0 "
		>
			<Card
				onClick={(e) => e.stopPropagation()}
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: "tween", duration: 0.25 }}
				className={
					className +
					" z-[-100] relative gap-4 w-90 flex flex-col p-6 gradient-color rounded-xl"
				}
				{...props}
			>
				<Button
					onClick={onClose}
					variant="danger"
					className=" absolute top-3 right-3 text-lg"
				>
					X
				</Button>

				{children}
			</Card>
		</motion.div>
	);
}
