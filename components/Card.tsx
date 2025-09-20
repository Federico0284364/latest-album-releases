import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
	children: ReactNode;
	className?: string;
};

export default function Card({ className, children }: Props) {
	return (
		<div
			className={twMerge(
				"p-4 bg-medium rounded-lg flex flex-col gap-8 w-full",
				className
			)}
		>
			{children}
		</div>
	);
}
