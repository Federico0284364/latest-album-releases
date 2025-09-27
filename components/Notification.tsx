import { ReactNode, useEffect, useState } from "react";
import Card from "./Card";
import { twMerge } from "tailwind-merge";

type Props = {
	message?: string;
	duration?: number;
	className?: string;
	onClose: () => void;
};

export default function Notification({
	duration = 3600,
	message,
	className,
	onClose,
}: Props) {
	useEffect(() => {
		if (!message) {
			return;
		}

		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [message]);

	if (!message) return null;

	return (
		<Card
		initial={{y: 100}}
		animate={{y: 0}}
		exit={{y: 100}}
		transition={{type: 'tween'}}
			className={twMerge(
				"fixed bottom-0 text-center text-lg bg-danger rounded-b-none",
				className
			)}
		>
			<p>{message}</p>
		</Card>
	);
}
